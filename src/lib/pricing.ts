import {
  FLAT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  GST_RATE_PERCENT,
} from "./constants";

// The ONE place order math lives. Used by the server order API, the
// OrderSummary component and tests — never re-implemented per page.

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

// GST slice EXTRACTED from the (tax-inclusive) total — a flat 18% of the total
// per the client's sheet. Never changes the total; it's a breakup figure only.
export function gstFromTotal(total: number): number {
  return Math.round((total * GST_RATE_PERCENT) / 100);
}

export type PricedLine = { price: number; qty: number };

export type Totals = {
  subtotal: number;
  shippingFee: number;
  discount: number;
  membershipFee: number;
  total: number;
  gst: number; // GST included in the total (18% of total)
};

// `discount` is a validated coupon amount (capped at subtotal). `membershipFee`
// is the optional add-on the shopper chose (0 if not). Shipping is based on the
// ORIGINAL subtotal so a coupon never changes free-shipping eligibility.
export function computeTotals(
  items: PricedLine[],
  discount = 0,
  membershipFee = 0
): Totals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = shippingFor(subtotal);
  const appliedDiscount = Math.max(0, Math.min(discount, subtotal));
  const total = subtotal - appliedDiscount + membershipFee + shippingFee;
  return {
    subtotal,
    shippingFee,
    discount: appliedDiscount,
    membershipFee,
    total,
    gst: gstFromTotal(total),
  };
}
