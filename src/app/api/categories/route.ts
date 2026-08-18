import { NextResponse } from "next/server";
import { getCategories } from "@/lib/queries";
import { serverErrorResponse } from "@/lib/api";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    return serverErrorResponse(err, "api/categories");
  }
}
