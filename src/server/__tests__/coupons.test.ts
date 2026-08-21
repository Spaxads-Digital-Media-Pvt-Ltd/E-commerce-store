import { describe, expect, it } from "vitest";
import { evaluateCoupon, findCoupon } from "@/server/coupons";

describe("findCoupon", () => {
  it("matches the code case-insensitively", () => {
    expect(findCoupon("save48")?.code).toBe("SAVE48");
    expect(findCoupon("  SaVe48 ")?.code).toBe("SAVE48");
  });

  it("returns null for unknown or empty codes", () => {
    expect(findCoupon("NOPE")).toBeNull();
    expect(findCoupon("")).toBeNull();
  });
});

describe("evaluateCoupon", () => {
  it("gives ₹48 off for SAVE48 on a qualifying cart (≥ ₹100)", () => {
    const r = evaluateCoupon("SAVE48", 150);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.discount).toBe(48);
  });

  it("applies at exactly the ₹99 minimum", () => {
    const r = evaluateCoupon("SAVE48", 99);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.discount).toBe(48);
  });

  it("rejects a cart below the ₹99 minimum", () => {
    const r = evaluateCoupon("SAVE48", 98);
    expect(r.ok).toBe(false);
  });

  it("rejects an unknown code", () => {
    const r = evaluateCoupon("FAKE", 500);
    expect(r.ok).toBe(false);
  });
});
