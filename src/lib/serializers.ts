import type { Order, OrderItem, Product } from "@prisma/client";
import type { OrderDTO, ProductDTO } from "@/types";

type ProductWithCategory = Product & {
  category: { name: string; slug: string };
};

export function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((u) => typeof u === "string");
  } catch {
    // fall through
  }
  return [];
}

export function toProductDTO(product: ProductWithCategory): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    mrp: product.mrp,
    images: parseImages(product.images),
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    stock: product.stock,
    rating: product.rating,
    ratingCount: product.ratingCount,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };
}

type OrderWithItems = Order & {
  items: (OrderItem & { product?: { slug: string } | null })[];
};

export function toOrderDTO(order: OrderWithItems): OrderDTO {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      name: i.name,
      price: i.price,
      qty: i.qty,
      image: i.image,
      productSlug: i.product?.slug,
    })),
  };
}
