import { randomInt } from "crypto";

// Human-readable order number: ORD-YYYYMMDD-XXXXX (blueprint §10).
// Uniqueness is enforced by the DB unique constraint; callers retry on
// collision (see /api/orders).
export function generateOrderNumber(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = String(randomInt(0, 100000)).padStart(5, "0");
  return `ORD-${y}${m}${d}-${suffix}`;
}

export const ORDER_NUMBER_REGEX = /^ORD-\d{8}-\d{5}$/;
