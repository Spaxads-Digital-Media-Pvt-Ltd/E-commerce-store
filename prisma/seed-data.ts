// Seed catalog for the "Under ₹999" store — 12 categories, 72 products
// (6 per category), every price ≤ ₹999, exactly as specced in the blueprint
// (§5, §6.2). Product names are original; images are deterministic
// picsum.photos placeholders (§6.4) — swap for real photography at launch by
// editing `imagesFor()` in seed.ts or the URLs stored on each product.

export type SeedCategory = {
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  position: number;
};

export type SeedProduct = {
  name: string;
  slug: string;
  price: number; // ₹, integer
  mrp: number; // ₹, integer
  description: string;
  categorySlug: string;
  isFeatured?: boolean; // appears in the "Trending Under ₹999" rail
  stock?: number; // explicit override (0 demos the out-of-stock state)
  // Real product image URLs (first = main image). When set, these replace
  // the picsum placeholder for this product on the next `npm run db:seed`.
  // Local files work too: put them in public/images/products/ and use
  // "/images/products/<file>.jpg". Remote hosts must also be added to
  // images.remotePatterns in next.config.ts AND the CSP img-src there.
  images?: string[];
};

export const CATEGORIES: SeedCategory[] = [
  { name: "Mobile & Electronics Accessories", slug: "mobile-electronics", icon: "Smartphone", position: 1 },
  { name: "Women's Ethnic & Western Wear", slug: "womens-fashion", icon: "Shirt", position: 2 },
  { name: "Men's Fashion", slug: "mens-fashion", icon: "PersonStanding", position: 3 },
  { name: "Jewellery & Fashion Accessories", slug: "jewellery-accessories", icon: "Gem", position: 4 },
  { name: "Footwear", slug: "footwear", icon: "Footprints", position: 5 },
  { name: "Bags & Wallets", slug: "bags-wallets", icon: "ShoppingBag", position: 6 },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: "CookingPot", position: 7 },
  { name: "Home Decor & Furnishing", slug: "home-decor", icon: "Lamp", position: 8 },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: "Sparkles", position: 9 },
  { name: "Toys, Baby & Kids", slug: "toys-baby-kids", icon: "Baby", position: 10 },
  { name: "Stationery & Office", slug: "stationery-office", icon: "PenTool", position: 11 },
  { name: "Sports, Fitness & Outdoors", slug: "sports-fitness", icon: "Dumbbell", position: 12 },
];

