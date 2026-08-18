import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, ChevronRight, RotateCcw, Truck } from "lucide-react";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/queries";
import { COPY, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { shortCategoryName } from "@/components/category-icon";
import { PriceTag } from "@/components/product/price-tag";
import { RatingBadge } from "@/components/product/rating-badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductRail } from "@/components/home/product-rail";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // notFound() here (not only in the page body) so the 404 status is set
  // BEFORE the streaming shell is sent — otherwise unknown slugs soft-404
  // with a 200 because of the loading.tsx boundary.
  if (!product) notFound();
  return {
    title: `${product.name} — ₹${product.price}`,
    description: product.description.slice(0, 155),
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

const DELIVERY_POINTS = [
  { icon: Banknote, text: "Cash on Delivery available" },
  { icon: Truck, text: `Free delivery on orders over ₹${FREE_SHIPPING_THRESHOLD}` },
  { icon: RotateCcw, text: "Easy 7-day returns" },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categorySlug, 8);

  // JSON-LD Product structured data (§14). Data is first-party (our DB), and
  // `<` is escaped to keep the inline script inert against tag breakout.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
          <li>
            <Link href="/" className="hover:text-marigold-deep">
              Home
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-3" />
          <li>
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-marigold-deep"
            >
              {shortCategoryName(product.categorySlug, product.categoryName)}
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-3" />
          <li aria-current="page" className="max-w-48 truncate text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-2">
            <RatingBadge rating={product.rating} count={product.ratingCount} />
          </div>

          <div className="mt-4">
            <PriceTag price={product.price} mrp={product.mrp} size="lg" />
            <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          <p
            className={
              product.stock === 0
                ? "mt-3 text-sm font-semibold text-sindoor"
                : product.stock <= 10
                  ? "mt-3 text-sm font-semibold text-sindoor"
                  : "mt-3 text-sm font-semibold text-mehendi"
            }
          >
            {product.stock === 0
              ? COPY.outOfStock
              : product.stock <= 10
                ? `Only ${product.stock} left — order soon`
                : "In stock"}
          </p>

          <div className="mt-5">
            <ProductActions product={product} />
          </div>

          <ul className="mt-6 space-y-2.5 rounded-2xl bg-canvas-alt p-4">
            {DELIVERY_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm">
                <Icon aria-hidden className="size-4 shrink-0 text-mehendi" />
                {text}
              </li>
            ))}
          </ul>

          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-ink">
              About this item
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {product.description}
            </p>
          </section>
        </div>
      </div>

      <div className="mt-10">
        <ProductRail
          title="You may also like"
          href={`/category/${product.categorySlug}`}
          products={related}
        />
      </div>
    </div>
  );
}
