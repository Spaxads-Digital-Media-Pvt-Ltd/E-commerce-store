import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/constants";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/server/auth/password";
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

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-register", ip, 5, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing?.emailVerified || (existing && !REQUIRE_EMAIL_VERIFICATION)) {
      return apiError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);

    if (!REQUIRE_EMAIL_VERIFICATION) {
      const user = await db.user.create({
        data: { name, email, passwordHash, emailVerified: true },
      });
      const res = NextResponse.json(
        { user: toUserDTO(user) },
        { status: 201 }
      );
      res.cookies.set(
        SESSION_COOKIE,
        createSessionToken(user),
        sessionCookieOptions
      );
      return res;
    }

    // An unverified account from an abandoned signup gets its details
    // refreshed and a fresh code — not treated as a conflict.
    const user = existing
      ? await db.user.update({
          where: { id: existing.id },
          data: { name, passwordHash },
        })
      : await db.user.create({
          data: { name, email, passwordHash, emailVerified: false },
        });

    const code = await createEmailOtp(user.id);
    await sendOtpEmail(user.email, code);

    return NextResponse.json(
      { requiresVerification: true, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    return serverErrorResponse(err, "api/auth/register");
  }
}