export const PRODUCTS: SeedProduct[] = [
  // ── Mobile & Electronics Accessories ────────────────────────────────
  {
    name: "Wireless TWS Earbuds",
    slug: "wireless-tws-earbuds",
    price: 799,
    mrp: 1999,
    categorySlug: "mobile-electronics",
    isFeatured: true,
    description:
      "True wireless earbuds with touch controls, a pocketable charging case and up to 20 hours of combined playtime. Punchy bass for music, clear mic for calls.",
  },
  {
    name: "Wired Earphones with Mic",
    slug: "wired-earphones-with-mic",
    price: 299,
    mrp: 599,
    categorySlug: "mobile-electronics",
    description:
      "In-ear wired earphones with an inline mic and one-button control. Tangle-resistant cable and snug silicone tips in three sizes.",
  },
  {
    name: "Silicone Phone Back Cover",
    slug: "silicone-phone-back-cover",
    price: 199,
    mrp: 499,
    categorySlug: "mobile-electronics",
    description:
      "Soft-touch silicone cover with a raised lip that protects the camera and screen. Slim, grippy and easy to wipe clean.",
  },
  {
    name: "Tempered Glass Protector (2-pack)",
    slug: "tempered-glass-protector-2-pack",
    price: 149,
    mrp: 399,
    categorySlug: "mobile-electronics",
    description:
      "9H-hardness tempered glass with an oleophobic coating. Two protectors per pack, with alignment kit and dust stickers included.",
  },
  {
    name: "USB Type-C Cable (1m)",
    slug: "usb-type-c-cable-1m",
    price: 179,
    mrp: 399,
    categorySlug: "mobile-electronics",
    description:
      "1-metre Type-C cable with a braided jacket, fast-charging support and 480 Mbps data sync. Reinforced strain relief at both ends.",
  },
  {
    name: "20W Fast Wall Charger",
    slug: "20w-fast-wall-charger",
    price: 349,
    mrp: 799,
    categorySlug: "mobile-electronics",
    description:
      "Compact 20W USB-C PD wall adapter that tops up most phones to 50% in about 30 minutes. Built-in over-current and over-heat protection.",
  },

  // ── Women's Ethnic & Western Wear ───────────────────────────────────
  {
    name: "Rayon Printed Straight Kurti",
    slug: "rayon-printed-straight-kurti",
    price: 499,
    mrp: 1299,
    categorySlug: "womens-fashion",
    isFeatured: true,
    description:
      "Breathable rayon kurti in an all-over print with a clean straight cut and side slits. Machine washable and true to size.",
  },
  {
    name: "Cotton Ethnic Kurta",
    slug: "cotton-ethnic-kurta",
    price: 599,
    mrp: 1499,
    categorySlug: "womens-fashion",
    description:
      "Soft handloom-feel cotton kurta with three-quarter sleeves and wooden-look buttons. An easy fit made for all-day comfort.",
  },
  {
    name: "Georgette Printed Dupatta",
    slug: "georgette-printed-dupatta",
    price: 299,
    mrp: 699,
    categorySlug: "womens-fashion",
    description:
      "Lightweight 2.25 m georgette dupatta with a delicate print and finished edges. Pairs with kurtis and suits alike.",
  },
  {
    name: "Casual Crop Top",
    slug: "casual-crop-top",
    price: 399,
    mrp: 899,
    categorySlug: "womens-fashion",
    description:
      "Stretch-knit crop top with a flattering scoop neck. Layer it or wear it solo — it holds its shape wash after wash.",
  },
  {
    name: "Palazzo Pants",
    slug: "palazzo-pants",
    price: 449,
    mrp: 999,
    categorySlug: "womens-fashion",
    description:
      "Flowy wide-leg palazzos with an elasticated waist and side pockets. Wrinkle-friendly fabric that travels well.",
  },
  {
    name: "Printed Nightwear Set",
    slug: "printed-nightwear-set",
    price: 549,
    mrp: 1199,
    categorySlug: "womens-fashion",
    description:
      "Two-piece cotton-blend nightwear set — a relaxed tee and pyjamas in a playful print. Soft, breathable sleep comfort.",
  },

  // ── Men's Fashion ───────────────────────────────────────────────────
  {
    name: "Round Neck Cotton T-Shirt",
    slug: "round-neck-cotton-t-shirt",
    price: 349,
    mrp: 799,
    categorySlug: "mens-fashion",
    description:
      "180 GSM combed-cotton tee with a ribbed neck that doesn't sag. Pre-shrunk and bio-washed for softness.",
  },
  {
    name: "Checked Casual Shirt",
    slug: "checked-casual-shirt",
    price: 699,
    mrp: 1499,
    categorySlug: "mens-fashion",
    description:
      "Classic checks on a breathable cotton-blend fabric with a curved hem and chest pocket. Regular fit.",
  },
  {
    name: "Slim Fit Joggers",
    slug: "slim-fit-joggers",
    price: 599,
    mrp: 1299,
    categorySlug: "mens-fashion",
    description:
      "Tapered joggers with a drawstring waist, zip pockets and cuffed hems. Four-way stretch for the gym or the commute.",
  },
  {
    name: "Formal Leatherette Belt",
    slug: "formal-leatherette-belt",
    price: 299,
    mrp: 699,
    categorySlug: "mens-fashion",
    description:
      "Sleek leatherette belt with a brushed-metal buckle. 34 mm width — sized for formal trousers and jeans alike.",
  },
  {
    name: "Cotton Boxers (Pack of 3)",
    slug: "cotton-boxers-pack-of-3",
    price: 399,
    mrp: 899,
    categorySlug: "mens-fashion",
    description:
      "Three assorted-print cotton boxers with a covered elastic waistband. Breathable, lightweight and built to last.",
  },
  {
    name: "Analog Wrist Watch",
    slug: "analog-wrist-watch",
    price: 499,
    mrp: 1499,
    categorySlug: "mens-fashion",
    isFeatured: true,
    description:
      "Minimal analog watch with a stainless-steel-look case, quartz movement and leatherette strap. Splash resistant.",
  },

  // ── Jewellery & Fashion Accessories ─────────────────────────────────
  {
    name: "Oxidised Silver-Tone Jhumka Earrings",
    slug: "oxidised-silver-tone-jhumka-earrings",
    price: 249,
    mrp: 599,
    categorySlug: "jewellery-accessories",
    isFeatured: true,
    description:
      "Handcrafted-style oxidised jhumkas with intricate detailing and secure push backs. Featherlight for all-day wear.",
  },
  {
    name: "Kundan Choker Necklace Set",
    slug: "kundan-choker-necklace-set",
    price: 599,
    mrp: 1499,
    categorySlug: "jewellery-accessories",
    stock: 0, // demos the out-of-stock state
    description:
      "Regal kundan choker with matching earrings, pearl drops and an adjustable dori. Festive and wedding ready.",
  },
  {
    name: "Pearl Drop Earrings (3 pairs)",
    slug: "pearl-drop-earrings-3-pairs",
    price: 299,
    mrp: 699,
    categorySlug: "jewellery-accessories",
    description:
      "Set of three faux-pearl drop pairs in a gold-tone finish — everyday, office and evening styles in one box.",
  },
  {
    name: "Adjustable Charm Bracelet",
    slug: "adjustable-charm-bracelet",
    price: 199,
    mrp: 499,
    categorySlug: "jewellery-accessories",
    description:
      "Dainty gold-tone bracelet with a sliding closure that fits every wrist. Skin-friendly, tarnish-resistant plating.",
  },
  {
    name: "Statement Ring Set (6 pcs)",
    slug: "statement-ring-set-6-pcs",
    price: 249,
    mrp: 599,
    categorySlug: "jewellery-accessories",
    description:
      "Six mix-and-match statement rings — bands, stones and textures, with adjustable sizing on the larger designs.",
  },
  {
    name: "UV-Protected Sunglasses",
    slug: "uv-protected-sunglasses",
    price: 399,
    mrp: 999,
    categorySlug: "jewellery-accessories",
    description:
      "Unisex sunglasses with UV400 lenses and a lightweight matte frame. A soft protective pouch is included.",
  },

  // ── Footwear ────────────────────────────────────────────────────────
  {
    name: "Women's Flip Flops",
    slug: "womens-flip-flops",
    price: 299,
    mrp: 599,
    categorySlug: "footwear",
    description:
      "Cushioned soft-strap flip flops with an anti-skid sole. Everyday comfort that handles wet floors without fuss.",
  },
  {
    name: "Men's Sports Sandals",
    slug: "mens-sports-sandals",
    price: 499,
    mrp: 999,
    categorySlug: "footwear",
    description:
      "Rugged sports sandals with adjustable straps and a shock-absorbing EVA sole. Ready for treks and town alike.",
  },
  {
    name: "Women's Bellies (Ballet Flats)",
    slug: "womens-bellies-ballet-flats",
    price: 599,
    mrp: 1299,
    categorySlug: "footwear",
    description:
      "Classic round-toe bellies with a cushioned insole and flexible grip sole. Slip them on with ethnic or western wear.",
  },
  {
    name: "Kids' Velcro Sneakers",
    slug: "kids-velcro-sneakers",
    price: 549,
    mrp: 999,
    categorySlug: "footwear",
    description:
      "Lightweight sneakers with easy velcro straps kids can manage themselves. Reinforced toe cap for rough play.",
  },
  {
    name: "Men's Casual Loafers",
    slug: "mens-casual-loafers",
    price: 799,
    mrp: 1799,
    categorySlug: "footwear",
    stock: 0, // demos the out-of-stock state
    description:
      "Slip-on loafers in a suede-feel finish with stitched detailing and a memory-foam footbed for long days.",
  },
  {
    name: "Unisex Flip-Flop Slides",
    slug: "unisex-flip-flop-slides",
    price: 199,
    mrp: 399,
    categorySlug: "footwear",
    description:
      "Minimal one-band slides with a contoured footbed. Quick-dry, ultra-light and easy on the feet.",
  },

  // ── Bags & Wallets ──────────────────────────────────────────────────
  {
    name: "Women's PU Sling Bag",
    slug: "womens-pu-sling-bag",
    price: 499,
    mrp: 1199,
    categorySlug: "bags-wallets",
    isFeatured: true,
    description:
      "Compact PU sling with an adjustable strap, magnetic flap and two inner pockets. Fits phone, wallet and keys.",
  },
  {
    name: "Men's Bi-Fold Wallet",
    slug: "mens-bi-fold-wallet",
    price: 349,
    mrp: 799,
    categorySlug: "bags-wallets",
    description:
      "Slim bi-fold wallet with six card slots, two note compartments and a coin pocket in a textured PU finish.",
  },
  {
    name: "Printed Canvas Tote Bag",
    slug: "printed-canvas-tote-bag",
    price: 299,
    mrp: 599,
    categorySlug: "bags-wallets",
    description:
      "Roomy 14-inch canvas tote with a zip closure and inner pocket. Machine washable, with shoulder-friendly straps.",
  },
  {
    name: "Travel Pouch Organiser (3 pcs)",
    slug: "travel-pouch-organiser-3-pcs",
    price: 399,
    mrp: 899,
    categorySlug: "bags-wallets",
    description:
      "Three zip pouches in graded sizes for cables, cosmetics and documents, all with a water-resistant lining.",
  },
  {
    name: "Casual Backpack (15L)",
    slug: "casual-backpack-15l",
    price: 799,
    mrp: 1799,
    categorySlug: "bags-wallets",
    isFeatured: true,
    description:
      "15-litre daypack with padded straps, a laptop sleeve for up to 14 inches and a quick-access front pocket.",
  },
  {
    name: "Small Coin Purse",
    slug: "small-coin-purse",
    price: 99,
    mrp: 249,
    categorySlug: "bags-wallets",
    description:
      "Palm-size zip purse for coins, notes and cards. Sturdy fabric build with a handy key-ring loop.",
  },

  // ── Home & Kitchen ──────────────────────────────────────────────────
  {
    name: "12-in-1 Manual Vegetable Chopper",
    slug: "12-in-1-manual-vegetable-chopper",
    price: 399,
    mrp: 899,
    categorySlug: "home-kitchen",
    isFeatured: true,
    description:
      "Pull-cord chopper with stainless blades that dices onions in seconds — 12 attachments cover chopping, whisking and storing.",
  },
  {
    name: "Insulated Steel Water Bottle (1L)",
    slug: "insulated-steel-water-bottle-1l",
    price: 349,
    mrp: 799,
    categorySlug: "home-kitchen",
    description:
      "Double-wall vacuum bottle that keeps drinks cold for 18 hours or hot for 8. Leak-proof cap, 1-litre capacity.",
  },
  {
    name: "Non-Stick Dosa Tawa (28cm)",
    slug: "non-stick-dosa-tawa-28cm",
    price: 549,
    mrp: 1199,
    categorySlug: "home-kitchen",
    description:
      "28 cm aluminium dosa tawa with a 3-layer non-stick coating and heat-proof handle. Gas stove compatible.",
  },
  {
    name: "Airtight Storage Container Set",
    slug: "airtight-storage-container-set",
    price: 399,
    mrp: 899,
    categorySlug: "home-kitchen",
    description:
      "Stackable BPA-free containers with click-lock airtight lids. Keeps dals, spices and snacks fresh for weeks.",
  },
  {
    name: "Silicone Kitchen Utensil Set",
    slug: "silicone-kitchen-utensil-set",
    price: 449,
    mrp: 999,
    categorySlug: "home-kitchen",
    description:
      "Heat-resistant silicone spatulas, ladle and brush that won't scratch non-stick cookware. Easy-clean and hygienic.",
  },
  {
    name: "Rechargeable Electric Gas Lighter",
    slug: "rechargeable-electric-gas-lighter",
    price: 249,
    mrp: 599,
    categorySlug: "home-kitchen",
    description:
      "Flameless USB-rechargeable arc lighter with a safety switch. One charge lights the stove for weeks.",
  },

  // ── Home Decor & Furnishing ─────────────────────────────────────────
  {
    name: "Embroidered Cushion Covers (Set of 2)",
    slug: "embroidered-cushion-covers-set-of-2",
    price: 349,
    mrp: 799,
    categorySlug: "home-decor",
    description:
      "Two 16×16 inch cushion covers with tonal embroidery and hidden zips. An instant sofa refresh.",
  },
  {
    name: "Wooden Wall Key Holder",
    slug: "wooden-wall-key-holder",
    price: 299,
    mrp: 699,
    categorySlug: "home-decor",
    description:
      "Sheesham-finish key holder with six hooks and a floating shelf lip for mail. Mounting hardware included.",
  },
  {
    name: "LED Fairy String Lights (10m)",
    slug: "led-fairy-string-lights-10m",
    price: 299,
    mrp: 699,
    categorySlug: "home-decor",
    isFeatured: true,
    description:
      "10-metre warm-white fairy lights with 8 glow modes. Perfect for balconies, headboards and festive corners.",
  },
  {
    name: "Photo Frame Collage Set",
    slug: "photo-frame-collage-set",
    price: 399,
    mrp: 899,
    categorySlug: "home-decor",
    description:
      "Six-frame collage set in mixed sizes with a hanging template — a gallery wall in under ten minutes.",
  },
  {
    name: "Cotton Door Curtain (7ft)",
    slug: "cotton-door-curtain-7ft",
    price: 499,
    mrp: 999,
    categorySlug: "home-decor",
    description:
      "7-foot cotton door curtain with a tab top and subtle weave. Filters harsh light while keeping air moving.",
  },
  {
    name: "Decorative Wall Clock",
    slug: "decorative-wall-clock",
    price: 599,
    mrp: 1299,
    categorySlug: "home-decor",
    description:
      "30 cm silent-sweep wall clock with bold numerals and a matte frame. No ticking, easy reading from across the room.",
  },

  // ── Beauty & Personal Care ──────────────────────────────────────────
  {
    name: "Matte Liquid Lipstick",
    slug: "matte-liquid-lipstick",
    price: 249,
    mrp: 599,
    categorySlug: "beauty-personal-care",
    isFeatured: true,
    description:
      "Weightless matte liquid lipstick with one-swipe payoff that stays put for 8 hours. Enriched with vitamin E.",
  },
  {
    name: "Aloe Vera Gel (300ml)",
    slug: "aloe-vera-gel-300ml",
    price: 199,
    mrp: 399,
    categorySlug: "beauty-personal-care",
    description:
      "Multi-use 300 ml aloe gel for skin and hair — soothes, hydrates and calms sun-stressed skin. 98% pure aloe.",
  },
  {
    name: "Oil-Control Compact Powder",
    slug: "oil-control-compact-powder",
    price: 299,
    mrp: 699,
    categorySlug: "beauty-personal-care",
    description:
      "Lightweight compact that blurs shine and sets makeup without caking. With SPF-15 and a mirror-puff case.",
  },
  {
    name: "Makeup Brush Set (7 pcs)",
    slug: "makeup-brush-set-7-pcs",
    price: 399,
    mrp: 899,
    categorySlug: "beauty-personal-care",
    description:
      "Seven soft synthetic brushes covering base, blush and full eye looks. Cruelty-free bristles, wooden handles.",
  },
  {
    name: "Herbal Face Wash (150ml)",
    slug: "herbal-face-wash-150ml",
    price: 179,
    mrp: 349,
    categorySlug: "beauty-personal-care",
    description:
      "Gentle 150 ml face wash with neem and tulsi extracts. Cleans deep without stripping moisture. Soap-free formula.",
  },
  {
    name: "Mini Hair Straightening Brush",
    slug: "mini-hair-straightening-brush",
    price: 599,
    mrp: 1299,
    categorySlug: "beauty-personal-care",
    description:
      "Compact heated brush that straightens and adds shine in one pass. Ceramic coating with a 30-second heat-up.",
  },

  // ── Toys, Baby & Kids ───────────────────────────────────────────────
  {
    name: "Building Blocks Set (100 pcs)",
    slug: "building-blocks-set-100-pcs",
    price: 499,
    mrp: 999,
    categorySlug: "toys-baby-kids",
    isFeatured: true,
    description:
      "100 chunky interlocking blocks in bright colours. Builds fine motor skills — and towers, forts and rockets. Ages 3+.",
  },
  {
    name: "Soft Plush Teddy Bear (30cm)",
    slug: "soft-plush-teddy-bear-30cm",
    price: 399,
    mrp: 799,
    categorySlug: "toys-baby-kids",
    description:
      "Huggable 30 cm teddy in ultra-soft plush with embroidered eyes — safe for even the youngest cuddlers.",
  },
  {
    name: "Remote Control Mini Car",
    slug: "remote-control-mini-car",
    price: 599,
    mrp: 1299,
    categorySlug: "toys-baby-kids",
    description:
      "Zippy rechargeable RC car with a full-function remote and glowing headlights. About 20 minutes of drive per charge.",
  },
  {
    name: "Baby Bib & Burp Cloth Set",
    slug: "baby-bib-burp-cloth-set",
    price: 299,
    mrp: 599,
    categorySlug: "toys-baby-kids",
    description:
      "Absorbent cotton bib and burp cloth set with snap closures. Gentle on skin and survives endless washes.",
  },
  {
    name: "Colouring Book & Crayons Combo",
    slug: "colouring-book-crayons-combo",
    price: 199,
    mrp: 399,
    categorySlug: "toys-baby-kids",
    description:
      "64-page colouring book with a 12-shade crayon pack. Screen-free fun for ages 3–8.",
  },
  {
    name: "Kids' Cartoon Water Bottle",
    slug: "kids-cartoon-water-bottle",
    price: 249,
    mrp: 499,
    categorySlug: "toys-baby-kids",
    description:
      "450 ml spill-proof sipper with a pop-up straw and carry strap. BPA-free and school-bag friendly.",
  },

  // ── Stationery & Office ─────────────────────────────────────────────
  {
    name: "Gel Pens Set (10 pcs)",
    slug: "gel-pens-set-10-pcs",
    price: 149,
    mrp: 349,
    categorySlug: "stationery-office",
    description:
      "Ten smooth-flow 0.7 mm gel pens in assorted inks with comfort grips. Quick-dry — exam and doodle approved.",
  },
  {
    name: "Spiral Notebook Combo (3 pcs)",
    slug: "spiral-notebook-combo-3-pcs",
    price: 199,
    mrp: 399,
    categorySlug: "stationery-office",
    description:
      "Three A5 spiral notebooks with 160 ruled pages each and laminated covers that survive backpacks.",
  },
  {
    name: "Multi-Compartment Desk Organiser",
    slug: "multi-compartment-desk-organiser",
    price: 349,
    mrp: 799,
    categorySlug: "stationery-office",
    description:
      "Keeps pens, notes, phone and clips in seven tidy compartments. Sturdy build with a small pull-out drawer.",
  },
  {
    name: "Sticky Notes & Stickers Combo",
    slug: "sticky-notes-stickers-combo",
    price: 129,
    mrp: 299,
    categorySlug: "stationery-office",
    description:
      "Bright sticky notes in four sizes plus planner stickers and page flags — over 500 pieces in total.",
  },
  {
    name: "Wireless Optical Mouse",
    slug: "wireless-optical-mouse",
    price: 399,
    mrp: 899,
    categorySlug: "stationery-office",
    isFeatured: true,
    description:
      "2.4 GHz wireless mouse with silent clicks, adjustable DPI and 12-month battery life. Nano receiver included.",
  },
  {
    name: "12-Digit Desktop Calculator",
    slug: "12-digit-desktop-calculator",
    price: 299,
    mrp: 599,
    categorySlug: "stationery-office",
    description:
      "Large-display 12-digit calculator with dual solar-battery power and big, responsive keys.",
  },

  // ── Sports, Fitness & Outdoors ──────────────────────────────────────
  {
    name: "Anti-Slip Yoga Mat (6mm)",
    slug: "anti-slip-yoga-mat-6mm",
    price: 499,
    mrp: 999,
    categorySlug: "sports-fitness",
    isFeatured: true,
    description:
      "6 mm NBR yoga mat with a textured anti-slip surface and carry strap. Cushions knees and spine on hard floors.",
  },
  {
    name: "Resistance Band Set (5 pcs)",
    slug: "resistance-band-set-5-pcs",
    price: 349,
    mrp: 799,
    categorySlug: "sports-fitness",
    description:
      "Five colour-coded loop bands from light to extra-heavy, with a carry pouch and exercise guide.",
  },
  {
    name: "Adjustable Skipping Rope",
    slug: "adjustable-skipping-rope",
    price: 149,
    mrp: 349,
    categorySlug: "sports-fitness",
    description:
      "Tangle-free skipping rope with ball-bearing handles and an adjustable 9-foot cable. Comfortable foam grips.",
  },
  {
    name: "Sports Sipper Water Bottle (1L)",
    slug: "sports-sipper-water-bottle-1l",
    price: 249,
    mrp: 549,
    categorySlug: "sports-fitness",
    description:
      "1-litre gym sipper with a flip-top lock, time markings and carry loop. Sweat-proof matte body.",
  },
  {
    name: "Hand Grip Strengthener (Pair)",
    slug: "hand-grip-strengthener-pair",
    price: 199,
    mrp: 449,
    categorySlug: "sports-fitness",
    description:
      "Pair of adjustable 10–40 kg hand grips with non-slip handles. Builds forearm and grip strength anywhere.",
  },
  {
    name: "Adjustable Sports Cap",
    slug: "adjustable-sports-cap",
    price: 249,
    mrp: 549,
    categorySlug: "sports-fitness",
    description:
      "Quick-dry sports cap with a curved brim, breathable eyelets and adjustable strap. One size fits most.",
  },
];
