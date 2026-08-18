"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PackageSearch, ShoppingCart } from "lucide-react";
import { selectCartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

// No-login Phase 1: "Track Order" replaces the usual Account tab (§4).
const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/track-order", label: "Track Order", icon: PackageSearch },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const count = useCart(selectCartCount);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const shown = hasHydrated ? count : 0;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-marigold-deep" : "text-gray-500"
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden />
                  {href === "/cart" && shown > 0 ? (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sindoor px-1 font-mono text-[10px] font-bold text-canvas">
                      {shown > 99 ? "99+" : shown}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
