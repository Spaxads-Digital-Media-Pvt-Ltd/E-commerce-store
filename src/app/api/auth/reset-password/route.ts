import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { verifyResetToken } from "@/server/auth/reset-token";
import { hashPassword } from "@/server/auth/password";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/server/auth/session";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-reset-password", ip, 5, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { token, password } = parsed.data;

    const verified = verifyResetToken(token);
    if (!verified) {
      return apiError(
        "This reset link is invalid or has expired — request a new one.",
        400
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.update({
      where: { id: verified.userId },
      data: { passwordHash },
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions
    );
    return res;
  } catch (err) {
    return serverErrorResponse(err, "api/auth/reset-password");
  }
}
