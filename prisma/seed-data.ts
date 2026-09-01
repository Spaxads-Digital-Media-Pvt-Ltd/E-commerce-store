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
  // Selectable sizes (garments/footwear). Omit for one-size products.
  sizes?: string[];
  // Spec classification shown on the product page (Fabric, Fit, Pattern, …).
  attributes?: Record<string, string>;
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
      "True wireless earbuds tuned for punchy, bass-forward sound, with responsive touch controls and a built-in mic that keeps calls clear. The pocketable charging case delivers up to 20 hours of combined playtime and tops the buds up on the go, while a snug in-ear fit helps block out background noise. Bluetooth pairing is quick and stays stable across the room.",
    attributes: {
      Connectivity: "Bluetooth 5.x",
      Playtime: "Up to 20 hrs (with case)",
      Driver: "10 mm Dynamic",
      Microphone: "Built-in",
      Charging: "USB Type-C",
      Controls: "Touch",
      Warranty: "6 Months",
    },
  },
  {
    name: "Wired Earphones with Mic",
    slug: "wired-earphones-with-mic",
    price: 299,
    mrp: 599,
    categorySlug: "mobile-electronics",
    description:
      "In-ear wired earphones that keep things simple and reliable — plug into any 3.5 mm jack for clear, balanced sound with no charging required. The inline one-button control lets you play, pause and answer calls without reaching for your phone, and three sizes of soft silicone tips help you find a secure, comfortable seal. The tangle-resistant cable stands up to daily use.",
    attributes: {
      Connector: "3.5 mm Jack",
      Driver: "10 mm",
      Microphone: "Inline, 1-Button Control",
      "Cable Length": "1.2 m",
      "Ear Tips": "3 Sizes Included",
    },
  },
  {
    name: "Silicone Phone Back Cover",
    slug: "silicone-phone-back-cover",
    price: 199,
    mrp: 499,
    categorySlug: "mobile-electronics",
    description:
      "A slim soft-touch silicone case that hugs your phone without adding bulk, with a grippy finish that resists slips and smudges. Raised lips around the camera and screen keep both lifted off flat surfaces, and precise cutouts leave every port and button easy to reach. Wipes clean in seconds. Please check that it matches your phone model before ordering.",
    attributes: {
      Material: "Soft Silicone",
      Protection: "Raised Camera & Screen Lip",
      Finish: "Matte, Anti-Slip",
      Compatibility: "Model-specific — check before ordering",
      Care: "Wipe clean",
    },
  },
  {
    name: "Tempered Glass Protector (2-pack)",
    slug: "tempered-glass-protector-2-pack",
    price: 149,
    mrp: 399,
    categorySlug: "mobile-electronics",
    description:
      "A two-pack of 9H-hardness tempered glass protectors that shield your screen from scratches and absorb everyday knocks. The oleophobic coating repels fingerprints and keeps swipes smooth, while high transparency preserves touch response and display clarity. Each pack includes an alignment kit, cleaning wipes and dust-removal stickers for a clean, bubble-free application.",
    attributes: {
      Hardness: "9H",
      Coating: "Oleophobic (Anti-Fingerprint)",
      Pack: "2 Protectors",
      Includes: "Alignment kit, wipes, dust stickers",
      Transparency: "HD Clear",
    },
  },
  {
    name: "USB Type-C Cable (1m)",
    slug: "usb-type-c-cable-1m",
    price: 179,
    mrp: 399,
    categorySlug: "mobile-electronics",
    description:
      "A 1-metre USB-A to Type-C cable built to last, wrapped in a braided nylon jacket that resists fraying and tangles. It supports fast charging for phones and tablets and syncs data at up to 480 Mbps, with reinforced strain relief at both ends where cables usually give out first. A dependable everyday cable for charging and transfers.",
    attributes: {
      Length: "1 m",
      Jacket: "Braided Nylon",
      Charging: "Fast Charge Supported",
      "Data Speed": "Up to 480 Mbps",
      Connector: "USB-A to Type-C",
    },
  },
  {
    name: "20W Fast Wall Charger",
    slug: "20w-fast-wall-charger",
    price: 349,
    mrp: 799,
    categorySlug: "mobile-electronics",
    description:
      "A compact 20W USB-C Power Delivery wall charger that tops most phones up to around 50% in about 30 minutes, so a short plug-in gets you through the day. The small footprint travels easily and won't block the next socket, while built-in protection guards against over-current, over-voltage and overheating. Compatible with PD and most fast-charge phones.",
    attributes: {
      Output: "20W USB-C PD",
      "Charge Speed": "~50% in 30 min",
      Safety: "Over-current / over-heat protection",
      Compatibility: "PD / fast-charge phones",
      Port: "USB-C",
    },
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
      "A breathable rayon straight kurti in a fresh all-over print, cut clean and straight with side slits for easy movement. Knee-length with three-quarter sleeves and a round neck — pairs just as well with leggings as with jeans. Colour-fast, machine washable and true to size.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Rayon",
      Fit: "Straight",
      Length: "Knee Length",
      Sleeve: "Three-Quarter Sleeve",
      Neck: "Round Neck",
      Pattern: "Printed",
      Occasion: "Daily / Casual Wear",
      "Wash Care": "Machine wash cold, do not bleach",
    },
  },
  {
    name: "Cotton Ethnic Kurta",
    slug: "cotton-ethnic-kurta",
    price: 599,
    mrp: 1499,
    categorySlug: "womens-fashion",
    description:
      "A soft, handloom-feel cotton kurta with a relaxed regular fit, three-quarter sleeves and wooden-look buttons at a mandarin neck. Calf-length and airy enough for all-day wear, dressed up for festive days or down for everyday. Gets softer with every wash.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Cotton",
      Fit: "Regular",
      Length: "Calf Length",
      Sleeve: "Three-Quarter Sleeve",
      Neck: "Mandarin / Band Collar",
      Pattern: "Solid",
      Occasion: "Festive / Daily Wear",
      "Wash Care": "Gentle machine wash",
    },
  },
  {
    name: "Georgette Printed Dupatta",
    slug: "georgette-printed-dupatta",
    price: 299,
    mrp: 699,
    categorySlug: "womens-fashion",
    description:
      "A lightweight 2.25-metre georgette dupatta with a delicate print and neatly finished edges. Drapes softly and adds a finishing layer to kurtis and suits alike. One free size that suits everyone.",
    attributes: {
      Fabric: "Georgette",
      Size: "Free Size",
      Length: "2.25 m",
      Width: "90 cm",
      Pattern: "Printed",
      Occasion: "Ethnic / Festive",
      "Wash Care": "Hand wash separately",
    },
  },
  {
    name: "Casual Crop Top",
    slug: "casual-crop-top",
    price: 399,
    mrp: 899,
    categorySlug: "womens-fashion",
    description:
      "A stretch-knit crop top with a flattering scoop neck and short sleeves, in a soft cotton blend that moves with you. Layer it over a dress or wear it solo with jeans — it keeps its shape wash after wash.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Cotton-Blend Knit",
      Fit: "Slim",
      Length: "Cropped",
      Sleeve: "Short Sleeve",
      Neck: "Scoop Neck",
      Pattern: "Solid",
      Occasion: "Casual Wear",
      "Wash Care": "Machine wash cold",
    },
  },
  {
    name: "Palazzo Pants",
    slug: "palazzo-pants",
    price: 449,
    mrp: 999,
    categorySlug: "womens-fashion",
    description:
      "Flowy wide-leg palazzos in a soft, wrinkle-friendly rayon, with a comfortable elasticated waist and handy side pockets. Full-length and breezy — dress them up with a kurti or down with a tee. Fabric that travels well and needs little ironing.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Rayon",
      Fit: "Wide Leg",
      Length: "Full Length",
      Waist: "Elasticated",
      Pattern: "Solid",
      Occasion: "Ethnic / Casual Wear",
      "Wash Care": "Machine wash cold",
    },
  },
  {
    name: "Printed Nightwear Set",
    slug: "printed-nightwear-set",
    price: 549,
    mrp: 1199,
    categorySlug: "womens-fashion",
    description:
      "A two-piece cotton-blend nightwear set — a relaxed tee paired with full-length pyjamas in a playful print. Soft, breathable and roomy for genuinely comfortable sleep or lazy days in. An easy relaxed fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Cotton Blend",
      Fit: "Relaxed",
      Pieces: "Top + Pyjama",
      Sleeve: "Short Sleeve",
      Pattern: "Printed",
      Occasion: "Sleepwear / Loungewear",
      "Wash Care": "Machine wash cold",
    },
  },

  // ── Men's Fashion ───────────────────────────────────────────────────
  {
    name: "Round Neck Cotton T-Shirt",
    slug: "round-neck-cotton-t-shirt",
    price: 349,
    mrp: 799,
    categorySlug: "mens-fashion",
    description:
      "A 180 GSM combed-cotton tee with a regular fit and a ribbed round neck that keeps its shape and doesn't sag. Pre-shrunk and bio-washed so it stays soft and true to size wash after wash. An everyday essential.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "100% Combed Cotton (180 GSM)",
      Fit: "Regular",
      Sleeve: "Half Sleeve",
      Neck: "Round Neck",
      Pattern: "Solid",
      Occasion: "Casual Wear",
      "Wash Care": "Machine wash cold, tumble dry low",
    },
  },
  {
    name: "Checked Casual Shirt",
    slug: "checked-casual-shirt",
    price: 699,
    mrp: 1499,
    categorySlug: "mens-fashion",
    description:
      "A classic checked shirt in a breathable cotton-blend, cut in an easy regular fit with a spread collar, full sleeves, a curved hem and a chest pocket. Smart enough for work, relaxed enough for the weekend.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Cotton Blend",
      Fit: "Regular",
      Sleeve: "Full Sleeve",
      Collar: "Spread Collar",
      Pattern: "Checked",
      Occasion: "Casual / Semi-Formal",
      "Wash Care": "Machine wash cold",
    },
  },
  {
    name: "Slim Fit Joggers",
    slug: "slim-fit-joggers",
    price: 599,
    mrp: 1299,
    categorySlug: "mens-fashion",
    description:
      "Tapered slim-fit joggers in a cotton-poly blend with four-way stretch, a drawstring elastic waist, secure zip pockets and cuffed hems. Equally at home at the gym or on the commute.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "Cotton-Polyester (4-Way Stretch)",
      Fit: "Slim / Tapered",
      Waist: "Drawstring Elastic",
      Pockets: "Zip Pockets",
      Occasion: "Active / Casual Wear",
      "Wash Care": "Machine wash cold",
    },
  },
  {
    name: "Formal Leatherette Belt",
    slug: "formal-leatherette-belt",
    price: 299,
    mrp: 699,
    categorySlug: "mens-fashion",
    description:
      "A sleek 34 mm leatherette belt with a brushed-metal pin buckle, smart enough for formal trousers and rugged enough for jeans. One adjustable size fits waists from about 30 to 42 inches — just trim to length if needed.",
    attributes: {
      Material: "Leatherette (PU)",
      Size: "Adjustable (fits 30–42 in)",
      Width: "34 mm",
      Buckle: "Brushed-Metal Pin Buckle",
      Occasion: "Formal / Casual",
      Care: "Wipe clean with a dry cloth",
    },
  },
  {
    name: "Cotton Boxers (Pack of 3)",
    slug: "cotton-boxers-pack-of-3",
    price: 399,
    mrp: 899,
    categorySlug: "mens-fashion",
    description:
      "A pack of three pure-cotton boxers in assorted prints, with a soft covered elastic waistband that stays put without digging in. Breathable, lightweight and built to last through daily wear and washing.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    attributes: {
      Fabric: "100% Cotton",
      Fit: "Regular",
      Waistband: "Covered Elastic",
      Pattern: "Assorted Prints",
      Pack: "3 Pieces",
      Occasion: "Innerwear / Loungewear",
      "Wash Care": "Machine wash cold",
    },
  },
  {
    name: "Analog Wrist Watch",
    slug: "analog-wrist-watch",
    price: 499,
    mrp: 1499,
    categorySlug: "mens-fashion",
    isFeatured: true,
    description:
      "A minimal analog watch with a clean round dial, a stainless-steel-look case and a comfortable leatherette strap. Reliable quartz movement, splash resistant for everyday wear, and backed by a 6-month warranty.",
    attributes: {
      Movement: "Quartz (Analog)",
      "Case Finish": "Stainless-Steel-Look",
      Dial: "Round",
      Strap: "Leatherette",
      "Water Resistance": "Splash Resistant",
      Warranty: "6 Months",
      Care: "Keep away from water; wipe dry",
    },
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
      "Handcrafted-style oxidised jhumka earrings with intricate antique detailing and a rich silver-tone finish that pairs beautifully with kurtis, sarees and Indo-western looks. They're surprisingly featherlight, so you can wear them from a morning function through to the evening, and secure push backs keep them comfortably in place all day.",
    attributes: {
      Material: "Alloy",
      Plating: "Oxidised Silver-Tone",
      Closure: "Push-Back",
      Style: "Jhumka",
      Occasion: "Ethnic / Festive",
      Care: "Keep dry; avoid perfume & water",
    },
  },
  {
    name: "Kundan Choker Necklace Set",
    slug: "kundan-choker-necklace-set",
    price: 599,
    mrp: 1499,
    categorySlug: "jewellery-accessories",
    stock: 0, // demos the out-of-stock state
    description:
      "A regal kundan choker necklace set that brings instant occasion-wear glamour — a statement choker studded with kundan stones, finished with delicate pearl drops and paired with matching earrings. The adjustable back dori means one size flatters every neckline, making it a go-to for weddings, receptions and festive evenings.",
    attributes: {
      Material: "Alloy with Kundan Stones & Pearls",
      Plating: "Gold-Tone",
      Includes: "Necklace + Earrings",
      Closure: "Adjustable Dori",
      Occasion: "Wedding / Festive",
      Care: "Store in a pouch; keep dry",
    },
  },
  {
    name: "Pearl Drop Earrings (3 pairs)",
    slug: "pearl-drop-earrings-3-pairs",
    price: 299,
    mrp: 699,
    categorySlug: "jewellery-accessories",
    description:
      "A set of three faux-pearl drop earring pairs in a warm gold-tone finish — one easy box that covers everyday, office and evening looks. Lightweight and comfortable with secure push backs, they add a soft, elegant finish to both western and ethnic outfits. Great value and a ready-made little gift.",
    attributes: {
      Material: "Faux Pearl & Alloy",
      Plating: "Gold-Tone",
      Pack: "3 Pairs",
      Closure: "Push-Back",
      Occasion: "Daily / Office / Evening",
      Care: "Avoid water & perfume",
    },
  },
  {
    name: "Adjustable Charm Bracelet",
    slug: "adjustable-charm-bracelet",
    price: 199,
    mrp: 499,
    categorySlug: "jewellery-accessories",
    description:
      "A dainty gold-tone charm bracelet with a smart sliding closure that adjusts to fit any wrist — no clasps to fiddle with. The skin-friendly, tarnish-resistant plating keeps its shine with everyday wear, making it an easy layering piece or a thoughtful little gift.",
    attributes: {
      Material: "Alloy",
      Plating: "Gold-Tone (Tarnish-Resistant)",
      Closure: "Adjustable Slider",
      Occasion: "Casual / Daily Wear",
      Care: "Keep away from water & perfume",
    },
  },
  {
    name: "Statement Ring Set (6 pcs)",
    slug: "statement-ring-set-6-pcs",
    price: 249,
    mrp: 599,
    categorySlug: "jewellery-accessories",
    description:
      "A six-piece statement ring set that mixes slim bands, stones and textured designs so you can stack and style them your way. The larger designs are adjustable for an easy fit across fingers, and the set works as well for a party look as it does for everyday flair — six pieces at one friendly price.",
    attributes: {
      Material: "Alloy",
      Pack: "6 Rings",
      Sizing: "Adjustable (larger pieces)",
      Occasion: "Party / Casual",
      Care: "Wipe clean; keep dry",
    },
  },
  {
    name: "UV-Protected Sunglasses",
    slug: "uv-protected-sunglasses",
    price: 399,
    mrp: 999,
    categorySlug: "jewellery-accessories",
    description:
      "Unisex sunglasses with UV400 lenses that block 100% of harmful UVA and UVB rays, cutting glare on bright days, drives and travel. The lightweight matte frame sits comfortably for hours and suits most face shapes, and a soft protective pouch is included to keep the lenses scratch-free between wears.",
    attributes: {
      "Lens Protection": "UV400 (100% UVA/UVB)",
      Frame: "Lightweight Matte",
      Gender: "Unisex",
      Includes: "Protective Pouch",
      Occasion: "Outdoor / Travel / Driving",
    },
  },

  // ── Footwear ────────────────────────────────────────────────────────
  {
    name: "Women's Flip Flops",
    slug: "womens-flip-flops",
    price: 299,
    mrp: 599,
    categorySlug: "footwear",
    description:
      "Cushioned flip flops with soft, comfortable straps and an anti-skid sole that grips wet floors without fuss. Lightweight everyday comfort for indoors and quick trips out. Available in whole UK sizes.",
    sizes: ["4", "5", "6", "7", "8"],
    attributes: {
      Material: "EVA / Rubber",
      Sole: "Anti-Skid",
      Closure: "Slip-On",
      Type: "Flip Flops",
      "Size Type": "UK / India (Women's)",
      Occasion: "Casual / Daily Wear",
      Care: "Wipe clean",
    },
  },
  {
    name: "Men's Sports Sandals",
    slug: "mens-sports-sandals",
    price: 499,
    mrp: 999,
    categorySlug: "footwear",
    description:
      "Rugged sports sandals with three adjustable velcro straps for a locked-in fit and a shock-absorbing EVA sole that cushions every step. Grippy and hard-wearing — ready for treks, travel and town alike.",
    sizes: ["6", "7", "8", "9", "10"],
    attributes: {
      Material: "Synthetic",
      Sole: "Shock-Absorbing EVA",
      Closure: "Adjustable Velcro Straps",
      Type: "Sports Sandals",
      "Size Type": "UK / India (Men's)",
      Occasion: "Outdoor / Casual",
      Care: "Wipe clean",
    },
  },
  {
    name: "Women's Bellies (Ballet Flats)",
    slug: "womens-bellies-ballet-flats",
    price: 599,
    mrp: 1299,
    categorySlug: "footwear",
    description:
      "Classic round-toe bellies with a cushioned insole and a flexible anti-slip sole that keeps you comfortable all day. An easy slip-on that finishes both ethnic and western looks.",
    sizes: ["4", "5", "6", "7", "8"],
    attributes: {
      Material: "PU / Synthetic",
      Sole: "TPR Anti-Slip",
      Closure: "Slip-On",
      "Toe Shape": "Round Toe",
      "Size Type": "UK / India (Women's)",
      Occasion: "Ethnic / Casual",
      Care: "Wipe clean",
    },
  },
  {
    name: "Kids' Velcro Sneakers",
    slug: "kids-velcro-sneakers",
    price: 549,
    mrp: 999,
    categorySlug: "footwear",
    description:
      "Lightweight kids' sneakers with easy velcro straps little ones can fasten themselves, a cushioned EVA sole and a reinforced toe cap that stands up to rough play. Great for school and playtime. Sizes in UK kids'.",
    sizes: ["8", "9", "10", "11", "12", "13"],
    attributes: {
      Material: "Mesh / Synthetic",
      Sole: "Cushioned EVA",
      Closure: "Velcro",
      "Size Type": "UK Kids'",
      "Age Group": "3–8 years",
      Occasion: "Casual / School",
      Care: "Wipe clean",
    },
  },
  {
    name: "Men's Casual Loafers",
    slug: "mens-casual-loafers",
    price: 799,
    mrp: 1799,
    categorySlug: "footwear",
    stock: 0, // demos the out-of-stock state
    description:
      "Slip-on loafers in a soft suede-feel finish with neat stitched detailing and a memory-foam footbed that stays comfortable through long days. Smart-casual shoes that dress up jeans or chinos with ease.",
    sizes: ["6", "7", "8", "9", "10"],
    attributes: {
      Material: "Suede-Feel Synthetic",
      Sole: "TPR",
      Footbed: "Memory Foam",
      Closure: "Slip-On",
      "Size Type": "UK / India (Men's)",
      Occasion: "Casual / Semi-Formal",
      Care: "Wipe clean with a soft brush",
    },
  },
  {
    name: "Unisex Flip-Flop Slides",
    slug: "unisex-flip-flop-slides",
    price: 199,
    mrp: 399,
    categorySlug: "footwear",
    description:
      "Minimal single-band slides with a contoured footbed that supports the arch and an ultra-light, quick-dry build. Easy to slip on for the beach, the pool or around the house. Unisex whole sizes.",
    sizes: ["6", "7", "8", "9", "10"],
    attributes: {
      Material: "EVA",
      Sole: "Contoured Footbed",
      Closure: "Single-Band Slip-On",
      Type: "Slides",
      "Size Type": "UK / India (Unisex)",
      Occasion: "Casual / Beach",
      Care: "Quick-dry; wipe clean",
    },
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
      "A compact PU sling bag that carries your essentials hands-free — phone, wallet, keys and a few extras — without weighing you down. The adjustable strap sets your ideal length, a secure magnetic flap keeps things closed, and two inner pockets help you stay organised. An easy everyday bag that dresses up or down.",
    attributes: {
      Material: "PU (Faux Leather)",
      Closure: "Magnetic Flap",
      Strap: "Adjustable",
      Compartments: "Main + 2 Inner Pockets",
      Occasion: "Casual / Daily",
      Care: "Wipe clean",
    },
  },
  {
    name: "Men's Bi-Fold Wallet",
    slug: "mens-bi-fold-wallet",
    price: 349,
    mrp: 799,
    categorySlug: "bags-wallets",
    description:
      "A slim bi-fold wallet in a smart textured PU finish that stays comfortable in your pocket. It's organised without being bulky — six card slots, two note compartments and a coin pocket keep cards, cash and change tidy and easy to reach. A practical everyday carry that also makes a neat gift.",
    attributes: {
      Material: "Textured PU (Faux Leather)",
      Type: "Bi-Fold",
      "Card Slots": "6",
      Compartments: "2 Note + 1 Coin Pocket",
      Occasion: "Everyday / Formal",
      Care: "Wipe clean",
    },
  },
  {
    name: "Printed Canvas Tote Bag",
    slug: "printed-canvas-tote-bag",
    price: 299,
    mrp: 599,
    categorySlug: "bags-wallets",
    description:
      "A roomy 14-inch printed canvas tote that swallows daily essentials — books, laptop, groceries or gym kit — with space to spare. A top zip keeps everything secure, an inner pocket holds small items, and the shoulder-friendly straps stay comfortable even when it's full. Sturdy, reusable and machine washable.",
    attributes: {
      Material: "Cotton Canvas",
      Size: "14 inch",
      Closure: "Top Zip",
      Compartments: "Main + Inner Pocket",
      Occasion: "Daily / College / Shopping",
      Care: "Machine washable",
    },
  },
  {
    name: "Travel Pouch Organiser (3 pcs)",
    slug: "travel-pouch-organiser-3-pcs",
    price: 399,
    mrp: 899,
    categorySlug: "bags-wallets",
    description:
      "A set of three zip pouches in graded sizes that bring order to any bag or suitcase — sort cables and chargers, cosmetics and toiletries, or documents and travel bits into their own pockets. Each pouch has a water-resistant lining and a smooth zip, so spills stay contained and everything's easy to find.",
    attributes: {
      Material: "Polyester",
      Lining: "Water-Resistant",
      Pack: "3 Pouches (Graded Sizes)",
      Closure: "Zip",
      Occasion: "Travel / Organisation",
      Care: "Wipe clean",
    },
  },
  {
    name: "Casual Backpack (15L)",
    slug: "casual-backpack-15l",
    price: 799,
    mrp: 1799,
    categorySlug: "bags-wallets",
    isFeatured: true,
    description:
      "A practical 15-litre daypack that handles college, commutes and short trips with ease. A padded sleeve safely holds laptops up to 14 inches, the main compartment swallows books and a change of clothes, and a quick-access front pocket keeps your phone and keys handy. Padded, adjustable straps keep it comfortable all day.",
    attributes: {
      Material: "Polyester",
      Capacity: "15 L",
      "Laptop Sleeve": "Fits up to 14 inch",
      Compartments: "Main + Front Pocket",
      Straps: "Padded, Adjustable",
      Occasion: "College / Commute / Travel",
    },
  },
  {
    name: "Small Coin Purse",
    slug: "small-coin-purse",
    price: 99,
    mrp: 249,
    categorySlug: "bags-wallets",
    description:
      "A palm-size zip purse that keeps coins, folded notes and a card or two neatly together — perfect to drop into a bag or pocket. The sturdy fabric build handles daily use, and a handy key-ring loop means your keys are always attached and easy to find. Small, useful and great value.",
    attributes: {
      Material: "Fabric",
      Closure: "Zip",
      Holds: "Coins, Notes & Cards",
      Feature: "Key-Ring Loop",
      Occasion: "Everyday Carry",
      Care: "Wipe clean",
    },
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
      "A 12-in-1 manual vegetable chopper that turns onions, tomatoes, garlic and more into an even dice in seconds — just pull the cord and the sharp stainless-steel blades do the work, no electricity or teary eyes required. The bundle covers chopping, whisking and storing, and the bowl doubles as an airtight container. Parts come apart for quick, easy cleaning.",
    attributes: {
      Blades: "Stainless Steel",
      Operation: "Manual Pull-Cord",
      Pieces: "12-in-1 Set",
      Uses: "Chop, Whisk & Store",
      "Bowl Material": "BPA-Free Plastic",
      Care: "Hand wash; blades not dishwasher safe",
    },
  },
  {
    name: "Insulated Steel Water Bottle (1L)",
    slug: "insulated-steel-water-bottle-1l",
    price: 349,
    mrp: 799,
    categorySlug: "home-kitchen",
    description:
      "A 1-litre double-wall vacuum steel bottle that keeps drinks cold for up to 18 hours or hot for up to 8 — ideal for the gym, office, travel and long commutes. The leak-proof cap means you can toss it in a bag without worry, and the sweat-free exterior stays comfortable to hold. Rust-resistant food-grade stainless steel inside and out.",
    attributes: {
      Material: "Food-Grade Stainless Steel",
      Capacity: "1 Litre",
      Insulation: "Double-Wall Vacuum",
      Retention: "Cold ~18 hrs / Hot ~8 hrs",
      Cap: "Leak-Proof",
      Care: "Hand wash recommended",
    },
  },
  {
    name: "Non-Stick Dosa Tawa (28cm)",
    slug: "non-stick-dosa-tawa-28cm",
    price: 549,
    mrp: 1199,
    categorySlug: "home-kitchen",
    description:
      "A 28 cm aluminium dosa tawa with a durable 3-layer non-stick coating that lets you make crisp, evenly-browned dosas, chillas and rotis with very little oil. Heat spreads uniformly across the base for consistent results, and the sturdy heat-proof handle stays cool and comfortable. Easy to clean and gas-stove compatible.",
    attributes: {
      Material: "Aluminium",
      Coating: "3-Layer Non-Stick",
      Diameter: "28 cm",
      Handle: "Heat-Proof",
      Compatibility: "Gas Stove",
      Care: "Hand wash; use soft/wooden spatulas",
    },
  },
  {
    name: "Airtight Storage Container Set",
    slug: "airtight-storage-container-set",
    price: 399,
    mrp: 899,
    categorySlug: "home-kitchen",
    description:
      "A set of stackable, BPA-free storage containers with click-lock airtight lids that keep dals, cereals, spices and snacks fresh and free from moisture and pests for weeks. The clear bodies make it easy to see what's inside, and the uniform shape stacks neatly to make the most of every shelf. A tidy, practical kitchen upgrade.",
    attributes: {
      Material: "BPA-Free Plastic",
      Lids: "Click-Lock Airtight",
      Feature: "Stackable, See-Through",
      Uses: "Dals, Spices, Snacks & Cereals",
      Care: "Hand wash; not microwave safe",
    },
  },
  {
    name: "Silicone Kitchen Utensil Set",
    slug: "silicone-kitchen-utensil-set",
    price: 449,
    mrp: 999,
    categorySlug: "home-kitchen",
    description:
      "A set of heat-resistant silicone kitchen tools — spatulas, ladle and basting brush — designed to be gentle on non-stick cookware so nothing gets scratched. The seamless, food-grade silicone won't absorb odours or stain, wipes clean easily and stays hygienic. Comfortable grips and hanging loops make everyday cooking a little nicer.",
    attributes: {
      Material: "Food-Grade Silicone",
      Feature: "Non-Scratch, Heat-Resistant",
      Includes: "Spatulas, Ladle & Brush",
      "Odour/Stain": "Resistant",
      Care: "Dishwasher safe",
    },
  },
  {
    name: "Rechargeable Electric Gas Lighter",
    slug: "rechargeable-electric-gas-lighter",
    price: 249,
    mrp: 599,
    categorySlug: "home-kitchen",
    description:
      "A flameless, USB-rechargeable electric arc lighter that lights gas stoves, candles and incense at the press of a button — no gas refills, no matches, no wind blowing it out. A single charge lasts for weeks of daily use, and the built-in safety switch prevents accidental sparks. A clean, reusable replacement for disposable lighters.",
    attributes: {
      Type: "Electric Arc (Flameless)",
      Charging: "USB-Rechargeable",
      Backup: "Weeks per charge",
      Safety: "Child-Safe Switch",
      Uses: "Stove, Candles & Incense",
      Care: "Keep dry",
    },
  },

  // ── Home Decor & Furnishing ─────────────────────────────────────────
  {
    name: "Embroidered Cushion Covers (Set of 2)",
    slug: "embroidered-cushion-covers-set-of-2",
    price: 349,
    mrp: 799,
    categorySlug: "home-decor",
    description:
      "A pair of 16×16 inch cushion covers with elegant tonal embroidery that instantly lifts a sofa, bed or reading chair. Hidden zips keep the look clean and make covers easy to slip on and off for washing, and the neutral tones blend with almost any decor. Cushion inserts not included.",
    attributes: {
      Material: "Poly-Cotton Blend",
      Size: "16 × 16 in (40 × 40 cm)",
      Pack: "Set of 2",
      Closure: "Hidden Zip",
      Design: "Tonal Embroidery",
      Care: "Gentle machine wash; inserts not included",
    },
  },
  {
    name: "Wooden Wall Key Holder",
    slug: "wooden-wall-key-holder",
    price: 299,
    mrp: 699,
    categorySlug: "home-decor",
    description:
      "A wall-mounted key holder in a warm sheesham-wood finish that keeps keys off the counter and by the door where you need them. Six sturdy hooks hold keys, lanyards and small bags, while the slim floating shelf lip is just right for mail, sunglasses or a phone. Mounting hardware is included for a quick set-up.",
    attributes: {
      Material: "Engineered Wood (Sheesham Finish)",
      Hooks: "6",
      Feature: "Floating Shelf Lip for Mail",
      Mounting: "Wall-Mounted (hardware included)",
      Care: "Wipe clean with a dry cloth",
    },
  },
  {
    name: "LED Fairy String Lights (10m)",
    slug: "led-fairy-string-lights-10m",
    price: 299,
    mrp: 699,
    categorySlug: "home-decor",
    isFeatured: true,
    description:
      "A 10-metre string of warm-white LED fairy lights that adds a soft, cosy glow to balconies, headboards, shelves and festive corners. Eight lighting modes let you go from a steady warm shine to a gentle twinkle, and the flexible wire bends easily around railings, frames and plants. Low-heat, energy-efficient LEDs made for Diwali, weddings and everyday ambience.",
    attributes: {
      Length: "10 m",
      Colour: "Warm White",
      Modes: "8 Lighting Modes",
      "Light Source": "Energy-Efficient LED",
      Uses: "Festive / Decor / Ambience",
      Care: "Indoor use; keep away from water",
    },
  },
  {
    name: "Photo Frame Collage Set",
    slug: "photo-frame-collage-set",
    price: 399,
    mrp: 899,
    categorySlug: "home-decor",
    description:
      "A six-frame photo collage set in mixed sizes that turns a bare wall into a personal gallery of memories. A printed hanging template takes the guesswork out of spacing, so you get a balanced, put-together layout in under ten minutes. Slim, lightweight frames with clear fronts that keep photos crisp.",
    attributes: {
      Material: "Synthetic Wood (MDF) with Clear Front",
      Pieces: "6 Frames (Mixed Sizes)",
      Includes: "Hanging Template & Hardware",
      Mounting: "Wall-Mounted",
      Care: "Wipe clean with a dry cloth",
    },
  },
  {
    name: "Cotton Door Curtain (7ft)",
    slug: "cotton-door-curtain-7ft",
    price: 499,
    mrp: 999,
    categorySlug: "home-decor",
    description:
      "A 7-foot cotton door curtain with a subtle woven texture that softens a doorway while still letting light and air move through. The tab top slides easily onto most rods and hangs in clean, even folds. A simple, breathable way to add privacy and warmth to a room. Single panel; rod not included.",
    attributes: {
      Material: "Cotton",
      Size: "7 ft (Door Length)",
      "Header Type": "Tab Top",
      Pack: "1 Panel",
      "Light Filtering": "Semi-Sheer",
      Care: "Machine wash gentle",
    },
  },
  {
    name: "Decorative Wall Clock",
    slug: "decorative-wall-clock",
    price: 599,
    mrp: 1299,
    categorySlug: "home-decor",
    description:
      "A 30 cm wall clock with a silent-sweep movement — no second-hand ticking to break the quiet of a bedroom or study. Bold, high-contrast numerals stay easy to read from across the room, and the slim matte frame suits modern and traditional interiors alike. Runs on a single AA battery (not included).",
    attributes: {
      Material: "Plastic Frame with Glass Front",
      Diameter: "30 cm",
      Movement: "Silent Sweep (No Ticking)",
      Display: "Bold Numerals",
      Power: "1 × AA Battery (not included)",
      Mounting: "Wall-Mounted",
    },
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
      "A weightless matte liquid lipstick that delivers rich, full colour in a single swipe and dries down to a comfortable, non-drying finish. It stays put through meals and long days for up to 8 hours, and a touch of vitamin E helps keep lips soft rather than parched. The precise applicator makes clean, defined edges easy.",
    attributes: {
      Finish: "Matte",
      "Wear Time": "Up to 8 hours",
      Coverage: "Full, One-Swipe",
      Enriched: "Vitamin E",
      Applicator: "Precision Wand",
    },
  },
  {
    name: "Aloe Vera Gel (300ml)",
    slug: "aloe-vera-gel-300ml",
    price: 199,
    mrp: 399,
    categorySlug: "beauty-personal-care",
    description:
      "A multi-use 300 ml aloe vera gel made with 98% pure aloe that soothes, hydrates and calms sun-stressed or irritated skin. Lightweight and non-sticky, it sinks in fast and works across the board — as a daily moisturiser, after-sun soother, hair and scalp conditioner, or a base under makeup. Gentle enough for regular use on all skin types.",
    attributes: {
      "Net Volume": "300 ml",
      "Aloe Content": "98% Pure Aloe",
      "Skin Type": "All Skin Types",
      Uses: "Skin, Hair & After-Sun",
      Texture: "Lightweight, Non-Sticky",
    },
  },
  {
    name: "Oil-Control Compact Powder",
    slug: "oil-control-compact-powder",
    price: 299,
    mrp: 699,
    categorySlug: "beauty-personal-care",
    description:
      "A lightweight oil-control compact powder that blurs shine and sets makeup for a smooth, matte finish that lasts through the day without looking cakey. Built-in SPF-15 adds a little everyday sun defence, and the handy case includes a mirror and puff for quick touch-ups on the go. Buildable coverage that evens out tone.",
    attributes: {
      Finish: "Matte / Oil-Control",
      SPF: "SPF 15",
      Coverage: "Buildable",
      Includes: "Mirror & Puff",
      "Skin Type": "Normal to Oily",
    },
  },
  {
    name: "Makeup Brush Set (7 pcs)",
    slug: "makeup-brush-set-7-pcs",
    price: 399,
    mrp: 899,
    categorySlug: "beauty-personal-care",
    description:
      "A seven-piece makeup brush set that covers a full face — foundation and powder for base, a blush brush for cheeks, and a range of eye brushes for shadow, blending and detail. The soft synthetic bristles are cruelty-free, pick up and place product evenly, and are easy to wash. Balanced wooden handles make them comfortable to hold for beginners and pros alike.",
    attributes: {
      Pieces: "7 Brushes",
      Bristles: "Soft Synthetic (Cruelty-Free)",
      Handles: "Wooden",
      Covers: "Base, Blush & Full Eye",
      Care: "Wash with mild soap; air dry",
    },
  },
  {
    name: "Herbal Face Wash (150ml)",
    slug: "herbal-face-wash-150ml",
    price: 179,
    mrp: 349,
    categorySlug: "beauty-personal-care",
    description:
      "A gentle 150 ml herbal face wash powered by neem and tulsi extracts that cleanse deep into pores, lifting away dirt, oil and pollution without stripping the skin's natural moisture. The soap-free formula rinses clean and leaves skin feeling fresh and balanced rather than tight. Suitable for daily morning-and-night use on most skin types.",
    attributes: {
      "Net Volume": "150 ml",
      "Key Ingredients": "Neem & Tulsi",
      Formula: "Soap-Free",
      "Skin Type": "Normal to Oily / Combination",
      Usage: "Daily (AM & PM)",
    },
  },
  {
    name: "Mini Hair Straightening Brush",
    slug: "mini-hair-straightening-brush",
    price: 599,
    mrp: 1299,
    categorySlug: "beauty-personal-care",
    description:
      "A compact heated straightening brush that smooths and adds shine in a single pass — brush through and frizz turns to sleek, glossy hair without a separate flat iron. The ceramic-coated bristles heat evenly to protect strands, and a 30-second heat-up gets you out the door fast. Its small size is perfect for travel and quick touch-ups.",
    attributes: {
      Type: "Heated Straightening Brush",
      Coating: "Ceramic",
      "Heat-Up": "~30 seconds",
      Feature: "Compact / Travel-Friendly",
      Power: "Corded Electric",
      Care: "Cool fully before storing",
    },
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
      "A 100-piece set of chunky interlocking building blocks in bright, cheerful colours that keeps little hands busy and screen-free for hours. Easy to grip and click together, they help build fine motor skills, colour recognition and imagination as kids create towers, forts, rockets and whatever else they dream up. Made from smooth, BPA-free plastic with no sharp edges.",
    attributes: {
      Pieces: "100 Blocks",
      Material: "BPA-Free Plastic",
      "Age Group": "3+ years",
      Skills: "Motor Skills & Creativity",
      Safety: "Smooth, No Sharp Edges",
      Care: "Wipe clean",
    },
  },
  {
    name: "Soft Plush Teddy Bear (30cm)",
    slug: "soft-plush-teddy-bear-30cm",
    price: 399,
    mrp: 799,
    categorySlug: "toys-baby-kids",
    description:
      "A huggable 30 cm teddy bear in ultra-soft, cuddle-me plush that quickly becomes a favourite companion for naps, playtime and comfort. Safety-first embroidered eyes (no hard buttons to come loose) make it suitable for even the youngest cuddlers, and the gentle fill holds its shape. A sweet, ready-to-gift soft toy for birthdays and newborns.",
    attributes: {
      Height: "30 cm",
      Material: "Ultra-Soft Plush",
      Filling: "Soft Cotton Fibre",
      Eyes: "Embroidered (Safe)",
      "Age Group": "All ages",
      Care: "Surface / gentle hand wash",
    },
  },
  {
    name: "Remote Control Mini Car",
    slug: "remote-control-mini-car",
    price: 599,
    mrp: 1299,
    categorySlug: "toys-baby-kids",
    description:
      "A zippy remote-control mini car that goes forward, reverse, left and right with a responsive full-function remote — easy enough for young drivers and fun enough to chase around the house. Glowing headlights add to the excitement, and the rechargeable battery delivers about 20 minutes of drive per charge, so there's no steady stream of throwaway batteries.",
    attributes: {
      Control: "Full-Function Remote",
      Battery: "Rechargeable (car)",
      "Run Time": "~20 min per charge",
      Feature: "Working Headlights",
      "Age Group": "5+ years",
      "Remote Battery": "Not included",
    },
  },
  {
    name: "Baby Bib & Burp Cloth Set",
    slug: "baby-bib-burp-cloth-set",
    price: 299,
    mrp: 599,
    categorySlug: "toys-baby-kids",
    description:
      "A soft, absorbent baby bib and burp cloth set in gentle cotton that soaks up drools, spills and little messes at mealtimes and after feeds. Skin-friendly and breathable against delicate skin, with secure snap closures that are quick to fasten and stay put. Built to survive endless washes and stay soft.",
    attributes: {
      Material: "Cotton",
      Includes: "Bib + Burp Cloth",
      Closure: "Snap Buttons",
      Feature: "Absorbent & Skin-Friendly",
      "Age Group": "0–2 years",
      Care: "Machine washable",
    },
  },
  {
    name: "Colouring Book & Crayons Combo",
    slug: "colouring-book-crayons-combo",
    price: 199,
    mrp: 399,
    categorySlug: "toys-baby-kids",
    description:
      "A screen-free colouring combo that pairs a 64-page colouring book full of fun, age-appropriate illustrations with a 12-shade crayon pack. It's a ready-to-go activity that keeps kids happily busy on trips, rainy days and quiet afternoons while building creativity, focus and colour skills. Smooth-glide, easy-grip crayons made for little hands.",
    attributes: {
      Includes: "64-Page Book + 12 Crayons",
      "Age Group": "3–8 years",
      Skills: "Creativity & Focus",
      Feature: "Screen-Free Activity",
      Safety: "Non-Toxic Crayons",
    },
  },
  {
    name: "Kids' Cartoon Water Bottle",
    slug: "kids-cartoon-water-bottle",
    price: 249,
    mrp: 499,
    categorySlug: "toys-baby-kids",
    description:
      "A cheerful 450 ml kids' water bottle with fun cartoon graphics that makes staying hydrated something they actually look forward to. The spill-proof, one-touch pop-up straw is easy for small hands, and the carry strap clips onto bags for school and outings. Made from BPA-free, food-safe material that's light to carry and simple to clean.",
    attributes: {
      Capacity: "450 ml",
      Material: "BPA-Free Plastic",
      Lid: "Spill-Proof Pop-Up Straw",
      Feature: "Carry Strap",
      "Age Group": "3+ years",
      Care: "Hand wash",
    },
  },

  // ── Stationery & Office ─────────────────────────────────────────────
  {
    name: "Gel Pens Set (10 pcs)",
    slug: "gel-pens-set-10-pcs",
    price: 99,
    mrp: 349,
    categorySlug: "stationery-office",
    description:
      "A set of ten smooth-flow 0.7 mm gel pens in assorted ink colours that glide across the page without skipping or smudging. Quick-drying ink makes them friendly for left-handers and exam sheets, while cushioned comfort grips keep hands relaxed through long notes and doodles alike. A colourful, everyday-value set for students and the office.",
    attributes: {
      Pack: "10 Pens",
      "Tip Size": "0.7 mm",
      "Ink Type": "Quick-Dry Gel",
      Colours: "Assorted",
      Grip: "Cushioned Comfort Grip",
    },
  },
  {
    name: "Spiral Notebook Combo (3 pcs)",
    slug: "spiral-notebook-combo-3-pcs",
    price: 199,
    mrp: 399,
    categorySlug: "stationery-office",
    description:
      "A combo of three A5 spiral notebooks with 160 ruled pages each — plenty of room for class notes, to-do lists, journalling or work. The sturdy spiral binding lies flat and lets you fold covers all the way back, while the laminated covers shrug off the knocks and spills of everyday backpack life. Smooth paper that's kind to most pens.",
    attributes: {
      Pack: "3 Notebooks",
      Size: "A5",
      Pages: "160 Ruled (each)",
      Binding: "Spiral (Lay-Flat)",
      Cover: "Laminated",
    },
  },
  {
    name: "Multi-Compartment Desk Organiser",
    slug: "multi-compartment-desk-organiser",
    price: 349,
    mrp: 799,
    categorySlug: "stationery-office",
    description:
      "A multi-compartment desk organiser that clears the clutter and keeps everything you reach for within arm's reach — pens, scissors, sticky notes, phone, clips and cards each get their own spot across seven compartments plus a small pull-out drawer for odds and ends. A sturdy, space-smart build that tidies a study table or work desk in seconds.",
    attributes: {
      Material: "Durable Plastic",
      Compartments: "7 + Pull-Out Drawer",
      Uses: "Pens, Phone, Notes & Clips",
      Placement: "Desk / Tabletop",
      Care: "Wipe clean",
    },
  },
  {
    name: "Sticky Notes & Stickers Combo",
    slug: "sticky-notes-stickers-combo",
    price: 99,
    mrp: 299,
    categorySlug: "stationery-office",
    description:
      "A bright sticky notes and stickers combo with over 500 pieces to organise, plan and decorate — self-stick notes in four handy sizes, colourful planner stickers and slim page flags for marking books and files. The low-tack adhesive holds firm but peels away cleanly without tearing pages. A cheerful, practical bundle for students, planners and the desk.",
    attributes: {
      "Total Pieces": "500+",
      Includes: "Sticky Notes (4 sizes), Stickers & Page Flags",
      Adhesive: "Low-Tack, Removable",
      Uses: "Notes, Planning & Bookmarking",
    },
  },
  {
    name: "Wireless Optical Mouse",
    slug: "wireless-optical-mouse",
    price: 399,
    mrp: 899,
    categorySlug: "stationery-office",
    isFeatured: true,
    description:
      "A 2.4 GHz wireless optical mouse that keeps your desk cable-free and your workspace quiet — silent clicks won't disturb a meeting, library or sleeping household. Adjustable DPI lets you switch between precise and fast cursor speeds, and a plug-and-play nano receiver tucks into a USB port with nothing to install. Up to 12 months of battery life on a single AA.",
    attributes: {
      Connectivity: "2.4 GHz Wireless",
      Receiver: "Nano USB (included)",
      Clicks: "Silent",
      DPI: "Adjustable",
      Battery: "1 × AA (up to 12 months)",
      Compatibility: "Windows / macOS",
    },
  },
  {
    name: "12-Digit Desktop Calculator",
    slug: "12-digit-desktop-calculator",
    price: 299,
    mrp: 599,
    categorySlug: "stationery-office",
    description:
      "A 12-digit desktop calculator built for everyday accounts, billing and study, with a large tilted display that's easy to read at a glance. Dual solar-plus-battery power means it keeps working in low light and never leaves you stranded, and the big, responsive keys make fast, error-free entry comfortable for long sessions.",
    attributes: {
      Display: "12-Digit (Large, Tilted)",
      Power: "Dual Solar + Battery",
      Keys: "Big Responsive Keys",
      Uses: "Accounts / Billing / Study",
      Type: "Desktop",
    },
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
      "A 6 mm NBR yoga mat with a textured anti-slip surface that grips the floor and stays put through downward dogs and dynamic flows. The extra cushioning protects knees, wrists and spine on hard floors, making it just as good for pilates, stretching and home workouts as for yoga. Lightweight, easy to roll up, and it comes with a carry strap for the studio or park.",
    attributes: {
      Material: "NBR Foam",
      Thickness: "6 mm",
      Surface: "Textured Anti-Slip",
      Includes: "Carry Strap",
      Uses: "Yoga / Pilates / Workout",
      Care: "Wipe clean; air dry",
    },
  },
  {
    name: "Resistance Band Set (5 pcs)",
    slug: "resistance-band-set-5-pcs",
    price: 349,
    mrp: 799,
    categorySlug: "sports-fitness",
    description:
      "A five-piece resistance band set with colour-coded loops from light to extra-heavy, so you can dial the challenge up as you get stronger. Great for strength training, mobility, physio and warm-ups, they work legs, glutes, arms and core with almost no space or equipment. A carry pouch keeps them together and an exercise guide helps you get started at home or on the go.",
    attributes: {
      Material: "Natural Latex",
      Pieces: "5 Loop Bands",
      Resistance: "Light to Extra-Heavy",
      Includes: "Carry Pouch & Exercise Guide",
      Uses: "Strength / Mobility / Physio",
    },
  },
  {
    name: "Adjustable Skipping Rope",
    slug: "adjustable-skipping-rope",
    price: 99,
    mrp: 349,
    categorySlug: "sports-fitness",
    description:
      "A tangle-free skipping rope with smooth ball-bearing handles that spin fast and steady for double-unders and speed work. The 9-foot cable adjusts to your height in seconds, and the comfortable foam grips stay secure even through sweaty, high-rep sessions. A compact, effective cardio tool for home, gym or travel.",
    attributes: {
      Handles: "Ball-Bearing, Foam Grip",
      Cable: "Adjustable (up to 9 ft)",
      Feature: "Tangle-Free, Fast Spin",
      Uses: "Cardio / HIIT / Warm-Up",
      Portability: "Compact & Travel-Friendly",
    },
  },
  {
    name: "Sports Sipper Water Bottle (1L)",
    slug: "sports-sipper-water-bottle-1l",
    price: 249,
    mrp: 549,
    categorySlug: "sports-fitness",
    description:
      "A 1-litre sports sipper built for the gym, field and long days out. The one-hand flip-top lock opens for a quick drink and clicks shut to stop leaks in your bag, while printed time markings nudge you to hit your hydration goals through the day. The sweat-proof matte body is easy to grip, and a carry loop clips it wherever you need it.",
    attributes: {
      Capacity: "1 Litre",
      Material: "BPA-Free Plastic",
      Lid: "Flip-Top Lock",
      Feature: "Time Markings & Carry Loop",
      Finish: "Sweat-Proof Matte",
      Care: "Hand wash",
    },
  },
  {
    name: "Hand Grip Strengthener (Pair)",
    slug: "hand-grip-strengthener-pair",
    price: 199,
    mrp: 449,
    categorySlug: "sports-fitness",
    description:
      "A pair of adjustable hand grip strengtheners with resistance that dials from 10 to 40 kg, so beginners and seasoned lifters can both find their level — and keep progressing. They build forearm, wrist and grip strength that carries over to lifting, sports and daily tasks, and the non-slip ergonomic handles stay comfortable and secure. Small enough to train anywhere, at your desk or on the couch.",
    attributes: {
      Pack: "Pair (2 Grips)",
      Resistance: "Adjustable 10–40 kg",
      Handles: "Non-Slip Ergonomic",
      Builds: "Forearm, Wrist & Grip Strength",
      Portability: "Compact",
    },
  },
  {
    name: "Adjustable Sports Cap",
    slug: "adjustable-sports-cap",
    price: 249,
    mrp: 549,
    categorySlug: "sports-fitness",
    description:
      "A lightweight quick-dry sports cap that shades your eyes and wicks away sweat during runs, gym sessions and days in the sun. A pre-curved brim cuts glare, breathable eyelets keep your head cool, and the adjustable back strap dials in a secure fit. One size fits most, for men and women alike.",
    attributes: {
      Material: "Quick-Dry Polyester",
      Brim: "Pre-Curved",
      Ventilation: "Breathable Eyelets",
      Closure: "Adjustable Strap",
      Size: "One Size Fits Most",
      Gender: "Unisex",
    },
  },
];
