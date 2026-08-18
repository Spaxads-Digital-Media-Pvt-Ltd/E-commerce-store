import type { Metadata } from "next";
import { SuccessClient } from "./success-client";

export const metadata: Metadata = {
  title: "Order Placed",
  robots: { index: false },
};

// The confirmation renders from the order payload saved in sessionStorage at
// checkout — the URL alone never reveals another customer's order (§13:
// order lookup by URL would be an IDOR; the API stays phone-gated).
export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <SuccessClient orderNumber={orderNumber} />;
}
