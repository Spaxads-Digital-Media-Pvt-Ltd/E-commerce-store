// Cloudflare Turnstile server-side verification.
// When TURNSTILE_SECRET_KEY is unset the check is skipped (dev convenience);
// a warning is logged in production so it can't be forgotten silently.

export async function verifyTurnstile(
  token: string | undefined,
  ip: string
): Promise<{ ok: boolean; skipped: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY not set — bot check skipped."
      );
    }
    return { ok: true, skipped: true };
  }
  if (!token) return { ok: false, skipped: false };

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return { ok: Boolean(data.success), skipped: false };
  } catch (err) {
    console.error("[turnstile] verification request failed", err);
    return { ok: false, skipped: false };
  }
}
