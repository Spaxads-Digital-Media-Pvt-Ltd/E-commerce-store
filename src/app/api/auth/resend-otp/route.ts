import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { resendOtpSchema } from "@/lib/validations/auth";
import { createEmailOtp } from "@/server/auth/otp";
import { sendOtpEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";

// Generic response regardless of whether the account exists or is already
// verified — same user-enumeration guard as /api/auth/forgot-password.
const GENERIC_MESSAGE = "If that account needs verification, a new code was sent.";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-resend-otp", ip, 3, 600);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a bit.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = resendOtpSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { email } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) {
      const code = await createEmailOtp(user.id);
      await sendOtpEmail(user.email, code);
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    return serverErrorResponse(err, "api/auth/resend-otp");
  }
}
