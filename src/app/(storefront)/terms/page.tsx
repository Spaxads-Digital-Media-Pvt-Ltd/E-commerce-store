import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that govern your use of ${LEGAL.websiteName} and any purchase you make from ${LEGAL.brandName}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated={LEGAL.lastUpdated}
      intro={`These Terms & Conditions ("Terms") govern your access to and use of ${LEGAL.websiteName} (the "Website") and any order you place with ${LEGAL.brandName}, operated by ${LEGAL.businessName} ("we", "us", "our"). By browsing the Website or placing an order, you agree to these Terms. Please read them carefully. If you do not agree, please do not use the Website.`}
    >
      <h2>1. About us & these Terms</h2>
      <p>
        {LEGAL.brandName} is an online store where every product is priced at
        ₹999 or under. The Website is operated by {LEGAL.businessName} (trading
        as {LEGAL.tradeName}), GSTIN {LEGAL.gstNumber}, with its registered
        address at {LEGAL.registeredAddress}. These Terms, together with our{" "}
        <Link href="/privacy">Privacy Policy</Link>,{" "}
        <Link href="/shipping">Shipping Policy</Link>,{" "}
        <Link href="/returns">Return Policy</Link>, and{" "}
        <Link href="/refund">Refund &amp; Cancellation Policy</Link>, form the
        agreement between you and us. We may update these Terms from time to time
        (see “Changes to these Terms” below).
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and capable of entering into a legally
        binding contract under the Indian Contract Act, 1872 to place an order.
        If you are under 18, you may use the Website only under the supervision
        of a parent or legal guardian who accepts these Terms on your behalf. By
        placing an order, you confirm that the information you provide is true,
        accurate, and complete.
      </p>

      <h2>3. Your account</h2>
      <p>
        To place an order, you need to create an account with your email address
        and a password, and verify your email. You are responsible for keeping
        your login credentials confidential and for all activity that takes
        place under your account. Please provide accurate, current, and complete
        information and keep it up to date, as we use your contact and delivery
        details to fulfil and deliver your orders. Notify us promptly at{" "}
        {LEGAL.supportEmail} if you suspect any unauthorised use of your account.
      </p>

      <h2>4. Products, descriptions & the “Under ₹999” promise</h2>
      <p>
        We take care to describe and picture our products accurately. However:
      </p>
      <ul>
        <li>
          Product colours, textures, and packaging may vary slightly from the
          images shown, due to photography, lighting, and differences in device
          displays.
        </li>
        <li>
          Product availability is not guaranteed and stock is limited. An item
          shown on the Website may become unavailable before your order is
          accepted.
        </li>
        <li>
          Every product listed for sale is priced at ₹999 or below. All prices
          are in Indian Rupees (INR) and are inclusive of applicable taxes
          unless stated otherwise.
        </li>
      </ul>

      <h2>5. Pricing & pricing errors</h2>
      <p>
        Prices and offers are subject to change without notice. The price
        applicable to your order is the price confirmed on the checkout and
        order-summary screen at the time your order is placed, as calculated by
        our systems. Despite our best efforts, a product may occasionally be
        mispriced. If we discover a pricing error for an item in your order, we
        are not obliged to fulfil the order at the incorrect price; we will
        inform you and give you the option to proceed at the correct price or
        cancel the order, and any amount paid will be refunded.
      </p>

      <h2>6. Placing an order & our acceptance</h2>
      <p>
        When you place an order, you are making an offer to buy the selected
        products. Your order is confirmed and a contract is formed only when we
        accept it — for a Cash on Delivery order, when we confirm/dispatch it;
        for a prepaid order, when payment is successfully verified and the order
        is confirmed. We may, at our discretion, refuse or cancel an order
        (including after confirmation) for reasons that include, without
        limitation:
      </p>
      <ul>
        <li>the product being unavailable or out of stock;</li>
        <li>an error in the price or product description;</li>
        <li>
          our inability to deliver to the address or PIN code provided;
        </li>
        <li>
          suspected fraudulent, abusive, or unauthorised activity, or a
          suspected breach of these Terms.
        </li>
      </ul>
      <p>
        Each order is given a unique order number in the format
        ORD-YYYYMMDD-XXXXX. You can check your order status any time on our{" "}
        <Link href="/track-order">Track Order</Link> page using your order
        number and the mobile number used at checkout.
      </p>

      <h2>7. Payments</h2>
      <p>We currently offer the following payment methods:</p>
      <ul>
        <li>
          <strong>Cash on Delivery (COD):</strong> pay in cash to the delivery
          partner at the time your order is delivered.
        </li>
        <li>
          <strong>Online payment:</strong> UPI, cards, and net banking through
          our third-party payment gateway, Razorpay. Your payment is processed
          securely by Razorpay; we do not collect or store your full card
          details, UPI PIN, or bank credentials on our systems.
        </li>
      </ul>
      <p>
        By choosing online payment, you also agree to the terms and privacy
        policy of the payment gateway. If a payment fails or is not verified,
        your order will not be confirmed.
      </p>

      <h2>8. Shipping & delivery</h2>
      <p>
        We deliver across serviceable PIN codes in India. Estimated delivery is
        typically {LEGAL.deliveryEstimate} from order confirmation, though
        actual timelines may vary based on your location, product availability,
        and courier conditions. Delivery is free on orders above ₹
        {LEGAL.freeShippingThreshold}; a nominal delivery fee (shown at
        checkout) applies below that. Risk of loss and ownership of the products
        pass to you upon delivery.
      </p>

      <h2>9. Cancellations</h2>
      <p>
        You may request cancellation of an order before it is dispatched by
        contacting us at {LEGAL.supportEmail}. Once an order has been
        dispatched, it cannot be cancelled, but you may be able to return it in
        line with the section below. We may cancel an order as described in
        section 6, and where a prepaid order is cancelled, we will refund the
        amount paid.
      </p>

      <h2>10. Returns, replacements & refunds</h2>
      <p>
        We want you to be happy with your purchase. Damaged, defective, or wrong
        items can be reported for a return, replacement, or refund within the
        timelines set out in our dedicated policies. Please read them in full:
      </p>
      <ul>
        <li>
          <Link href="/returns">Return &amp; Replacement Policy</Link> — what is
          eligible, the reporting window, and how the process works.
        </li>
        <li>
          <Link href="/refund">Refund &amp; Cancellation Policy</Link> — refund
          methods, timelines, and cancellation rules.
        </li>
        <li>
          <Link href="/shipping">Shipping Policy</Link> — dispatch, delivery
          timelines, and charges.
        </li>
      </ul>

      <h2>11. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          use the Website for any unlawful, fraudulent, or unauthorised purpose,
          or in breach of any applicable law;
        </li>
        <li>
          place orders using false, misleading, or another person’s details, or
          attempt to interfere with, probe, or overload the Website, its
          security features, or its systems;
        </li>
        <li>
          copy, scrape, republish, or exploit any content, product data, or
          images from the Website without our written permission.
        </li>
      </ul>

      <h2>12. Intellectual property</h2>
      <p>
        All content on the Website — including the {LEGAL.brandName} name and
        logo, text, graphics, page design, and software — is owned by or
        licensed to us and is protected by applicable intellectual-property
        laws. You may use the Website only for browsing and placing genuine
        orders. No content may be reproduced or used for commercial purposes
        without our prior written consent.
      </p>

      <h2>13. Third-party services & links</h2>
      <p>
        We rely on trusted third parties to operate the store — including our
        payment gateway, logistics/courier partners, cloud hosting, image
        hosting, and bot-protection providers. The Website may also contain
        links to third-party websites. We are not responsible for the content,
        products, or practices of any third party, and your dealings with them
        are governed by their own terms and policies.
      </p>

      <h2>14. Disclaimers</h2>
      <p>
        The Website and products are provided on an “as is” and “as available”
        basis. To the extent permitted by law, we do not warrant that the
        Website will be uninterrupted, error-free, or secure, or that product
        descriptions or other content are complete or current. Nothing in these
        Terms excludes or limits any rights you have as a consumer that cannot
        be excluded under the Consumer Protection Act, 2019 or other applicable
        law.
      </p>

      <h2>15. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, we shall not be
        liable for any indirect, incidental, special, or consequential loss, or
        loss of profits, arising out of or in connection with your use of the
        Website or any product purchased. Subject to your non-excludable
        statutory rights, our total liability in respect of any order shall not
        exceed the amount paid by you for that order.
      </p>

      <h2>16. Indemnity</h2>
      <p>
        You agree to indemnify and hold us, our officers, and employees harmless
        from any claim, loss, or expense (including reasonable legal fees)
        arising from your breach of these Terms or your misuse of the Website.
      </p>

      <h2>17. Force majeure</h2>
      <p>
        We are not liable for any delay or failure to perform our obligations
        caused by events beyond our reasonable control, including natural
        disasters, strikes, failures of couriers or payment systems, government
        actions, network or power outages, or other force-majeure events.
      </p>

      <h2>18. Governing law & jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Subject to the applicable
        consumer-protection laws, the courts at {LEGAL.governingCity},{" "}
        {LEGAL.governingState} shall have exclusive jurisdiction over any dispute
        arising out of or in connection with these Terms or your use of the
        Website.
      </p>

      <h2>19. Grievance redressal</h2>
      <p>
        In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and
        the Information Technology Act, 2000 and rules thereunder, any complaint
        or grievance regarding the Website, an order, or content may be directed
        to our Grievance Officer:
      </p>
      <ul>
        <li>
          <strong>Grievance Officer:</strong> {LEGAL.grievanceOfficerName}
        </li>
        <li>
          <strong>Email:</strong> {LEGAL.grievanceEmail}
        </li>
        <li>
          <strong>Address:</strong> {LEGAL.registeredAddress}
        </li>
      </ul>
      <p>
        We aim to acknowledge grievances within 48 hours and to resolve them
        within the timelines prescribed under applicable law.
      </p>

      <h2>20. Changes to these Terms</h2>
      <p>
        We may revise these Terms at any time by posting the updated version on
        this page with a new “Last updated” date. Changes take effect when
        posted. Your continued use of the Website after changes are posted
        constitutes your acceptance of the revised Terms.
      </p>

      <h2>21. Contact us</h2>
      <p>
        For any questions about these Terms or your order, contact us at{" "}
        {LEGAL.supportEmail} or {LEGAL.supportPhone} ({LEGAL.supportHours}).
      </p>
    </LegalPage>
  );
}
