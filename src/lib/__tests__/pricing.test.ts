import { describe, expect, it } from "vitest";
import { computeTotals, shippingFor } from "@/lib/pricing";
import {
  FLAT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import { discountPercent, formatINR } from "@/lib/utils";

describe("shippingFor", () => {
  it("charges nothing on an empty cart", () => {
    expect(shippingFor(0)).toBe(0);
  });

  it("charges the flat fee below the threshold", () => {
    expect(shippingFor(100)).toBe(FLAT_SHIPPING_FEE);
    expect(shippingFor(FREE_SHIPPING_THRESHOLD - 1)).toBe(FLAT_SHIPPING_FEE);
  });

  it("is free at and above the threshold", () => {
    expect(shippingFor(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFor(999)).toBe(0);
  });
});

describe("computeTotals", () => {
  it("sums line totals and adds shipping", () => {
    const t = computeTotals([{ price: 149, qty: 2 }]); // 298 < 399
    expect(t.subtotal).toBe(298);
    expect(t.shippingFee).toBe(FLAT_SHIPPING_FEE);
    expect(t.total).toBe(298 + FLAT_SHIPPING_FEE);
  });

  it("gives free delivery over the threshold", () => {
    const t = computeTotals([
      { price: 299, qty: 1 },
      { price: 199, qty: 1 },
    ]); // 498
    expect(t.shippingFee).toBe(0);
    expect(t.total).toBe(498);
  });

  it("handles an empty cart", () => {
    expect(computeTotals([])).toEqual({
      subtotal: 0,
      shippingFee: 0,
      total: 0,
    });
  });
});

describe("money display helpers", () => {
  it("formats INR with Indian digit grouping and no paise", () => {
    expect(formatINR(1598)).toBe("₹1,598");
    expect(formatINR(100000)).toBe("₹1,00,000");
    expect(formatINR(99)).toBe("₹99");
  });

  it("computes the % off badge like the catalog does", () => {
    expect(discountPercent(1999, 799)).toBe(60);
    expect(discountPercent(999, 999)).toBe(0);
    expect(discountPercent(0, 100)).toBe(0);
  });
});
