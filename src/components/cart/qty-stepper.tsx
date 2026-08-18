"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  max,
  onChange,
  label,
  className,
}: {
  value: number;
  max: number; // current stock, fetched — never hardcoded (§9)
  onChange: (qty: number) => void;
  label: string; // product name, for screen readers
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-gray-200",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
        className="flex size-8 items-center justify-center rounded-l-xl text-ink transition-colors hover:bg-canvas-alt disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center font-mono text-sm font-semibold"
      >
        {value}
        <span className="sr-only"> of {label} in cart</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
        className="flex size-8 items-center justify-center rounded-r-xl text-ink transition-colors hover:bg-canvas-alt disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
