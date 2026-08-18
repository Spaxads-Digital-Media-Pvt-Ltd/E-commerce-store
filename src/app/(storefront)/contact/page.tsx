import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Store,
} from "lucide-react";
import { LEGAL } from "@/lib/legal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${LEGAL.brandName} (${LEGAL.businessName}) — email, phone, GST, and registered address.`,
  alternates: { canonical: "/contact" },
};

const PHONE_TEL = LEGAL.supportPhone.replace(/[^\d+]/g, "");

export default function ContactPage() {
  const details = [
    { icon: Building2, label: "Company Name", value: LEGAL.businessName },
    { icon: Store, label: "Trade Name", value: LEGAL.tradeName },
    {
      icon: Mail,
      label: "Email",
      value: LEGAL.supportEmail,
      href: `mailto:${LEGAL.supportEmail}`,
    },
    {
      icon: Phone,
      label: "Mobile No.",
      value: LEGAL.supportPhone,
      href: `tel:${PHONE_TEL}`,
    },
    { icon: ReceiptText, label: "GST Number", value: LEGAL.gstNumber },
    { icon: MapPin, label: "Address", value: LEGAL.registeredAddress },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 text-sm leading-7 text-ink/80">
        Have a question about an order, a return, or anything else? We&apos;re
        happy to help. Reach us using the details below — we typically respond
        during {LEGAL.supportHours}.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
        <dl className="divide-y divide-gray-200">
          {details.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="flex items-start gap-4 px-5 py-4 even:bg-canvas-alt/60"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-marigold/15">
                <Icon aria-hidden className="size-4.5 text-marigold-deep" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">
                  {href ? (
                    <a
                      href={href}
                      className="text-marigold-deep underline underline-offset-2 hover:text-marigold"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-2xl bg-canvas-alt p-5">
        <h2 className="font-display text-lg font-bold text-ink">
          Order queries
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          For the fastest help with an existing order, email us your{" "}
          <strong className="text-ink">order number</strong> (format
          ORD-YYYYMMDD-XXXXX) along with your question. You can also check status
          any time on the Track Order page.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <a href={`mailto:${LEGAL.supportEmail}`}>Email us</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/track-order">Track your order</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 text-sm leading-7 text-ink/80">
        <h2 className="font-display text-lg font-bold text-ink">
          Grievance Officer
        </h2>
        <p className="mt-1">
          In line with applicable Indian law, complaints regarding the Website,
          an order, or your data may be directed to our Grievance Officer,{" "}
          {LEGAL.grievanceOfficerName}, at{" "}
          <a
            href={`mailto:${LEGAL.grievanceEmail}`}
            className="font-medium text-marigold-deep underline underline-offset-2 hover:text-marigold"
          >
            {LEGAL.grievanceEmail}
          </a>
          . See our <Link href="/privacy" className="font-medium text-marigold-deep underline underline-offset-2 hover:text-marigold">Privacy Policy</Link>{" "}
          and{" "}
          <Link href="/terms" className="font-medium text-marigold-deep underline underline-offset-2 hover:text-marigold">
            Terms &amp; Conditions
          </Link>{" "}
          for more.
        </p>
      </div>
    </div>
  );
}
