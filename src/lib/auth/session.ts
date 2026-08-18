import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Stateless, HMAC-signed session cookie — no session table, no extra
// dependency. Payload is base64url JSON; signature is base64url
// HMAC-SHA256 over the payload string, verified with a timing-safe
// comparison. See prisma/schema.prisma User.role for the "customer" |
// "admin" values carried in the payload.

export const SESSION_COOKIE = "u999_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest();
  return base64url(sig);
}

export type SessionPayload = {
  uid: string;
  role: string;
  exp: number; // epoch seconds
};

export function createSessionToken(user: { id: string; role: string }): string {
  const payload: SessionPayload = {
    uid: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const encoded = base64url(Buffer.from(JSON.stringify(payload)));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64").toString("utf8")
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

// Server Components / Route Handlers only (reads the incoming request's
// cookies via next/headers).
export async function getSession(): Promise<{
  userId: string;
  role: string;
} | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return { userId: payload.uid, role: payload.role };
}

export async function requireUser(nextPath: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}
