import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// A styled native <select> — reliable on mobile (bottom-sheet pickers),
// zero JS, fully accessible.
const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-11 w-full appearance-none rounded-xl border border-gray-200 bg-canvas pl-3.5 pr-9 text-sm text-ink focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-sindoor",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
    />
  </div>
));
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
