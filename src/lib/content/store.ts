import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { DEFAULT_CONTENT, type SectionKey, type SiteContent } from "./defaults";
import { PRODUCTS, type Product } from "@/lib/products";
import { FLOWERS, type Flower } from "@/lib/flowers";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

type Json = Record<string, unknown>;

/**
 * Deep-merge admin overrides over the code defaults.
 * Objects merge key-by-key; arrays and primitives from the override
 * replace the default wholesale (so items can be added/removed).
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (typeof base === "object" && base !== null && typeof override === "object") {
    const out: Json = { ...(base as Json) };
    for (const [key, value] of Object.entries(override as Json)) {
      if (key in (base as Json)) {
        out[key] = deepMerge((base as Json)[key], value);
      } else {
        out[key] = value;
      }
    }
    return out as T;
  }
  return typeof override === typeof base ? (override as T) : base;
}

async function readOverrides(): Promise<Partial<Record<SectionKey, unknown>>> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {}; // no overrides yet — pure defaults
  }
}

/** Full site content: defaults merged with any admin overrides. Deduped per request. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const overrides = await readOverrides();
  return deepMerge(DEFAULT_CONTENT, overrides);
});

/**
 * The sellable catalog with admin-edited marketing fields merged in.
 * Prices, compare-at prices and slugs always come from code — content
 * edits can never alter what checkout charges.
 */
export const getCatalog = cache(async (): Promise<Product[]> => {
  const content = await getContent();
  return PRODUCTS.map((base) => {
    const edited = content.products.find((p) => p.slug === base.slug);
    if (!edited) return base;
    return {
      ...base,
      name: edited.name || base.name,
      tagline: edited.tagline || base.tagline,
      badge: edited.badge || undefined,
      description: edited.description || base.description,
      highlight: edited.highlight || base.highlight,
      image: edited.image || base.image,
      gallery: edited.gallery?.length ? edited.gallery : base.gallery,
      contents: edited.contents?.length ? edited.contents : base.contents,
    };
  });
});

/** The seven blooms with admin-edited fields merged in (rarity/odds stay fixed). */
export const getFlowers = cache(async (): Promise<Flower[]> => {
  const content = await getContent();
  return FLOWERS.map((base) => {
    const edited = content.flowers.find((f) => f.species === base.species);
    if (!edited) return base;
    return {
      ...base,
      name: edited.name || base.name,
      scientificName: edited.scientificName || base.scientificName,
      mood: edited.mood || base.mood,
      bio: edited.bio || base.bio,
      image: edited.image || base.image,
    };
  });
});

const MAX_SECTION_BYTES = 300_000;

/** Persist one section's overrides (or clear them with `data === null`). */
export async function saveSection(section: SectionKey, data: unknown): Promise<void> {
  if (!(section in DEFAULT_CONTENT)) throw new Error(`Unknown section: ${section}`);

  const overrides = await readOverrides();
  if (data === null) {
    delete overrides[section];
  } else {
    const serialized = JSON.stringify(data);
    if (serialized.length > MAX_SECTION_BYTES) throw new Error("Section payload too large.");
    overrides[section] = JSON.parse(serialized); // strips undefined / prototypes
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = CONTENT_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(overrides, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
}

/** The current merged value of a single section (what the editor loads). */
export async function getSection(section: SectionKey): Promise<unknown> {
  const content = await getContent();
  return content[section];
}
