import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-gray-200 bg-canvas px-3.5 py-2 text-sm text-ink placeholder:text-gray-400 focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-sindoor aria-[invalid=true]:focus:ring-sindoor/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
