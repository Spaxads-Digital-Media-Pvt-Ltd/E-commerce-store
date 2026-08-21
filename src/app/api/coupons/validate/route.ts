import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { apiError, serverErrorResponse, zodErrorResponse } from "@/server/api";
import { evaluateCoupon } from "@/server/coupons";
import { computeTotals } from "@/lib/pricing";
import { orderItemInputSchema } from "@/lib/validations/order";
import { MAX_CART_LINES, MAX_QTY_PER_ITEM } from "@/lib/constants";

// POST /api/coupons/validate
// Checks a coupon against the shopper's cart and returns the discount + the
// resulting totals. The subtotal is computed from CURRENT DB prices — the
// client's prices are never trusted. This endpoint is for display only; the
// coupon is re-validated and applied for real in POST /api/orders.

const bodySchema = z.object({
  code: z.string().trim().min(1).max(40),
  items: z.array(orderItemInputSchema).min(1).max(MAX_CART_LINES),
});

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit("coupon", clientIp(req), 20, 60);
    if (!limited.success) {
      return apiError("Too many attempts — please wait a minute.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request.", 400);
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);
    const { code, items } = parsed.data;

    // Merge duplicate lines + cap qty, then price from the DB.
    const qtyById = new Map<string, number>();
    for (const it of items) {
      qtyById.set(
        it.productId,
        Math.min((qtyById.get(it.productId) ?? 0) + it.qty, MAX_QTY_PER_ITEM)
      );
    }
    const products = await db.product.findMany({
      where: { id: { in: [...qtyById.keys()] }, isActive: true },
      select: { id: true, price: true, stock: true },
    });

    const priced = products
      .filter((p) => p.stock > 0)
      .map((p) => ({
        price: p.price,
        qty: Math.min(qtyById.get(p.id) ?? 0, p.stock),
      }));

    const subtotal = priced.reduce((s, i) => s + i.price * i.qty, 0);
    if (subtotal <= 0) {
      return apiError("Your cart is empty — let's fix that.", 400);
    }

    const result = evaluateCoupon(code, subtotal);
    if (!result.ok) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 200 });
    }

    const totals = computeTotals(priced, result.discount);
    return NextResponse.json({
      valid: true,
      code: result.coupon.code,
      label: result.coupon.label,
      discount: result.discount,
      totals,
    });
  } catch (err) {
    return serverErrorResponse(err, "api/coupons/validate");
  }
}
