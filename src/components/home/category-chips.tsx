import Link from "next/link";
import { shortCategoryName } from "@/components/category-icon";
import type { CategoryDTO } from "@/types";

export function CategoryChips({ categories }: { categories: CategoryDTO[] }) {
  return (
    <nav
      aria-label="Browse categories"
      className="overflow-x-clip border-b border-gray-200 bg-canvas"
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 bg-canvas px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-marigold hover:text-marigold-deep"
          >
            {shortCategoryName(c.slug, c.name)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
