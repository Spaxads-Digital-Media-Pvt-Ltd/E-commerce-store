import { CategoryChips } from "@/components/home/category-chips";
import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import { PriceTicker } from "@/components/home/price-ticker";
import { ProductRail } from "@/components/home/product-rail";
import { shortCategoryName } from "@/components/category-icon";
import {
  getCategories,
  getCheapestPerCategory,
  getFeaturedProducts,
  getProducts,
} from "@/lib/queries";

export const revalidate = 60; // ISR — §14

// One rail per high-interest category after "Trending" (§8: 4–6 rails).
const RAIL_CATEGORY_SLUGS = [
  "home-kitchen",
  "womens-fashion",
  "mobile-electronics",
  "beauty-personal-care",
  "home-decor",
];

export default async function HomePage() {
  const [categories, tickerEntries, featured] = await Promise.all([
    getCategories(),
    getCheapestPerCategory(),
    getFeaturedProducts(12),
  ]);
  const rails = await Promise.all(
    RAIL_CATEGORY_SLUGS.map((slug) =>
      getProducts({ categorySlug: slug, pageSize: 8, sort: "popularity" })
    )
  );

  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <>
      <CategoryChips categories={categories} />
      <Hero />
      <PriceTicker entries={tickerEntries} />

      <section id="categories" className="scroll-mt-24 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 font-display text-xl font-bold text-ink sm:text-2xl">
            Shop by category
          </h2>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <ProductRail
        id="trending"
        title="Trending Under ₹999"
        href="/categories"
        products={featured}
        className="bg-canvas-alt"
      />

      {RAIL_CATEGORY_SLUGS.map((slug, i) => {
        const category = categoryBySlug.get(slug);
        if (!category) return null;
        return (
          <ProductRail
            key={slug}
            title={shortCategoryName(slug, category.name)}
            href={`/category/${slug}`}
            products={rails[i]?.products ?? []}
            className={i % 2 === 1 ? "bg-canvas-alt" : undefined}
          />
        );
      })}
    </>
  );
}
