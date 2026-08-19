import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProductBySlug } from "@/server/queries";
import { apiError, serverErrorResponse } from "@/server/api";

const slugSchema = z.string().min(1).max(140);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) return apiError("Invalid product.", 400);

    const product = await getProductBySlug(parsed.data);
    if (!product) return apiError("Product not found.", 404);

    return NextResponse.json({ product });
  } catch (err) {
    return serverErrorResponse(err, "api/products/[slug]");
  }
}
