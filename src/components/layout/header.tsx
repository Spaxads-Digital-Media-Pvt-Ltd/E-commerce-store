import Link from "next/link";
import { PackageSearch, User } from "lucide-react";
import { COPY, STORE_NAME } from "@/lib/constants";
import { getSession } from "@/server/auth/session";
import { SearchBox } from "./search-box";
import { CartButton } from "./cart-button";

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40">
      {/* utility strip */}
      <p className="bg-mehendi py-1.5 text-center text-xs font-medium text-canvas">
        {COPY.freeDeliveryStrip} · Cash on Delivery available
      </p>

      <div className="bg-ink text-canvas shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="shrink-0 font-display text-xl font-extrabold leading-none"
            aria-label={`${STORE_NAME} — home`}
          >
            Under <span className="text-marigold">₹999</span>
          </Link>

          <div className="hidden flex-1 justify-center px-4 md:flex">
            <div className="w-full max-w-xl">
              <SearchBox />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/track-order"
              className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-canvas transition-colors hover:bg-canvas/10 md:flex"
            >
              <PackageSearch className="size-5" />
              Track Order
            </Link>
            <Link
              href={session ? "/account" : "/login"}
              className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-canvas transition-colors hover:bg-canvas/10 md:flex"
            >
              <User className="size-5" />
              {session ? "My Account" : "Login"}
            </Link>
            <CartButton />
          </div>
        </div>

        {/* mobile search row */}
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>
      </div>
    </header>
  );
}
