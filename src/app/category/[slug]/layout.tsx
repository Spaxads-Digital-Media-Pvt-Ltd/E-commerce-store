import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/queries";

// Same 404-before-streaming guard as the product segment (see note there).
export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  return children;
}
