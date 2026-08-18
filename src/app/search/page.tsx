import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, Search } from "lucide-react";
import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const q = (first((await searchParams).q) ?? "").trim();
  return {
    title: q ? `Search: ${q}` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (first((await searchParams).q) ?? "").trim().slice(0, 80);
  const products = q ? await searchProducts(q, 48) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {q ? (
        <>
          <header className="mb-5">
            <h1 className="font-display text-2xl font-bold text-ink">
              Showing results for &ldquo;{q}&rdquo;
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {products.length} product{products.length === 1 ? "" : "s"} found
            </p>
          </header>

          {products.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={`No results for “${q}”`}
              description="Check the spelling, or try something more general — like “bottle” or “earrings”."
            >
              <Button asChild>
                <Link href="/categories">Browse Under ₹999 deals</Link>
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
        </>
      ) : (
        <EmptyState
          icon={Search}
          title="Search the store"
          description="Type in the search bar above — kurtis, earbuds, choppers, yoga mats…"
        >
          <Button variant="outline" asChild>
            <Link href="/categories">Or browse all categories</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
