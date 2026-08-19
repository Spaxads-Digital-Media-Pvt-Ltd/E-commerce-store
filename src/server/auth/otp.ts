import { randomInt } from "crypto";
import { db } from "@/server/db";
import { hashPassword, verifyPassword } from "./password";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

// One pending OTP per user — creating a new one supersedes the old (a
// "resend" is just a fresh code, not a second valid one).
export async function createEmailOtp(userId: string): Promise<string> {
  const code = generateOtpCode();
  const codeHash = await hashPassword(code);
  await db.$transaction([
    db.emailOtp.deleteMany({ where: { userId } }),
    db.emailOtp.create({
      data: {
        userId,
        codeHash,
        expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
      },
    }),
  ]);
  return code;
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "mismatch" };

export async function verifyEmailOtp(
  userId: string,
  code: string
): Promise<VerifyOtpResult> {
  const otp = await db.emailOtp.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return { ok: false, reason: "not_found" };
  if (otp.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }
  if (otp.expiresAt < new Date()) {
    return { ok: false, reason: "expired" };
  }

  const valid = await verifyPassword(code, otp.codeHash);
  if (!valid) {
    await db.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "mismatch" };
  }

  await db.$transaction([
    db.emailOtp.deleteMany({ where: { userId } }),
    db.user.update({ where: { id: userId }, data: { emailVerified: true } }),
  ]);
  return { ok: true };
}
