import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchProducts } from "@/server/queries";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";

const querySchema = z.object({
  q: z.string().trim().min(1).max(80),
  limit: z.coerce.number().int().min(1).max(48).optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Abuse guard: 30 searches/min per IP (§13)
    const limited = await rateLimit("search", clientIp(req), 30, 60);
    if (!limited.success) {
      return apiError("Too many searches — please slow down.", 429);
    }

    const raw = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const products = await searchProducts(parsed.data.q, parsed.data.limit ?? 24);
    return NextResponse.json({ products });
  } catch (err) {
    return serverErrorResponse(err, "api/search");
  }
}
