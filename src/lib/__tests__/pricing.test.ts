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
      discount: 0,
      membershipFee: 0,
      total: 0,
      gst: 0,
    });
  });

  it("adds the optional membership fee to the total", () => {
    const t = computeTotals([{ price: 99, qty: 1 }], 0, 49);
    expect(t.membershipFee).toBe(49);
    expect(t.total).toBe(99 + 49 /* ship */ + 49 /* membership */); // 197
  });

  it("shows GST as 18% of the total without changing the total", () => {
    const t = computeTotals([{ price: 82, qty: 1 }]); // 82 + 49 ship = 131
    expect(t.total).toBe(131);
    expect(t.gst).toBe(Math.round(131 * 0.18)); // 24
  });

  it("applies a coupon discount off the subtotal (₹48 → ₹100)", () => {
    // subtotal 99 + shipping 49 = 148, minus 48 coupon = 100
    const t = computeTotals([{ price: 99, qty: 1 }], 48);
    expect(t.subtotal).toBe(99);
    expect(t.shippingFee).toBe(FLAT_SHIPPING_FEE);
    expect(t.discount).toBe(48);
    expect(t.total).toBe(100);
  });

  it("caps the discount at the subtotal so merchandise never goes negative", () => {
    const t = computeTotals([{ price: 30, qty: 1 }], 48); // discount capped at 30
    expect(t.discount).toBe(30);
    expect(t.total).toBe(30 - 30 + FLAT_SHIPPING_FEE); // just shipping
  });

  it("keeps free-shipping eligibility based on the original subtotal", () => {
    const t = computeTotals([{ price: 500, qty: 1 }], 48); // 500 ≥ 399 → free ship
    expect(t.shippingFee).toBe(0);
    expect(t.total).toBe(500 - 48);
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
