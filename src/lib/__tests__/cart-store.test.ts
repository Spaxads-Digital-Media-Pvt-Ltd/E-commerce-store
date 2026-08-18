// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "@/lib/cart-store";
import { MAX_QTY_PER_ITEM } from "@/lib/constants";

const product = (over: Partial<Parameters<typeof addToCart>[0]> = {}) => ({
  productId: "p1",
  slug: "wireless-tws-earbuds",
  name: "Wireless TWS Earbuds",
  price: 799,
  image: "img",
  stock: 5,
  ...over,
});

function addToCart(
  item: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  },
  qty?: number
) {
  useCart.getState().addItem(item, qty);
}

beforeEach(() => {
  useCart.setState({ items: [] });
});

describe("cart store", () => {
  it("adds an item", () => {
    addToCart(product());
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0]!.qty).toBe(1);
  });

  it("increments qty instead of duplicating the line (§9)", () => {
    addToCart(product());
    addToCart(product());
    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]!.qty).toBe(2);
  });

  it("caps qty at available stock", () => {
    addToCart(product({ stock: 3 }), 10);
    expect(useCart.getState().items[0]!.qty).toBe(3);
  });

  it(`caps qty at the ${MAX_QTY_PER_ITEM}-per-item limit even with plenty of stock`, () => {
    addToCart(product({ stock: 50 }), 25);
    expect(useCart.getState().items[0]!.qty).toBe(MAX_QTY_PER_ITEM);
  });

  it("clamps updateQty to a minimum of 1", () => {
    addToCart(product());
    useCart.getState().updateQty("p1", 0);
    expect(useCart.getState().items[0]!.qty).toBe(1);
  });

  it("removes items and clears the cart", () => {
    addToCart(product());
    addToCart(product({ productId: "p2", slug: "other" }));
    useCart.getState().removeItem("p1");
    expect(useCart.getState().items.map((i) => i.productId)).toEqual(["p2"]);
    useCart.getState().clear();
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("computes subtotal and count across lines", () => {
    addToCart(product(), 2); // 1598
    addToCart(product({ productId: "p2", slug: "s2", price: 199 }), 1); // 199
    expect(useCart.getState().subtotal()).toBe(799 * 2 + 199);
    expect(useCart.getState().count()).toBe(3);
  });
});
