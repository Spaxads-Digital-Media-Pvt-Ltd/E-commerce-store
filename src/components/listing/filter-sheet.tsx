"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mobile filters live in a bottom sheet (§8); the panel itself is
// server-rendered and passed in as children.
export function FilterSheet({
  children,
  activeCount,
}: {
  children: React.ReactNode;
  activeCount: number;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal />
          Filters
          {activeCount > 0 ? (
            <span className="flex size-4.5 items-center justify-center rounded-full bg-marigold font-mono text-[10px] font-bold text-ink">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Narrow products by price band and rating.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
