import { describe, expect, it } from "vitest";
import { generateOrderNumber, ORDER_NUMBER_REGEX } from "@/lib/order-number";

describe("generateOrderNumber", () => {
  it("matches ORD-YYYYMMDD-XXXXX", () => {
    const n = generateOrderNumber(new Date("2026-07-16T12:00:00"));
    expect(n).toMatch(ORDER_NUMBER_REGEX);
    expect(n.startsWith("ORD-20260716-")).toBe(true);
  });

  it("zero-pads the random suffix to 5 digits", () => {
    for (let i = 0; i < 50; i++) {
      const suffix = generateOrderNumber().split("-")[2]!;
      expect(suffix).toHaveLength(5);
    }
  });
});
