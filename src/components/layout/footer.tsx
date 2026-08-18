import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { STORE_NAME } from "@/lib/constants";
import { LEGAL } from "@/lib/legal";

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="mt-12 bg-ink text-canvas">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-xl font-extrabold">
            Under <span className="text-marigold">₹999</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-canvas/60">
            India&apos;s honest budget store. Every single product is ₹999 or
            under — cash on delivery available, and a checkout that respects
            your time.
          </p>
          <p className="mt-4 text-xs text-canvas/40">
            {LEGAL.businessName}
            <br />
            GSTIN {LEGAL.gstNumber}
          </p>
        </div>

        <nav aria-label="Shop categories">
          <p className="font-display font-bold">Shop</p>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-canvas/70">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="transition-colors hover:text-marigold"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/categories"
                className="font-semibold text-marigold transition-colors hover:text-marigold-deep"
              >
                All categories →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="font-display font-bold">Company</p>
          <ul className="mt-3 grid gap-2 text-sm text-canvas/70">
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
              { href: "/track-order", label: "Track Order" },
              { href: "/cart", label: "Your Cart" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-marigold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Policies">
          <p className="font-display font-bold">Policies</p>
          <ul className="mt-3 grid gap-2 text-sm text-canvas/70">
            {[
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/shipping", label: "Shipping Policy" },
              { href: "/returns", label: "Return Policy" },
              { href: "/refund", label: "Refund & Cancellation" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-marigold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-canvas/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-canvas/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/terms" className="hover:text-marigold">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-marigold">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
