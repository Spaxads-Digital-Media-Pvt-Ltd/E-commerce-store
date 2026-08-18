"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { ProductDTO } from "@/types";
import { formatINR } from "@/lib/utils";

// Debounced search with a small suggestions dropdown; Enter (or the button)
// goes to the full /search page.
export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialQuery);
  const [results, setResults] = React.useState<ProductDTO[]>([]);
  const [open, setOpen] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=6`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { products: ProductDTO[] };
        setResults(data.products);
        setOpen(true);
      } catch {
        // aborted or offline — suggestions are best-effort
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  // Close when clicking/tabbing outside
  React.useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function goToSearch() {
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch();
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <input
            id="site-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search kurtis, earbuds, chopper…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            aria-expanded={open}
            className="h-10 w-full rounded-xl border-0 bg-canvas pl-4 pr-11 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-marigold"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-marigold text-ink transition-colors hover:bg-marigold-deep"
          >
            <Search className="size-4" />
          </button>
        </div>
      </form>

      {open && results.length > 0 ? (
        <div className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-gray-200 bg-canvas text-ink shadow-xl">
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/product/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-canvas-alt"
                >
                  <Image
                    src={p.images[0] ?? ""}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {p.name}
                  </span>
                  <span className="shrink-0 font-display text-sm font-bold">
                    {formatINR(p.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={goToSearch}
            className="block w-full border-t border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-marigold-deep hover:bg-canvas-alt"
          >
            See all results for “{q.trim()}”
          </button>
        </div>
      ) : null}
    </div>
  );
}
