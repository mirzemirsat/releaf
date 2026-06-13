import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE = "https://releaf.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/shop", "/collection", "/guide", "/about"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
