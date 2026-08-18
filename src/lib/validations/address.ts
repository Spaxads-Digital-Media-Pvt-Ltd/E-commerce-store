import { z } from "zod";

// Shared between the React Hook Form checkout form (client) and the
// /api/orders route (server) — one source of truth (blueprint §3, §13).

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode");

export const addressSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(80, "Name is too long"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(120)
    .optional()
    .or(z.literal("")),
  addressLine1: z
    .string()
    .trim()
    .min(5, "Enter your house/flat and street")
    .max(120, "Address is too long"),
  addressLine2: z.string().trim().max(120, "Address is too long").optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.string().trim().min(2, "Select your state").max(60),
  pincode: pincodeSchema,
});

export type AddressInput = z.infer<typeof addressSchema>;
