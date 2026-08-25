// SprintPGX (checkout-pgx.sprintnxt.in). Only the checkout-creation call is
// documented so far (confirmed request shape from the merchant):
//
//   POST {SPRINTPGX_BASE_URL}/api/v1/payments/checkout
//   X-Api-Key / X-Api-Secret headers, body { order_id, amount, currency }
//
// The response shape and the payment-confirmation mechanism (redirect
// params? webhook? polling?) are NOT documented anywhere we have access to.
// This file deliberately does NOT invent a "verify" function for either —
// trusting an unauthenticated redirect query param to mark an order PAID
// would be a real payment-integrity hole (see the Razorpay/PayU modules for
// what a verified confirmation looks like). Orders paid via SprintPGX stay
// PENDING until that spec is obtained and a verified confirmation path is
// built the same way.

export function isSprintPGXConfigured(): boolean {
  return Boolean(
    process.env.SPRINTPGX_API_KEY && process.env.SPRINTPGX_API_SECRET
  );
}

function getBaseUrl(): string {
  return (process.env.SPRINTPGX_BASE_URL || "https://checkout-pgx.sprintnxt.in").replace(
    /\/+$/,
    ""
  );
}

export class SprintPGXError extends Error {}

type CheckoutResult = { checkoutUrl: string; transactionId: string | null };

// Field names beyond the confirmed request body are unknown, so the response
// is parsed defensively against the common names gateways use. If none
// match, this throws instead of guessing — a wrong field name here would
// silently send customers to `undefined` instead of a real payment page.
function extractString(
  data: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const v = data[key];
    if (typeof v === "string" && v) return v;
  }
  const nested = data.data;
  if (nested && typeof nested === "object") {
    for (const key of keys) {
      const v = (nested as Record<string, unknown>)[key];
      if (typeof v === "string" && v) return v;
    }
  }
  return null;
}

export async function createCheckout({
  orderId,
  amount,
  currency = "INR",
}: {
  orderId: string;
  amount: number; // rupees — matches the merchant's example (amount: 999)
  currency?: string;
}): Promise<CheckoutResult> {
  const apiKey = process.env.SPRINTPGX_API_KEY;
  const apiSecret = process.env.SPRINTPGX_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new SprintPGXError("SprintPGX is not configured");
  }

  const url = `${getBaseUrl()}/api/v1/payments/checkout`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "X-Api-Secret": apiSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order_id: orderId, amount, currency }),
  });

  const bodyText = await res.text();
  let raw: unknown = null;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    // non-JSON body — bodyText below still gets logged for diagnosis
  }

  if (!res.ok || !raw || typeof raw !== "object") {
    // Logged (not just thrown) because the caller only sees a generic 502 —
    // this is what actually tells you WHY SprintPGX rejected the call.
    console.error(
      `[sprintpgx] POST ${url} -> HTTP ${res.status}. Body: ${bodyText.slice(0, 2000)}`
    );
    throw new SprintPGXError(
      `SprintPGX checkout creation failed (HTTP ${res.status})`
    );
  }
  const data = raw as Record<string, unknown>;

  const checkoutUrl = extractString(data, [
    "payment_url",
    "checkout_url",
    "redirect_url",
    "url",
    "hosted_url",
  ]);
  if (!checkoutUrl) {
    throw new SprintPGXError(
      "SprintPGX checkout response didn't include a recognized payment URL field — check the actual response shape against the API docs and update extractString() in src/server/sprintpgx.ts"
    );
  }

  const transactionId = extractString(data, [
    "transaction_id",
    "id",
    "payment_id",
    "txn_id",
  ]);

  return { checkoutUrl, transactionId };
}
