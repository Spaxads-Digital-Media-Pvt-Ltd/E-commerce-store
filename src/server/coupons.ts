import "server-only";

// ─────────────────────────────────────────────────────────────────────────
// Coupon codes. Server-only — the discount is always evaluated here against
// server-computed prices, never trusted from the client (blueprint §13).
//
// To add or change a coupon, edit COUPONS below. `code` is matched
// case-insensitively. `minOrderValue` is the minimum SUBTOTAL (merchandise,
// before shipping) required to use the coupon — raise it to prevent a coupon
// from zeroing out a small order.
// ─────────────────────────────────────────────────────────────────────────

export type Coupon = {
  code: string; // canonical UPPERCASE code
  discount: number; // flat ₹ off
  minOrderValue: number; // minimum subtotal (₹) required
  isActive: boolean;
  label: string; // short description shown to the shopper
};

const COUPONS: Coupon[] = [
  {
    code: "SAVE48",
    discount: 48,
    minOrderValue: 99, // cart subtotal (merchandise) must be at least ₹99
    isActive: true,
    label: "₹48 off orders of ₹99+",
  },
];

export function findCoupon(code: string): Coupon | null {
  const norm = code.trim().toUpperCase();
  if (!norm) return null;
  return COUPONS.find((c) => c.code === norm && c.isActive) ?? null;
}

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; error: string };

// Validate a code against a server-computed subtotal and return the discount
// (capped at the subtotal), or a shopper-friendly error.
export function evaluateCoupon(code: string, subtotal: number): CouponResult {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, error: "This coupon code isn't valid." };
  if (subtotal < coupon.minOrderValue) {
    const gap = coupon.minOrderValue - subtotal;
    return {
      ok: false,
      error: `Add ₹${gap} more of items to use code ${coupon.code}.`,
    };
  }
  const discount = Math.max(0, Math.min(coupon.discount, subtotal));
  if (discount <= 0) {
    return { ok: false, error: "This coupon can't be applied to your cart." };
  }
  return { ok: true, coupon, discount };
}
