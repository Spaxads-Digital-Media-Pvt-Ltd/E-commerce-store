import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";

// Existence guard in the segment LAYOUT: layouts resolve before the
// loading.tsx streaming boundary flushes, so unknown slugs get a real 404
// status instead of a soft-404 (200 + not-found UI). The lookup is wrapped
// in React cache(), so the page's own call reuses this query.
export default async function ProductSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return children;
}
