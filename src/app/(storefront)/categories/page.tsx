import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { CategoryGrid } from "@/components/home/category-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all 12 categories — mobile accessories, fashion, home, beauty, toys and more. Every product ₹999 or under.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Shop by category
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        12 categories, one promise — nothing over ₹999.
      </p>
      <div className="mt-6">
        <CategoryGrid categories={categories} />
      </div>
    </div>
  );
}
