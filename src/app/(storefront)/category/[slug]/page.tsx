import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageOpen } from "lucide-react";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/server/queries";
import { PRICE_BANDS, RATING_FILTERS, SORT_OPTIONS } from "@/lib/constants";
import type { PriceBandValue, SortValue } from "@/lib/constants";
import { withParams } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";
import { FiltersPanel } from "@/components/listing/filters-panel";
import { FilterSheet } from "@/components/listing/filter-sheet";
import { SortSelect } from "@/components/listing/sort-select";
import { Pagination } from "@/components/listing/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  // 404 must be committed before the loading.tsx shell streams (see the
  // matching note on the product page).
  if (!category) notFound();
  return {
    title: `${category.name} Under ₹999`,
    description: `Shop ${category.name.toLowerCase()} — every product ₹999 or under. Cash on Delivery available.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  // Whitelist-validate every query param (never trust raw input — §13)
  const sortRaw = first(sp.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw)
    ? (sortRaw as SortValue)
    : undefined;
  const bandRaw = first(sp.band);
  const band = PRICE_BANDS.some((b) => b.value === bandRaw)
    ? (bandRaw as PriceBandValue)
    : undefined;
  const ratingRaw = first(sp.rating);
  const rating = RATING_FILTERS.some((r) => r.value === ratingRaw)
    ? ratingRaw
    : undefined;
  const pageNum = Math.max(1, parseInt(first(sp.page) ?? "1", 10) || 1);

  const { products, total, page, pageSize } = await getProducts({
    categorySlug: slug,
    sort,
    priceBand: band,
    minRating: rating ? Number(rating) : undefined,
    page: pageNum,
  });

  const basePath = `/category/${slug}`;
  const filters = { sort, band, rating };
  const activeCount = (band ? 1 : 0) + (rating ? 1 : 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} product{total === 1 ? "" : "s"} — everything ₹999 or under
        </p>
      </header>

      <div className="mb-4 flex items-center justify-between gap-3">
        <FilterSheet activeCount={activeCount}>
          <FiltersPanel basePath={basePath} filters={filters} />
        </FilterSheet>
        <div className="ml-auto">
          <SortSelect basePath={basePath} filters={filters} />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-gray-200 p-4">
            <FiltersPanel basePath={basePath} filters={filters} />
          </div>
        </aside>

        <div>
          {products.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No products match these filters"
              description="Try widening the price range or clearing filters."
            >
              <Button variant="outline" asChild>
                <Link href={withParams(basePath, { sort })}>
                  Clear all filters
                </Link>
              </Button>
            </EmptyState>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            basePath={basePath}
            filters={filters}
            page={page}
            pageSize={pageSize}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
