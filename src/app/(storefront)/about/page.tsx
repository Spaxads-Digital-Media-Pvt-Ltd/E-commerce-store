import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, BadgeCheck, PackageCheck, Sparkles } from "lucide-react";
import { LEGAL } from "@/lib/legal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: `${LEGAL.brandName} is India's honest budget store — every product ₹999 or under, across 12 everyday categories. Learn about ${LEGAL.businessName}.`,
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Honestly under ₹999",
    body: "Every single product is priced ₹999 or under — no inflated MRPs hiding a small discount. What you see is a genuinely budget-friendly price.",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    body: "Pay when your order arrives. No advance payment needed, and secure online payment (UPI, cards, net banking) is available too.",
  },
  {
    icon: PackageCheck,
    title: "No login, no fuss",
    body: "Shop as a guest — no account or password required. Track any order with just your order number and mobile number.",
  },
  {
    icon: BadgeCheck,
    title: "Quality you can trust",
    body: "Products across our range are selected to be practical, useful, and durable, so everyday value never means throwaway quality.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* hero */}
      <section className="bg-canvas-alt">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-marigold-deep">
            About Us
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            India&apos;s honest budget store —{" "}
            <span className="text-marigold-deep">everything under ₹999</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
            {LEGAL.brandName} was built on a simple idea: great everyday products
            shouldn&apos;t cost a fortune, and shopping for them shouldn&apos;t
            waste your time. We bring together useful, practical products across
            12 categories — and price every one of them at ₹999 or under.
          </p>
        </div>
      </section>

      {/* mission */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-display text-2xl font-bold text-ink">Who we are</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-ink/80">
          <p>
            {LEGAL.brandName} is operated by{" "}
            <strong className="font-semibold text-ink">
              {LEGAL.businessName}
            </strong>{" "}
            (trading as {LEGAL.tradeName}), a company registered in India and
            based in {LEGAL.governingCity}, {LEGAL.governingState}. We run a
            mobile-first online store designed for price-conscious shoppers who
            want obvious value without the clutter.
          </p>
          <p>
            From mobile accessories and fashion to home, kitchen, beauty, toys,
            and fitness essentials, our catalogue is curated so that browsing is
            fast, prices are honest, and checkout is short. We keep things
            transparent — the price you see is inclusive of taxes, delivery
            charges are shown up front, and Cash on Delivery is always available.
          </p>
        </div>
      </section>

      {/* values */}
      <section className="bg-canvas-alt">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center font-display text-2xl font-bold text-ink">
            Why shop with us
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-canvas p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-marigold/15">
                  <Icon aria-hidden className="size-5 text-marigold-deep" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          Ready to find a deal?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Browse 12 categories — and not a single price tag over ₹999.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/categories">Start shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
