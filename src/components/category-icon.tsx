import {
  Baby,
  CookingPot,
  Dumbbell,
  Footprints,
  Gem,
  Lamp,
  PenTool,
  PersonStanding,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

// Explicit imports keep tree-shaking intact (importing lucide's full `icons`
// map would pull every icon into the bundle).
const ICONS: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  PersonStanding,
  Gem,
  Footprints,
  ShoppingBag,
  CookingPot,
  Lamp,
  Sparkles,
  Baby,
  PenTool,
  Dumbbell,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Tag;
  return <Icon aria-hidden className={className} />;
}

// Short display names for tight spaces (chips, icon grid, bottom sheets).
export const CATEGORY_SHORT_NAMES: Record<string, string> = {
  "mobile-electronics": "Mobile & Gadgets",
  "womens-fashion": "Women's Wear",
  "mens-fashion": "Men's Fashion",
  "jewellery-accessories": "Jewellery",
  footwear: "Footwear",
  "bags-wallets": "Bags & Wallets",
  "home-kitchen": "Kitchen",
  "home-decor": "Home Decor",
  "beauty-personal-care": "Beauty",
  "toys-baby-kids": "Toys & Kids",
  "stationery-office": "Stationery",
  "sports-fitness": "Sports & Fitness",
};

export function shortCategoryName(slug: string, fallback: string): string {
  return CATEGORY_SHORT_NAMES[slug] ?? fallback;
}
