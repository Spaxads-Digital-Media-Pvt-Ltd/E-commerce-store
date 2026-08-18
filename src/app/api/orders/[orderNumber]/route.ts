import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackOrderSchema } from "@/lib/validations/order";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { toOrderDTO } from "@/lib/serializers";
import { apiError, serverErrorResponse } from "@/lib/api";

// GET /api/orders/[orderNumber]?phone=XXXXXXXXXX
//
// IDOR guard (§13): order data is returned ONLY when the submitted phone
// number matches the order. A wrong phone and a nonexistent order both get
// the same 404 — no way to enumerate order numbers or read other customers'
// addresses.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const limited = await rateLimit("order-lookup", clientIp(req), 10, 60);
    if (!limited.success) {
      return apiError("Too many lookups — please wait a minute.", 429);
    }

    const { orderNumber } = await params;
    const phone = req.nextUrl.searchParams.get("phone") ?? "";

    const parsed = trackOrderSchema.safeParse({ orderNumber, phone });
    if (!parsed.success) {
      return apiError("Order not found.", 404);
    }

    const order = await db.order.findUnique({
      where: { orderNumber: parsed.data.orderNumber },
      include: { items: { include: { product: { select: { slug: true } } } } },
    });

    if (!order || order.phone !== parsed.data.phone) {
      return apiError("Order not found.", 404);
    }

    return NextResponse.json({ order: toOrderDTO(order) });
  } catch (err) {
    return serverErrorResponse(err, "api/orders/[orderNumber]");
  }
}
