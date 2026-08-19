import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { createResetToken } from "@/server/auth/reset-token";
import { sendPasswordResetEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";

// Always returns the same generic response whether or not the email
// exists, and whether or not sending succeeded — this endpoint must never
// reveal which emails have accounts (user enumeration).
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await rateLimit("auth-forgot-password", ip, 5, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { email } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      const token = createResetToken(user.id);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    return serverErrorResponse(err, "api/auth/forgot-password");
  }
}
