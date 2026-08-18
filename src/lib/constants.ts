export const STORE_NAME = "Under ₹999";
export const STORE_TAGLINE = "Everything Under ₹999";

// Hard catalog rule: no product may be priced above this.
export const PRICE_CAP = 999;

// Shipping policy (matches the "Free delivery over ₹399" utility strip).
export const FLAT_SHIPPING_FEE = 49;
export const FREE_SHIPPING_THRESHOLD = 399;

// Cart guardrails
export const MAX_QTY_PER_ITEM = 10;
export const MAX_CART_LINES = 30;

export const PAYMENT_METHODS = {
  COD: "COD",
  RAZORPAY: "RAZORPAY",
} as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const ORDER_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_BANDS = [
  { value: "under-199", label: "Under ₹199", min: 0, max: 199 },
  { value: "200-499", label: "₹200 – ₹499", min: 200, max: 499 },
  { value: "500-999", label: "₹500 – ₹999", min: 500, max: 999 },
] as const;
export type PriceBandValue = (typeof PRICE_BANDS)[number]["value"];

export const RATING_FILTERS = [
  { value: "4", label: "4★ & up", min: 4 },
  { value: "3", label: "3★ & up", min: 3 },
] as const;

// Interface copy — blueprint §7.6, verbatim.
export const COPY = {
  emptyCartTitle: "Your cart is empty — let's fix that.",
  emptyCartCta: "Browse Under ₹999 deals",
  checkoutError:
    "We couldn't place your order. Check the highlighted fields and try again.",
  outOfStock: "Out of stock right now — check back soon.",
  freeDeliveryStrip: `Free delivery on orders over ₹${FREE_SHIPPING_THRESHOLD}`,
} as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
