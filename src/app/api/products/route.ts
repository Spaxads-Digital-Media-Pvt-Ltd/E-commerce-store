import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProducts } from "@/server/queries";
import { serverErrorResponse, zodErrorResponse } from "@/server/api";

// Every param is whitelist-validated before touching the DB (§13).
const querySchema = z.object({
  category: z.string().max(64).optional(),
  sort: z
    .enum(["popularity", "price_asc", "price_desc", "rating", "newest"])
    .optional(),
  band: z.enum(["under-199", "200-499", "500-999"]).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(48).optional(),
  // comma-separated product ids — used by the cart revalidation flow
  ids: z.string().max(4000).optional(),
  featured: z.enum(["true", "false"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const raw = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const q = parsed.data;

    const result = await getProducts({
      categorySlug: q.category,
      sort: q.sort,
      priceBand: q.band,
      minRating: q.rating,
      page: q.page,
      pageSize: q.pageSize,
      ids: q.ids
        ? q.ids
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 60)
        : undefined,
      featuredOnly: q.featured === "true",
    });

    return NextResponse.json(result);
  } catch (err) {
    return serverErrorResponse(err, "api/products");
  }
}
