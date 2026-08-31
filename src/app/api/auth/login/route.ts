import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/constants";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/server/auth/password";
import { createEmailOtp } from "@/server/auth/otp";
import { sendOtpEmail } from "@/server/email";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/server/auth/session";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import { toUserDTO } from "@/server/serializers";

const INVALID_CREDENTIALS = "Invalid email or password.";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-login", ip, 5, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return apiError(INVALID_CREDENTIALS, 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return apiError(INVALID_CREDENTIALS, 401);

    if (REQUIRE_EMAIL_VERIFICATION && !user.emailVerified) {
      const code = await createEmailOtp(user.id);
      await sendOtpEmail(user.email, code);
      return NextResponse.json(
        { requiresVerification: true, email: user.email },
        { status: 403 }
      );
    }

    const res = NextResponse.json({ user: toUserDTO(user) }, { status: 200 });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions
    );
    return res;
  } catch (err) {
    return serverErrorResponse(err, "api/auth/login");
  }
}
