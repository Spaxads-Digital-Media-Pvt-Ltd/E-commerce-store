import { describe, expect, it } from "vitest";
import { addressSchema } from "@/lib/validations/address";
import { createOrderSchema, trackOrderSchema } from "@/lib/validations/order";

const validCustomer = {
  customerName: "Asha Sharma",
  phone: "9876543210",
  email: "",
  addressLine1: "12/4 MG Road, Indiranagar",
  addressLine2: "",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

describe("addressSchema", () => {
  it("accepts a valid Indian address", () => {
    expect(addressSchema.safeParse(validCustomer).success).toBe(true);
  });

  it("rejects invalid Indian mobile numbers", () => {
    for (const phone of ["12345", "5876543210", "98765432101", "abcdefghij"]) {
      expect(
        addressSchema.safeParse({ ...validCustomer, phone }).success
      ).toBe(false);
    }
  });

  it("rejects invalid pincodes (including a leading zero)", () => {
    for (const pincode of ["12345", "012345", "1234567", "56003a"]) {
      expect(
        addressSchema.safeParse({ ...validCustomer, pincode }).success
      ).toBe(false);
    }
  });

  it("allows email to be empty but validates it when present", () => {
    expect(
      addressSchema.safeParse({ ...validCustomer, email: "not-an-email" })
        .success
    ).toBe(false);
    expect(
      addressSchema.safeParse({ ...validCustomer, email: "a@b.in" }).success
    ).toBe(true);
  });
});

describe("createOrderSchema", () => {
  const validOrder = {
    items: [{ productId: "abc123", qty: 2 }],
    customer: validCustomer,
    paymentMethod: "COD",
    idempotencyKey: "6f9619ff-8b86-4d01-b42d-00cf4fc964ff",
  };

  it("accepts a valid COD order", () => {
    expect(createOrderSchema.safeParse(validOrder).success).toBe(true);
  });

  it("rejects an empty cart, zero qty, and oversized qty", () => {
    expect(
      createOrderSchema.safeParse({ ...validOrder, items: [] }).success
    ).toBe(false);
    expect(
      createOrderSchema.safeParse({
        ...validOrder,
        items: [{ productId: "a", qty: 0 }],
      }).success
    ).toBe(false);
    expect(
      createOrderSchema.safeParse({
        ...validOrder,
        items: [{ productId: "a", qty: 11 }],
      }).success
    ).toBe(false);
  });

  it("rejects client-supplied prices (unknown keys are stripped, price is never read)", () => {
    const parsed = createOrderSchema.parse({
      ...validOrder,
      items: [{ productId: "abc123", qty: 1, price: 1 } as never],
    });
    expect(
      (parsed.items[0] as Record<string, unknown>).price
    ).toBeUndefined();
  });

  it("requires a UUID idempotency key", () => {
    expect(
      createOrderSchema.safeParse({ ...validOrder, idempotencyKey: "nope" })
        .success
    ).toBe(false);
  });

  it("rejects unknown payment methods", () => {
    expect(
      createOrderSchema.safeParse({ ...validOrder, paymentMethod: "BITCOIN" })
        .success
    ).toBe(false);
  });
});

describe("trackOrderSchema", () => {
  it("normalises and accepts a valid lookup", () => {
    const parsed = trackOrderSchema.parse({
      orderNumber: "ord-20260716-01234",
      phone: "9876543210",
    });
    expect(parsed.orderNumber).toBe("ORD-20260716-01234");
  });

  it("rejects malformed order numbers", () => {
    for (const orderNumber of ["ORD-123", "20260716-01234", "ORD-2026-1"]) {
      expect(
        trackOrderSchema.safeParse({ orderNumber, phone: "9876543210" })
          .success
      ).toBe(false);
    }
  });
});
