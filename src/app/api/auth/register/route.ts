import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/lib/api";
import { toUserDTO } from "@/lib/serializers";

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
    if (existing) {
      return apiError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, passwordHash },
    });

    const res = NextResponse.json({ user: toUserDTO(user) }, { status: 201 });
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions
    );
    return res;
  } catch (err) {
    return serverErrorResponse(err, "api/auth/register");
  }
}
