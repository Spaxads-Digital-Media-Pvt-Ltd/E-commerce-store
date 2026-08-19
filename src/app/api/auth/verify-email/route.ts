import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { verifyEmailOtp } from "@/server/auth/otp";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/server/auth/session";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import { toUserDTO } from "@/server/serializers";

const REASON_MESSAGE: Record<string, string> = {
  not_found: "No code was requested for this email — request a new one.",
  expired: "This code has expired — request a new one.",
  too_many_attempts: "Too many incorrect attempts — request a new code.",
  mismatch: "That code isn't right — check and try again.",
};

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-verify-email", ip, 10, 600);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a bit.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { email, code } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return apiError("No account found for this email.", 404);

    if (user.emailVerified) {
      const res = NextResponse.json({ user: toUserDTO(user) });
      res.cookies.set(
        SESSION_COOKIE,
        createSessionToken(user),
        sessionCookieOptions
      );
      return res;
    }

    const result = await verifyEmailOtp(user.id, code);
    if (!result.ok) {
      return apiError(REASON_MESSAGE[result.reason], 400);
    }

    const res = NextResponse.json({ user: toUserDTO({ ...user, emailVerified: true }) });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions
    );
    return res;
  } catch (err) {
    return serverErrorResponse(err, "api/auth/verify-email");
  }
}
