import Link from "next/link";
import { PRICE_BANDS, RATING_FILTERS } from "@/lib/constants";
import { cn, withParams } from "@/lib/utils";

export type ListingFilters = {
  sort?: string;
  band?: string;
  rating?: string;
};

function OptionLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
        active
          ? "bg-marigold/15 font-semibold text-marigold-deep"
          : "text-ink hover:bg-canvas-alt"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-4 items-center justify-center rounded-full border-2",
          active ? "border-marigold-deep" : "border-gray-200"
        )}
      >
        {active ? (
          <span className="size-2 rounded-full bg-marigold-deep" />
        ) : null}
      </span>
      {label}
    </Link>
  );
}

// Filters are plain links — SSR-rendered, crawlable, zero client state.
// Changing a filter resets pagination (page param is intentionally dropped).
export function FiltersPanel({
  basePath,
  filters,
}: {
  basePath: string;
  filters: ListingFilters;
}) {
  const { sort, band, rating } = filters;
  const hasActive = Boolean(band || rating);

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-ink">Price</legend>
        <div className="space-y-0.5">
          <OptionLink
            href={withParams(basePath, { sort, rating })}
            active={!band}
            label="All prices"
          />
          {PRICE_BANDS.map((b) => (
            <OptionLink
              key={b.value}
              href={withParams(basePath, { sort, rating, band: b.value })}
              active={band === b.value}
              label={b.label}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-ink">Rating</legend>
        <div className="space-y-0.5">
          <OptionLink
            href={withParams(basePath, { sort, band })}
            active={!rating}
            label="Any rating"
          />
          {RATING_FILTERS.map((r) => (
            <OptionLink
              key={r.value}
              href={withParams(basePath, { sort, band, rating: r.value })}
              active={rating === r.value}
              label={r.label}
            />
          ))}
        </div>
      </fieldset>

      {hasActive ? (
        <Link
          href={withParams(basePath, { sort })}
          className="inline-block text-sm font-semibold text-sindoor hover:underline"
        >
          Clear all filters
        </Link>
      ) : null}
    </div>
  );
}
