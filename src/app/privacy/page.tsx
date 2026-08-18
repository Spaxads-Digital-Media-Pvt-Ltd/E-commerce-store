import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${LEGAL.brandName} collects, uses, shares, and protects your personal information when you shop at ${LEGAL.websiteName}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={LEGAL.lastUpdated}
      intro={`This Privacy Policy explains how ${LEGAL.businessName}, which operates ${LEGAL.brandName} at ${LEGAL.websiteName} ("we", "us", "our"), collects, uses, shares, and protects your personal information when you use our Website and place orders. We are committed to handling your data responsibly and in line with applicable Indian law, including the Information Technology Act, 2000 (and the SPDI Rules) and the Digital Personal Data Protection Act, 2023.`}
    >
      <h2>1. A note on how we’re built</h2>
      <p>
        We designed {LEGAL.brandName} to collect as little personal data as
        possible. You do not create an account or a password to shop with us —
        checkout is guest-only. Your shopping cart is stored locally in your own
        browser and is only sent to us when you place an order.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Order & delivery details:</strong> your name, mobile number,
          delivery address (including city, state, and PIN code), and — if you
          choose to provide it — your email address, given at checkout.
        </li>
        <li>
          <strong>Communications:</strong> information you share when you contact
          us for support, returns, or grievances.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Technical & security data:</strong> your IP address and basic
          browser/device information, captured in server logs. We use this to
          keep the service secure, prevent abuse, and apply rate limits to
          sensitive actions such as placing orders and searching.
        </li>
      </ul>
      <h3>Information stored on your device</h3>
      <ul>
        <li>
          <strong>Your cart</strong> is saved in your browser’s local storage so
          it survives page refreshes. It stays on your device and is not
          transmitted to us until you place an order.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> knowingly collect your full payment-card
        number, UPI PIN, CVV, or bank login credentials — those are handled
        directly by our payment gateway (see below).
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>to process, confirm, fulfil, and deliver your orders;</li>
        <li>
          to communicate with you about your order, including delivery updates
          and support responses;
        </li>
        <li>
          to let you track an order using your order number and mobile number;
        </li>
        <li>
          to detect, prevent, and address fraud, abuse, and security issues;
        </li>
        <li>
          to comply with legal obligations and enforce our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>.
        </li>
      </ul>
      <p>
        We rely on the performance of our contract with you (to fulfil orders),
        your consent (for example, if you provide your email), and our
        legitimate interests and legal obligations (for security and compliance)
        as the bases for processing your information.
      </p>

      <h2>4. Payment information</h2>
      <p>
        Online payments are processed by our payment gateway,{" "}
        <strong>Razorpay</strong>. When you pay online, your payment details are
        collected and processed directly by Razorpay under its own terms and
        privacy policy. We receive only limited information such as whether the
        payment succeeded and a payment/order reference — not your card or bank
        credentials. For Cash on Delivery orders, no payment information is
        collected online.
      </p>

      <h2>5. How we share your information</h2>
      <p>
        We do not sell your personal information. We share it only as needed to
        run the store:
      </p>
      <ul>
        <li>
          <strong>Delivery & logistics partners</strong> — to deliver your order
          (they receive your name, address, and phone number).
        </li>
        <li>
          <strong>Payment gateway (Razorpay)</strong> — to process online
          payments.
        </li>
        <li>
          <strong>Service providers</strong> — cloud hosting and database
          providers that store our order data, image-hosting (cloud storage)
          providers, and a bot-protection provider (Cloudflare Turnstile) used
          to secure our checkout. These providers process data on our behalf
          under appropriate safeguards.
        </li>
        <li>
          <strong>Legal & regulatory authorities</strong> — where required by
          law, court order, or to protect our rights, users, or the public.
        </li>
        <li>
          <strong>Business transfers</strong> — in connection with a merger,
          acquisition, or sale of assets, subject to this Policy.
        </li>
      </ul>

      <h2>6. Cookies & local storage</h2>
      <p>
        We use minimal cookies and browser storage. This includes essential
        local storage to remember your cart, and cookies set by our
        bot-protection provider (Cloudflare Turnstile) to secure the checkout
        form against automated abuse. We do not use your cart data for
        advertising. You can clear local storage and cookies through your
        browser settings, though doing so will empty your saved cart.
      </p>

      <h2>7. Data retention period</h2>
      <p>
        We keep your personal information only for as long as necessary for the
        purposes described in this Policy:
      </p>
      <ul>
        <li>
          <strong>Order & transaction records</strong> are retained for up to{" "}
          {LEGAL.dataRetentionYears} years, as required under applicable tax,
          accounting, and company-law obligations in India.
        </li>
        <li>
          <strong>Support and grievance communications</strong> are retained for
          up to 3 years to help us resolve repeat issues and meet legal
          requirements.
        </li>
        <li>
          <strong>Security and server logs</strong> (such as IP addresses) are
          retained for a short period — typically up to 90 days — for fraud
          prevention and troubleshooting.
        </li>
      </ul>
      <p>
        Once data is no longer required, it is securely deleted or anonymised.
        You may request earlier deletion of your data (see “Your rights”),
        subject to the retention obligations above.
      </p>

      <h2>8. Data security</h2>
      <p>
        We implement reasonable security practices and procedures to protect
        your information, including encryption of data in transit (HTTPS),
        access controls, server-side validation, rate limiting, and restricting
        who can access order data. Order lookups require both your order number
        and the matching mobile number, so your order details are not exposed by
        the order number alone. No method of transmission or storage is fully
        secure, but we work to protect your information and to address any
        incident responsibly.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Subject to applicable law, including the Digital Personal Data
        Protection Act, 2023, you may:
      </p>
      <ul>
        <li>request access to the personal data we hold about you;</li>
        <li>request correction or updating of inaccurate data;</li>
        <li>
          request erasure of your data, where it is no longer required and
          subject to our legal retention obligations;
        </li>
        <li>withdraw consent you previously gave (for example, for email);</li>
        <li>
          raise a grievance about how your data is handled with our Grievance
          Officer (see below).
        </li>
      </ul>
      <p>
        To exercise any of these rights, contact us at {LEGAL.supportEmail} with
        enough detail (such as your order number) for us to verify your request.
      </p>

      <h2>10. Children’s privacy</h2>
      <p>
        The Website is intended for users aged 18 and above. We do not knowingly
        collect personal data from children without the consent of a parent or
        guardian. If you believe a child has provided us data without such
        consent, contact us and we will take appropriate steps to delete it.
      </p>

      <h2>11. Third-party links</h2>
      <p>
        The Website may link to third-party sites or services. This Policy does
        not apply to those third parties, and we are not responsible for their
        privacy practices. Please review their policies before providing them
        your information.
      </p>

      <h2>12. Where your data is stored</h2>
      <p>
        Your information is stored and processed using reputable cloud
        infrastructure and service providers. Where data is processed on servers
        located outside India, we take steps consistent with applicable law to
        protect it.
      </p>

      <h2>13. Changes to this Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The current version
        will always be posted on this page with a revised “Last updated” date.
        Significant changes will be reflected here; please review the Policy
        periodically.
      </p>

      <h2>14. Grievance Officer & contact</h2>
      <p>
        In accordance with the Information Technology Act, 2000 and the Digital
        Personal Data Protection Act, 2023, you may contact our Grievance
        Officer for any privacy-related concern or to exercise your rights:
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
        For general support, reach us at {LEGAL.supportEmail} or{" "}
        {LEGAL.supportPhone} ({LEGAL.supportHours}).
      </p>
    </LegalPage>
  );
}
