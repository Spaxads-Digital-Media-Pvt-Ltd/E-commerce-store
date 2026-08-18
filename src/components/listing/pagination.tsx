import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, withParams } from "@/lib/utils";
import type { ListingFilters } from "./filters-panel";

export function Pagination({
  basePath,
  filters,
  page,
  pageSize,
  total,
}: {
  basePath: string;
  filters: ListingFilters;
  page: number;
  pageSize: number;
  total: number;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const window = 2;
  const pages: number[] = [];
  for (
    let p = Math.max(1, page - window);
    p <= Math.min(totalPages, page + window);
    p++
  ) {
    pages.push(p);
  }

  const linkTo = (p: number) =>
    withParams(basePath, { ...filters, page: p > 1 ? p : undefined });

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Link
          href={linkTo(page - 1)}
          aria-label="Previous page"
          className="flex size-9 items-center justify-center rounded-xl border border-gray-200 text-ink hover:border-marigold"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}

      {pages[0]! > 1 ? (
        <span className="px-1 text-sm text-gray-500">…</span>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={linkTo(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex size-9 items-center justify-center rounded-xl border text-sm font-medium",
            p === page
              ? "border-marigold bg-marigold text-ink"
              : "border-gray-200 text-ink hover:border-marigold"
          )}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1]! < totalPages ? (
        <span className="px-1 text-sm text-gray-500">…</span>
      ) : null}

      {page < totalPages ? (
        <Link
          href={linkTo(page + 1)}
          aria-label="Next page"
          className="flex size-9 items-center justify-center rounded-xl border border-gray-200 text-ink hover:border-marigold"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
