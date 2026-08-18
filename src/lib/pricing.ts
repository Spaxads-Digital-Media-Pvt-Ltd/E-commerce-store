import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "./constants";

// The ONE place order math lives. Used by the server order API, the
// OrderSummary component and tests — never re-implemented per page.

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export type PricedLine = { price: number; qty: number };

export function computeTotals(items: PricedLine[]): {
  subtotal: number;
  shippingFee: number;
  total: number;
} {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = shippingFor(subtotal);
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}
