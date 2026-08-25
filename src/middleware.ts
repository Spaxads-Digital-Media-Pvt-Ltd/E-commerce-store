import { NextRequest, NextResponse } from "next/server";

// CSRF first-pass filter for a cookie-less guest store (§13): state-changing
// API requests must be same-origin. Browsers always attach Origin to
// cross-site POSTs, so a mismatched or missing Origin/Referer is rejected.
//
// The Razorpay webhook and the PayU callback are exempt — both are
// authenticated by their own signature/hash instead of same-origin (the
// PayU callback is a browser POST originating from PayU's hosted page, so
// it's cross-origin by design; see src/server/payu.ts).

const SIGNATURE_AUTHENTICATED = [
  "/api/payments/razorpay/webhook",
  "/api/payments/payu/callback",
];

function blocked() {
  return NextResponse.json(
    { error: "Cross-origin request blocked." },
    { status: 403 }
  );
}

export function middleware(req: NextRequest) {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  if (SIGNATURE_AUTHENTICATED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const host = req.headers.get("host");
  if (!host) return blocked();

  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!source) return blocked();

  try {
    if (new URL(source).host === host) return NextResponse.next();
  } catch {
    // malformed header
  }
  return blocked();
}

export const config = {
  matcher: "/api/:path*",
};
