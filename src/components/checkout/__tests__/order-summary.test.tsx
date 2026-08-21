// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderSummary } from "@/components/checkout/order-summary";

describe("<OrderSummary />", () => {
  it("shows the flat delivery fee under the free-shipping threshold", () => {
    render(<OrderSummary lines={[{ name: "Coin Purse", price: 99, qty: 1 }]} />);
    expect(screen.getByText("₹99")).toBeDefined(); // subtotal
    expect(screen.getByText("₹49")).toBeDefined(); // delivery
    expect(screen.getByText("₹148")).toBeDefined(); // total
  });

  it("shows FREE delivery at/over the threshold", () => {
    render(
      <OrderSummary lines={[{ name: "Kurti", price: 499, qty: 1 }]} showLines />
    );
    expect(screen.getByText("FREE")).toBeDefined();
    expect(screen.getAllByText("₹499").length).toBeGreaterThan(0);
  });

  it("renders server-computed totals verbatim when passed explicitly", () => {
    render(
      <OrderSummary
        totals={{
          subtotal: 298,
          shippingFee: 49,
          discount: 0,
          membershipFee: 0,
          total: 347,
          gst: 62,
        }}
      />
    );
    expect(screen.getByText("₹347")).toBeDefined();
  });

  it("shows the coupon discount line when a coupon is applied", () => {
    render(
      <OrderSummary
        lines={[{ name: "Kurti", price: 99, qty: 1 }]}
        discount={48}
        couponCode="SAVE48"
      />
    );
    expect(screen.getByText(/SAVE48/)).toBeDefined();
    expect(screen.getByText("−₹48")).toBeDefined();
    expect(screen.getByText("₹100")).toBeDefined(); // 99 + 49 − 48
  });
});
