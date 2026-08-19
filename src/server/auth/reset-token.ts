import {
  base64url,
  sessionSecret,
  signWithSecret,
  verifyWithSecret,
} from "./session";

// Stateless password-reset token — same HMAC approach as the session
// cookie, but with a "purpose" tag so a reset token can never be replayed
// as a session token (or vice versa). 30-minute expiry; single-use is not
// enforced server-side (no token table), which is an acceptable tradeoff
// since the token is only ever seen by whoever controls the recipient's
// inbox and expires quickly.

const PURPOSE = "reset";
const MAX_AGE_SECONDS = 30 * 60; // 30 minutes

type ResetPayload = {
  uid: string;
  purpose: typeof PURPOSE;
  exp: number;
};

export function createResetToken(userId: string): string {
  const payload: ResetPayload = {
    uid: userId,
    purpose: PURPOSE,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const encoded = base64url(Buffer.from(JSON.stringify(payload)));
  return `${encoded}.${signWithSecret(encoded, sessionSecret())}`;
}

export function verifyResetToken(token: string): { userId: string } | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  if (!verifyWithSecret(encoded, sig, sessionSecret())) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64").toString("utf8")
    ) as ResetPayload;
    if (payload.purpose !== PURPOSE) return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return { userId: payload.uid };
  } catch {
    return null;
  }
}
