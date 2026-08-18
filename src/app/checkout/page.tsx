import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { isRazorpayConfigured } from "@/lib/razorpay";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  // "Pay Online" is offered only when both the server keys and the public
  // key are configured; otherwise COD remains the sole (fully working) path.
  const razorpayEnabled =
    isRazorpayConfigured() && Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return <CheckoutClient razorpayEnabled={razorpayEnabled} />;
}
