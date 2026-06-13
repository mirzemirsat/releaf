export type FlowerSpecies =
  | "sunflower"
  | "daisy"
  | "tulip"
  | "lavender"
  | "hydrangea"
  | "lily"
  | "exotic";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Ultra Rare";

export interface Flower {
  species: FlowerSpecies;
  name: string;
  nickname: string;
  /** Botanical name, shown in italics on the showcase carousel. */
  scientificName: string;
  rarity: Rarity;
  /** Pull rate, as a percentage. All seven sum to exactly 100. */
  odds: number;
  color: string;
  bio: string;
  mood: string;
  image: string;
}

/**
 * The seven-bloom Releaf collection.
 * Odds are disclosed openly on the collection page (and on every box) —
 * fair, clearly-communicated pull rates are a brand commitment.
 */
export const FLOWERS: Flower[] = [
  {
    species: "sunflower",
    name: "Sunny the Sunflower",
    nickname: "Sunny",
    scientificName: "Helianthus annuus",
    rarity: "Common",
    odds: 18,
    color: "var(--color-sun-400)",
    bio: "The original Releaf and the face of the brand. Sunny is the friend who drags you outside at lunch — endlessly optimistic, slightly bossy about breaks.",
    mood: "Golden-hour optimist",
    image: "/products/sunflower.png",
  },
  {
    species: "daisy",
    name: "Dia the Daisy",
    nickname: "Dia",
    scientificName: "Bellis perennis",
    rarity: "Common",
    odds: 18,
    color: "#fffdf6",
    bio: "Small, calm, and quietly stubborn about your wellbeing. Dia believes every big exam is just a series of tiny, well-rested mornings.",
    mood: "Soft-spoken morning person",
    image: "/products/daisy.png",
  },
  {
    species: "tulip",
    name: "Tülin the Tulip",
    nickname: "Tülin",
    scientificName: "Tulipa",
    rarity: "Common",
    odds: 18,
    color: "var(--color-tulip)",
    bio: "Bold, warm, and a little dramatic about bending. When Tülin droops, the whole desk knows it is break time. No negotiations.",
    mood: "Theatrical break enforcer",
    image: "/products/tulip.png",
  },
  {
    species: "lavender",
    name: "Lale the Lavender",
    nickname: "Lale",
    scientificName: "Lavandula",
    rarity: "Uncommon",
    odds: 13,
    color: "var(--color-lav)",
    bio: "The deep-breath specialist. Lale is for evening study sessions and people who need their breaks to actually feel like rest.",
    mood: "Late-night calm",
    image: "/products/lavender.png",
  },
  {
    species: "hydrangea",
    name: "Hira the Hydrangea",
    nickname: "Hira",
    scientificName: "Hydrangea macrophylla",
    rarity: "Uncommon",
    odds: 13,
    color: "var(--color-hyd)",
    bio: "A hundred tiny blooms acting as one — Hira is the group-project flower. Best desk companion for study-with-me sessions.",
    mood: "Crowd-sourced serenity",
    image: "/products/hydrangea.png",
  },
  {
    species: "lily",
    name: "Lili the Lily",
    nickname: "Lili",
    scientificName: "Lilium",
    rarity: "Rare",
    odds: 12,
    color: "var(--color-lily)",
    bio: "Elegant, a touch shy, and the collection's quiet star. Lili tilts with unusual grace — collectors say her bend is the prettiest.",
    mood: "Graceful perfectionist",
    image: "/products/lily.png",
  },
  {
    species: "exotic",
    name: "The Exotic",
    nickname: "???",
    scientificName: "Flora incognita",
    rarity: "Ultra Rare",
    odds: 8,
    color: "#2f3327",
    bio: "Nobody posts a spoiler. The Exotic is the ultra-rare seventh bloom — a midnight silhouette that only reveals itself when you open the box.",
    mood: "A beautiful mystery",
    image: "/products/exotic.png",
  },
];

export const flowerBySpecies = (species: FlowerSpecies): Flower =>
  FLOWERS.find((f) => f.species === species)!;

export const RARITY_STYLES: Record<Rarity, string> = {
  Common: "bg-leaf-100 text-leaf-700",
  Uncommon: "bg-sun-100 text-sun-700",
  Rare: "bg-lily text-[#a14d63]",
  "Ultra Rare": "bg-leaf-900 text-cream-100",
};
