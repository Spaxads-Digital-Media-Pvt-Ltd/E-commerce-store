import { z } from "zod";
import { MAX_CART_LINES, MAX_QTY_PER_ITEM } from "@/lib/constants";
import { addressSchema } from "./address";

// The client may ONLY send productId + qty — never price, name or totals.
// The server re-derives all money from the database (blueprint §10, §13).
export const orderItemInputSchema = z.object({
  productId: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(MAX_QTY_PER_ITEM),
  // Chosen size (for garments/footwear). Validated server-side against the
  // product's available sizes; ignored for products that have none.
  size: z.string().trim().max(40).optional(),
});

export const paymentMethodSchema = z.enum([
  "COD",
  "RAZORPAY",
  "PAYU",
  "SPRINTPGX",
]);

export const createOrderSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, "Your cart is empty — let's fix that.")
    .max(MAX_CART_LINES),
  customer: addressSchema,
  paymentMethod: paymentMethodSchema,
  // Optional coupon code. Re-validated and applied server-side — the client
  // never sends the discount amount, only the code.
  couponCode: z.string().trim().max(40).optional(),
  // Optional membership add-on. The fee is set server-side from constants —
  // the client only signals whether it was chosen.
  membership: z.boolean().optional(),
  // Idempotency: a double-tap or retry-on-timeout returns the SAME order.
  idempotencyKey: z.string().uuid(),
  // What the client DISPLAYED as the total. Used only to detect a price
  // drift and return a corrected cart (409) — never used for charging.
  expectedTotal: z.number().int().min(0).optional(),
  turnstileToken: z.string().max(4096).optional(),
  // Honeypot — humans never see this field; anything in it means a bot.
  // Validated loosely here; the route rejects non-empty values generically.
  website: z.string().max(200).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^ORD-\d{8}-\d{5}$/, "Enter a valid order number (ORD-XXXXXXXX-XXXXX)"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter the 10-digit mobile number used on the order"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
