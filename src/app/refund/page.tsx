import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: `How cancellations and refunds work at ${LEGAL.brandName} — methods, timelines, and eligibility.`,
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated={LEGAL.lastUpdated}
      intro={`This policy explains when and how you can cancel an order with ${LEGAL.brandName} (operated by ${LEGAL.businessName}) and how refunds are processed. It should be read together with our Return & Replacement Policy and Shipping Policy.`}
    >
      <h2>1. Order cancellation</h2>
      <ul>
        <li>
          <strong>Before dispatch:</strong> you may request cancellation of an
          order before it is dispatched by contacting us at {LEGAL.supportEmail}{" "}
          with your order number. If the order has not yet been handed to the
          courier, we will cancel it and refund any amount paid.
        </li>
        <li>
          <strong>After dispatch:</strong> once an order has been dispatched, it
          can no longer be cancelled. If you no longer want it, you may refuse
          the delivery or follow our{" "}
          <Link href="/returns">Return &amp; Replacement Policy</Link> where
          applicable.
        </li>
        <li>
          <strong>Cash on Delivery orders</strong> that are repeatedly refused or
          left undelivered may affect eligibility for COD on future orders.
        </li>
      </ul>

      <h2>2. Cancellations by us</h2>
      <p>
        We may cancel an order (including after confirmation) if the product is
        out of stock, the delivery address is not serviceable, there is a pricing
        or listing error, or we suspect fraudulent or abusive activity. Where we
        cancel a prepaid order, you will receive a{" "}
        <strong>full refund of the amount paid</strong>, processed within{" "}
        {LEGAL.companyCancelRefundDays}.
      </p>

      <h2>3. When you are eligible for a refund</h2>
      <p>You are eligible for a refund when:</p>
      <ul>
        <li>we cancel your order for any of the reasons above;</li>
        <li>
          you received a damaged, defective, or wrong item and a return has been
          approved under our{" "}
          <Link href="/returns">Return &amp; Replacement Policy</Link>; or
        </li>
        <li>a prepaid order could not be delivered and is returned to us.</li>
      </ul>

      <h2>4. Refund method</h2>
      <ul>
        <li>
          <strong>Prepaid orders</strong> (UPI, card, net banking via Razorpay)
          are refunded to the original payment method.
        </li>
        <li>
          <strong>Cash on Delivery orders</strong> are refunded to a bank account
          or UPI ID that you provide, since no online payment was made.
        </li>
      </ul>

      <h2>5. Refund timelines</h2>
      <p>
        Once a refund is approved, we initiate it promptly. Refunds are generally
        completed within {LEGAL.companyCancelRefundDays} of approval (for
        return-related refunds, after the returned item passes our quality
        check). The time for the amount to reflect in your account depends on
        your bank or payment provider.
      </p>

      <h2>6. Deductions</h2>
      <p>
        Where a prepaid order is refused at delivery without a valid reason (for
        example, the product is not damaged, defective, or wrong), applicable
        shipping and return-shipping charges may be deducted from the refund. For
        orders that qualified for free shipping, the actual shipping cost we
        incurred may be adjusted in such cases.
      </p>

      <h2>7. How to request a cancellation or refund</h2>
      <p>
        Email {LEGAL.supportEmail} or call {LEGAL.supportPhone} (
        {LEGAL.supportHours}) with your order number and details. For any
        unresolved concern, you may contact our Grievance Officer via our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>
    </LegalPage>
  );
}
