import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { isPayUConfigured } from "@/server/payu";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const session = await requireUser("/checkout");
  const user = await db.user.findUniqueOrThrow({
    where: { id: session.userId },
  });

  // Razorpay and SprintPGX are built (see src/server/razorpay.ts and
  // src/server/sprintpgx.ts) but intentionally hidden from checkout for
  // now — PayU is the only online method shown. COD always remains the
  // fully-working fallback.
  const payuEnabled = isPayUConfigured();

  return (
    <CheckoutClient
      payuEnabled={payuEnabled}
      defaultName={user.name}
      defaultEmail={user.email}
    />
  );
}
