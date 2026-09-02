import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import { toProductDTO } from "./serializers";
import {
  PRICE_BANDS,
  type PriceBandValue,
  type SortValue,
} from "@/lib/constants";
import type { CategoryDTO, ProductDTO } from "@/types";

// Shared data-access layer: server components AND API routes both call these,
// so filtering/sorting logic exists exactly once.

const productInclude = {
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude;

// Categories retired from the storefront — hidden from all navigation and
// their category page 404s. Their products stay in the DB (kept inactive) so
// existing orders that reference them remain intact and unbroken.
const HIDDEN_CATEGORY_SLUGS = new Set(["toys-baby-kids"]);

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await db.category.findMany({
    orderBy: { position: "asc" },
  });
  return categories.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug));
}

// cache(): the segment layout (404 guard) and the page share one query.
export const getCategoryBySlug = cache(
  async (slug: string): Promise<CategoryDTO | null> => {
    if (HIDDEN_CATEGORY_SLUGS.has(slug)) return null;
    return db.category.findUnique({ where: { slug } });
  }
);

export type ProductListParams = {
  categorySlug?: string;
  sort?: SortValue;
  priceBand?: PriceBandValue;
  minRating?: number;
  page?: number;
  pageSize?: number;
  ids?: string[];
  featuredOnly?: boolean;
};

function sortToOrderBy(
  sort: SortValue | undefined
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "rating":
      return [{ rating: "desc" }, { ratingCount: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "popularity":
    default:
      return [{ isFeatured: "desc" }, { ratingCount: "desc" }];
  }
}

export async function getProducts(params: ProductListParams = {}): Promise<{
  products: ProductDTO[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 12));

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (params.categorySlug) where.category = { slug: params.categorySlug };
  if (params.featuredOnly) where.isFeatured = true;
  if (params.ids?.length) where.id = { in: params.ids.slice(0, 60) };
  if (params.priceBand) {
    const band = PRICE_BANDS.find((b) => b.value === params.priceBand);
    if (band) where.price = { gte: band.min, lte: band.max };
  }
  if (params.minRating) where.rating = { gte: params.minRating };

  const [rows, total] = await db.$transaction([
    db.product.findMany({
      where,
      include: productInclude,
      orderBy: sortToOrderBy(params.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return { products: rows.map(toProductDTO), total, page, pageSize };
}

// cache(): the segment layout (404 guard) and the page share one query.
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDTO | null> => {
    const row = await db.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!row || !row.isActive) return null;
    return toProductDTO(row);
  }
);

export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 8
): Promise<ProductDTO[]> {
  const rows = await db.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
      id: { not: productId },
    },
    include: productInclude,
    orderBy: [{ rating: "desc" }],
    take: limit,
  });
  return rows.map(toProductDTO);
}

export async function searchProducts(
  q: string,
  limit = 24
): Promise<ProductDTO[]> {
  const query = q.trim().slice(0, 80);
  if (!query) return [];
  // NOTE: SQLite `contains` is case-insensitive for ASCII. When switching the
  // datasource to Postgres, add `mode: "insensitive"` to these filters.
  const rows = await db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: productInclude,
    orderBy: [{ ratingCount: "desc" }],
    take: limit,
  });
  return rows.map(toProductDTO);
}

export async function getFeaturedProducts(limit = 12): Promise<ProductDTO[]> {
  const rows = await db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: [{ ratingCount: "desc" }],
    take: limit,
  });
  return rows.map(toProductDTO);
}

// For generateStaticParams / sitemap.
export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// Cheapest in-stock product per category — feeds the ₹999 Ticker (§7.4).
export async function getCheapestPerCategory(): Promise<
  { category: CategoryDTO; startingPrice: number }[]
> {
  const categories = await getCategories();
  const cheapest = await Promise.all(
    categories.map((category) =>
      db.product
        .findFirst({
          where: { isActive: true, stock: { gt: 0 }, categoryId: category.id },
          orderBy: { price: "asc" },
          select: { price: true },
        })
        .then((p) => ({ category, startingPrice: p?.price ?? 0 }))
    )
  );
  return cheapest.filter((c) => c.startingPrice > 0);
}
