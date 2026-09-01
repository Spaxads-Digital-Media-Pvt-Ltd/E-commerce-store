"use client";

import { cn } from "@/lib/utils";
import { SizeChart } from "./size-chart";

export function SizeSelector({
  sizes,
  value,
  onChange,
  attributes = [],
  className,
}: {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
  attributes?: { label: string; value: string }[];
  className?: string;
}) {
  if (sizes.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">
          Size{value ? `: ${value}` : ""}
        </span>
        <SizeChart sizes={sizes} attributes={attributes} />
      </div>
      <div
        role="radiogroup"
        aria-label="Select a size"
        className="mt-2 flex flex-wrap gap-2"
      >
        {sizes.map((s) => {
          const active = value === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(s)}
              className={cn(
                "min-w-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "border-marigold bg-marigold text-ink"
                  : "border-gray-200 bg-canvas text-ink hover:border-marigold"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
