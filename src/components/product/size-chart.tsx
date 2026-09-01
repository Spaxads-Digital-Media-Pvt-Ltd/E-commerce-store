"use client";

import { Ruler } from "lucide-react";
import { getSizeChart } from "@/lib/size-chart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SizeChart({
  sizes,
  attributes = [],
}: {
  sizes: string[];
  attributes?: { label: string; value: string }[];
}) {
  const chart = getSizeChart(sizes, attributes);
  if (!chart) return null;

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-1 text-xs font-semibold text-marigold-deep hover:underline">
        <Ruler aria-hidden className="size-3.5" />
        Size chart
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Size chart</SheetTitle>
          <SheetDescription>{chart.note}</SheetDescription>
        </SheetHeader>
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full min-w-80 border-collapse text-sm">
            <thead>
              <tr>
                {chart.columns.map((c) => (
                  <th
                    key={c}
                    className="border-b border-gray-200 px-3 py-2 text-left font-semibold text-ink"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr key={i} className="even:bg-canvas-alt/60">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        "px-3 py-2 " +
                        (j === 0 ? "font-semibold text-ink" : "text-gray-600")
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
