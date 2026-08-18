import Link from "next/link";
import { CategoryIcon, shortCategoryName } from "@/components/category-icon";
import type { CategoryDTO } from "@/types";

export function CategoryGrid({ categories }: { categories: CategoryDTO[] }) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/category/${c.slug}`}
            className="flex h-full flex-col items-center gap-2 rounded-2xl bg-canvas-alt p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-marigold/15">
              <CategoryIcon
                name={c.icon}
                className="size-6 text-marigold-deep"
              />
            </span>
            <span className="line-clamp-2 text-xs font-medium leading-tight text-ink">
              {shortCategoryName(c.slug, c.name)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
