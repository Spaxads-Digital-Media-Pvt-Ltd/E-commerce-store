import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Return & Replacement Policy",
  description: `When and how you can return or replace an item bought from ${LEGAL.brandName}.`,
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Return & Replacement Policy"
      updated={LEGAL.lastUpdated}
      intro={`This policy explains when a product bought from ${LEGAL.brandName} (operated by ${LEGAL.businessName}) can be returned or replaced. For cancellations and refund timelines, see our Refund & Cancellation Policy.`}
    >
      <h2>1. Damaged, defective, or wrong items</h2>
      <p>
        If your order arrives damaged, defective, or is not the item you ordered,
        please report it within <strong>{LEGAL.defectReportHours} hours of
        delivery</strong> so we can help. To process a return or replacement, we
        may ask you for:
      </p>
      <ul>
        <li>your order number;</li>
        <li>
          clear photos or an unboxing video showing the issue and the product
          packaging; and
        </li>
        <li>the item in its original condition with all tags and packaging.</li>
      </ul>

      <h2>2. Wrong item delivered</h2>
      <p>
        If you received an incorrect product, you may request a return within{" "}
        {LEGAL.wrongItemReturnDays} days of delivery, provided the item is unused
        and in its original packaging. We will arrange a replacement with the
        correct item or a refund.
      </p>

      <h2>3. How returns are collected</h2>
      <p>
        Where a return is approved, we will arrange a reverse pickup through our
        courier partner wherever the service is available, or share return
        instructions by email. Once the returned item reaches us and passes a
        quality check, we initiate the replacement or refund as per our{" "}
        <Link href="/refund">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>4. Items that cannot be returned</h2>
      <p>
        For hygiene, safety, and practical reasons, some products are not
        eligible for return unless they are damaged, defective, or wrong,
        including:
      </p>
      <ul>
        <li>innerwear, lingerie, and socks;</li>
        <li>
          beauty, personal-care, and cosmetic items once opened or used;
        </li>
        <li>items marked “non-returnable” on the product page; and</li>
        <li>
          products returned without original packaging, tags, or accessories, or
          that show signs of use or damage caused after delivery.
        </li>
      </ul>

      <h2>5. Replacements</h2>
      <p>
        Subject to stock, we will replace an eligible item with the same product.
        If a replacement is unavailable, we will offer a refund instead, as per
        our <Link href="/refund">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>6. Conditions</h2>
      <ul>
        <li>
          Returns reported after the applicable window, or for reasons other than
          damage/defect/wrong item, may not be accepted.
        </li>
        <li>
          Products must be returned in the same condition in which they were
          received.
        </li>
        <li>
          We reserve the right to decline a return that does not meet these
          conditions or where misuse or abuse of the policy is suspected.
        </li>
      </ul>

      <h2>7. How to start a return</h2>
      <p>
        Email {LEGAL.supportEmail} or call {LEGAL.supportPhone} (
        {LEGAL.supportHours}) with your order number and details, or use our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>
    </LegalPage>
  );
}
