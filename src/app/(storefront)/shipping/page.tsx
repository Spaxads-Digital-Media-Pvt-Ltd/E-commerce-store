import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Dispatch, delivery timelines, and shipping charges for orders from ${LEGAL.brandName}.`,
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated={LEGAL.lastUpdated}
      intro={`This Shipping Policy explains how ${LEGAL.brandName} (operated by ${LEGAL.businessName}) dispatches and delivers your orders across India.`}
    >
      <h2>1. Order processing & dispatch</h2>
      <p>
        In-stock orders are processed and dispatched within{" "}
        {LEGAL.dispatchHours} hours of order confirmation. Orders placed on
        Sundays or public holidays are processed on the next working day. You
        will be able to follow your order status on our{" "}
        <Link href="/track-order">Track Order</Link> page using your order number
        and registered mobile number.
      </p>

      <h2>2. Delivery timelines</h2>
      <ul>
        <li>
          <strong>Metro cities:</strong> typically {LEGAL.deliveryMetro} after
          dispatch.
        </li>
        <li>
          <strong>Other cities & regions:</strong> typically{" "}
          {LEGAL.deliveryOther} after dispatch.
        </li>
      </ul>
      <p>
        These are estimates. Actual delivery may vary due to your location,
        courier conditions, weather, or other factors beyond our control.
      </p>

      <h2>3. Shipping charges</h2>
      <p>
        Delivery is <strong>free on orders above ₹{LEGAL.freeShippingThreshold}
        </strong>. For orders at or below that value, a nominal delivery fee is
        shown transparently at checkout before you place the order. The exact
        charge, if any, always appears in your order summary.
      </p>

      <h2>4. Serviceable areas</h2>
      <p>
        We deliver to serviceable PIN codes across India. If your PIN code is not
        serviceable, we will let you know and, for prepaid orders, refund any
        amount paid.
      </p>

      <h2>5. Delivery attempts & undelivered orders</h2>
      <p>
        Our courier partners typically attempt delivery two to three times. If an
        order cannot be delivered — for example, due to an incorrect address, an
        unreachable number, or repeated unavailability — it may be returned to
        us. For Cash on Delivery orders, please ensure someone is available to
        receive and pay for the order.
      </p>

      <h2>6. Damaged or wrong items on delivery</h2>
      <p>
        Please check your package on delivery. If an item arrives damaged,
        defective, or incorrect, report it within {LEGAL.defectReportHours} hours
        as described in our{" "}
        <Link href="/returns">Return &amp; Replacement Policy</Link>.
      </p>

      <h2>7. Contact</h2>
      <p>
        For any delivery-related query, contact us at {LEGAL.supportEmail} or{" "}
        {LEGAL.supportPhone} ({LEGAL.supportHours}).
      </p>
    </LegalPage>
  );
}
