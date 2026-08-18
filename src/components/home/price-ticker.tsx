import Link from "next/link";
import { shortCategoryName } from "@/components/category-icon";
import { formatINR } from "@/lib/utils";
import type { CategoryDTO } from "@/types";

export type TickerEntry = { category: CategoryDTO; startingPrice: number };

// The "₹999 Ticker" — the signature element (§7.4): a continuously
// auto-scrolling strip of `Category — starting ₹XX` pairs pulled from the
// cheapest in-stock product per category. Pure CSS marquee (keyframes in
// globals.css); pauses on hover/tap/focus; respects prefers-reduced-motion.
export function PriceTicker({ entries }: { entries: TickerEntry[] }) {
  if (entries.length === 0) return null;

  const renderEntries = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {entries.map(({ category, startingPrice }) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          tabIndex={ariaHidden ? -1 : 0}
          className="flex items-baseline gap-2 whitespace-nowrap text-sm hover:text-marigold"
        >
          <span className="text-canvas/70">
            {shortCategoryName(category.slug, category.name)}
          </span>
          <span className="font-display font-bold text-marigold">
            from {formatINR(startingPrice)}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <section aria-label="Starting prices by category" className="ticker overflow-hidden bg-ink py-2.5 text-canvas">
      <div className="ticker-track flex w-max">
        {renderEntries(false)}
        {/* second copy makes the CSS loop seamless — hidden from AT */}
        {renderEntries(true)}
      </div>
    </section>
  );
}
