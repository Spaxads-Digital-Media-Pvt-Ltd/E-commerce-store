import { describe, expect, it } from "vitest";
import { reconcileCart } from "@/store/cart-reconcile";
import type { CartItem, ProductDTO } from "@/types";

const cartItem = (over: Partial<CartItem> = {}): CartItem => ({
  productId: "p1",
  slug: "item-1",
  name: "Item 1",
  price: 499,
  image: "img",
  qty: 2,
  stock: 10,
  ...over,
});

const dto = (over: Partial<ProductDTO> = {}): ProductDTO => ({
  id: "p1",
  name: "Item 1",
  slug: "item-1",
  description: "",
  price: 499,
  mrp: 999,
  images: ["img"],
  categorySlug: "home-kitchen",
  categoryName: "Home & Kitchen",
  stock: 10,
  rating: 4.2,
  ratingCount: 10,
  isActive: true,
  isFeatured: false,
  ...over,
});

describe("reconcileCart", () => {
  it("keeps unchanged items as-is", () => {
    const { items, changes } = reconcileCart([cartItem()], [dto()]);
    expect(items).toHaveLength(1);
    expect(changes).toHaveLength(0);
  });

  it("removes items that vanished or were deactivated", () => {
    const { items, changes } = reconcileCart(
      [cartItem()],
      [dto({ isActive: false })]
    );
    expect(items).toHaveLength(0);
    expect(changes).toEqual([
      { type: "removed", name: "Item 1", reason: "unavailable" },
    ]);
  });

  it("removes items that went out of stock", () => {
    const { items, changes } = reconcileCart([cartItem()], [dto({ stock: 0 })]);
    expect(items).toHaveLength(0);
    expect(changes[0]).toMatchObject({ type: "removed", reason: "out-of-stock" });
  });

  it("adopts a changed price and reports it", () => {
    const { items, changes } = reconcileCart(
      [cartItem({ price: 499 })],
      [dto({ price: 449 })]
    );
    expect(items[0]!.price).toBe(449);
    expect(changes[0]).toMatchObject({ type: "price", from: 499, to: 449 });
  });

  it("clamps qty down to remaining stock", () => {
    const { items, changes } = reconcileCart(
      [cartItem({ qty: 5 })],
      [dto({ stock: 2 })]
    );
    expect(items[0]!.qty).toBe(2);
    expect(changes[0]).toMatchObject({ type: "qty-clamped", from: 5, to: 2 });
  });
});
