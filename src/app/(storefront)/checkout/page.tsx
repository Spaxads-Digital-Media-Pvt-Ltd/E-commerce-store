import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const session = await requireUser("/checkout");
  const user = await db.user.findUniqueOrThrow({
    where: { id: session.userId },
  });

  // "Pay Online" is offered only when both the server keys and the public
  // key are configured; otherwise COD remains the sole (fully working) path.
  const razorpayEnabled =
    isRazorpayConfigured() && Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return (
    <CheckoutClient
      razorpayEnabled={razorpayEnabled}
      defaultName={user.name}
      defaultEmail={user.email}
    />
  );
}
