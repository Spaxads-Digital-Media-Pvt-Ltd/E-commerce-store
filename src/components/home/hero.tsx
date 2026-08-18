import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const TRUST_POINTS = [
  "Cash on Delivery",
  `Free delivery over ₹${FREE_SHIPPING_THRESHOLD}`,
  "No login needed",
];

export function Hero() {
  return (
    <section className="bg-canvas-alt">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:py-14">
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Everything Under{" "}
          <span className="relative inline-block text-marigold-deep">
            ₹999
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-marigold/40"
            />
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 sm:text-lg">
          India&apos;s honest budget store — 12 categories of real deals, and
          not a single price tag over ₹999. Browse fast, check out faster.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/categories">Start shopping</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#trending">See what&apos;s trending</Link>
          </Button>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {TRUST_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-center gap-1.5 text-sm font-medium text-ink/80"
            >
              <BadgeCheck aria-hidden className="size-4 text-mehendi" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
