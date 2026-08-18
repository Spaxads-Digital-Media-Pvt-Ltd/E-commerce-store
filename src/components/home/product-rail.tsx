import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductDTO } from "@/types";
import { cn } from "@/lib/utils";

// Horizontal product rail with snap scrolling (§7.4).
export function ProductRail({
  id,
  title,
  href,
  products,
  className,
}: {
  id?: string;
  title: string;
  href?: string;
  products: ProductDTO[];
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    // overflow-x-clip: keeps the inner scroll rail's content from expanding
    // the document/mobile layout viewport (fixed elements inflate otherwise)
    <section id={id} className={cn("overflow-x-clip py-6 scroll-mt-24", className)}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            {title}
          </h2>
          {href ? (
            <Link
              href={href}
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-marigold-deep hover:underline"
            >
              View all
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {products.map((p) => (
            <div key={p.id} className="w-40 shrink-0 snap-start sm:w-48 lg:w-52">
              <ProductCard product={p} sizes="(max-width: 640px) 160px, 208px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
