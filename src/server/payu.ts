import crypto from "crypto";

// PayU merchant-hosted checkout (docs.payu.in). The browser is redirected to
// PayU's own hosted page via a signed HTML form POST, then PayU redirects it
// back to our surl/furl with a reverse-computed hash we must verify before
// trusting the outcome — same trust model as Razorpay's checkout callback
// (src/server/razorpay.ts), just carried over a browser redirect instead of
// a JS SDK handler.

const UDF_COUNT = 10; // udf1..udf10 — unused by this integration, always "".
const EMPTY_UDFS = Array.from({ length: UDF_COUNT }, () => "");

export function isPayUConfigured(): boolean {
  return Boolean(process.env.PAYU_MERCHANT_KEY && process.env.PAYU_MERCHANT_SALT);
}

// test.payu.in for sandbox, secure.payu.in for live — PAYU_BASE_URL selects it.
export function getPayUActionUrl(): string {
  const base = (process.env.PAYU_BASE_URL || "https://test.payu.in").replace(
    /\/+$/,
    ""
  );
  return `${base}/_payment`;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export type PayUCoreFields = {
  txnid: string;
  amount: string; // rupees, 2-decimal string e.g. "596.00"
  productinfo: string;
  firstname: string;
  email: string;
};

// Request hash: sha512(key|txnid|amount|productinfo|firstname|email|udf1..udf10|salt)
export function buildRequestHash(fields: PayUCoreFields): string {
  const key = process.env.PAYU_MERCHANT_KEY!;
  const salt = process.env.PAYU_MERCHANT_SALT!;
  const parts = [
    key,
    fields.txnid,
    fields.amount,
    fields.productinfo,
    fields.firstname,
    fields.email,
    ...EMPTY_UDFS,
    salt,
  ];
  return crypto.createHash("sha512").update(parts.join("|")).digest("hex");
}

// Reverse hash on the postback: sha512(salt|status|udf10..udf1|email|firstname|productinfo|amount|txnid|key)
// Must be verified before a "success" status is trusted (mirrors §13 in the
// Razorpay implementation — nothing is trusted before the hash checks out).
export function verifyResponseHash(
  fields: PayUCoreFields & { status: string; hash: string }
): boolean {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  if (!key || !salt) return false;
  const parts = [
    salt,
    fields.status,
    ...EMPTY_UDFS, // symmetric — all empty regardless of direction
    fields.email,
    fields.firstname,
    fields.productinfo,
    fields.amount,
    fields.txnid,
    key,
  ];
  const expected = crypto.createHash("sha512").update(parts.join("|")).digest("hex");
  return safeEqual(expected, fields.hash);
}
