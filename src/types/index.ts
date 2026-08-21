export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  position: number;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  images: string[];
  categorySlug: string;
  categoryName: string;
  stock: number;
  rating: number;
  ratingCount: number;
  isActive: boolean;
  isFeatured: boolean;
};

// Client-side cart line (Zustand). UI convenience only — the server
// re-derives every price from the DB at checkout.
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number; // snapshot for the qty stepper cap; revalidated on /cart
};

export type OrderItemDTO = {
  name: string;
  price: number;
  qty: number;
  image: string;
  productSlug?: string;
};

export type OrderDTO = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string | null;
  membershipFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  items: OrderItemDTO[];
};

// Never includes passwordHash.
export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
};
