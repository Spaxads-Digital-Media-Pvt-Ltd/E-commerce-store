"use client";

import { useRouter } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";
import { withParams } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";
import type { ListingFilters } from "./filters-panel";

export function SortSelect({
  basePath,
  filters,
}: {
  basePath: string;
  filters: ListingFilters;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-products"
        className="shrink-0 text-sm text-gray-500"
      >
        Sort by
      </label>
      <NativeSelect
        id="sort-products"
        value={filters.sort ?? "popularity"}
        onChange={(e) =>
          router.push(
            withParams(basePath, { ...filters, sort: e.target.value }),
            { scroll: false }
          )
        }
        className="h-9 w-44"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
