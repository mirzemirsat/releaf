export interface Product {
  slug: string;
  name: string;
  tagline: string;
  /** Prices stored in kuruş (1 TRY = 100 kuruş) to avoid floating point. */
  price: number;
  compareAt?: number;
  badge?: string;
  image: string;
  gallery: string[];
  description: string;
  contents: string[];
  highlight: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "releaf-blind-box",
    name: "Releaf Blind Box",
    tagline: "One mystery bloom of seven",
    price: 1_099_00,
    badge: "Bestseller",
    image: "/products/exotic.png",
    gallery: [
      "/products/exotic.png",
      "/products/sunflower.png",
      "/products/daisy.png",
      "/products/tulip.png",
      "/products/lavender.png",
      "/products/hydrangea.png",
      "/products/lily.png",
    ],
    description:
      "The full Releaf experience in a single sealed box: a 25 cm plush desk companion with a built-in Pomodoro timer and the signature bending stem. Which of the seven blooms is inside? That part is up to the garden.",
    contents: [
      "1 × mystery Releaf plush companion (25 cm, 1 of 7 blooms)",
      "Pot base with Pomodoro timer & slow-bend mechanism",
      "Collector card with rarity stamp",
      "Pocket Pomodoro guide",
      "QR code to register your bloom & view the collection",
      "USB-C cable (8+ weeks of sessions per charge)",
    ],
    highlight: "Pull rates printed on every box — see the collection page for full odds.",
  },
  {
    slug: "focus-trio",
    name: "Focus Trio",
    tagline: "Buy two, gift one — three blind boxes",
    price: 2_198_00,
    compareAt: 3_297_00,
    badge: "Buy 2, Gift 1",
    image: "/products/tulip.png",
    gallery: ["/products/tulip.png", "/products/daisy.png", "/products/lavender.png"],
    description:
      "Three sealed blind boxes for the price of two. Keep a pair on your own desk, or do the kind thing: give a friend in exam season a reason to take real breaks. Three independent pulls means three chances at the Exotic.",
    contents: [
      "3 × sealed Releaf Blind Boxes (independent pulls)",
      "3 × collector cards",
      "1 × gift sleeve for the third box",
      "Everything in the standard box, three times over",
    ],
    highlight: "The effective price drops to ₺733 per bloom — our best value for new collectors.",
  },
  {
    slug: "full-garden",
    name: "The Full Garden",
    tagline: "All six standard blooms, zero duplicates",
    price: 5_499_00,
    compareAt: 6_594_00,
    badge: "No duplicates",
    image: "/products/sunflower.png",
    gallery: [
      "/products/sunflower.png",
      "/products/daisy.png",
      "/products/tulip.png",
      "/products/lavender.png",
      "/products/hydrangea.png",
      "/products/lily.png",
    ],
    description:
      "For the completionists: Sunny, Dia, Tülin, Lale, Hira and Lili — the six standard blooms, guaranteed, with no duplicates. The Exotic stays where it belongs: hiding in blind boxes. A full windowsill of focus.",
    contents: [
      "6 × Releaf plush companions (all six standard blooms, guaranteed)",
      "6 × collector cards with a matching-set stamp",
      "Numbered Full Garden certificate",
      "Desk-garden arrangement guide",
    ],
    highlight: "Saves ₺1.095 versus six individual boxes — and your shelf will thank you.",
  },
];

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);
