import { Resend } from "resend";
import { STORE_NAME } from "@/lib/constants";

// Optional integration — degrades gracefully like Razorpay/Turnstile.
// Sign up free at https://resend.com, create an API key, set
// RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) in .env.

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let client: Resend | null = null;

function getClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

const FROM =
  process.env.RESEND_FROM_EMAIL ?? `${STORE_NAME} <onboarding@resend.dev>`;

async function send(
  to: string,
  subject: string,
  html: string,
  logContext: string
): Promise<{ ok: boolean }> {
  if (!isEmailConfigured()) {
    console.warn(`[email] RESEND_API_KEY not set — ${logContext} not sent.`);
    return { ok: false };
  }
  try {
    const { error } = await getClient().emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error("[email] Resend error", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false };
  }
}

export function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ ok: boolean }> {
  return send(
    to,
    `Reset your ${STORE_NAME} password`,
    `
      <p>We got a request to reset your ${STORE_NAME} password.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a> — this link expires in 30 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
    "password reset email"
  );
}

export function sendOtpEmail(to: string, code: string): Promise<{ ok: boolean }> {
  return send(
    to,
    `${code} is your ${STORE_NAME} verification code`,
    `
      <p>Your ${STORE_NAME} verification code is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
      <p>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    `,
    "OTP email"
  );
}
