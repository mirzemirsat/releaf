"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content/defaults";

export type GlobalContent = SiteContent["global"];
/** Display fields the cart needs for each purchasable slug. */
export type ProductDisplayMap = Record<string, { name: string; image: string }>;

interface ChromeContextValue {
  global: GlobalContent;
  products: ProductDisplayMap;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

/**
 * Hands the (admin-editable) chrome content to client components —
 * header nav, logo, footer and the cart drawer's product names/photos.
 * The value is produced server-side in the root layout from the
 * content store, so edits flow through on the next render.
 */
export default function SiteChromeProvider({
  global,
  products,
  children,
}: ChromeContextValue & { children: ReactNode }) {
  return <ChromeContext.Provider value={{ global, products }}>{children}</ChromeContext.Provider>;
}

export function useGlobalContent(): GlobalContent {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error("useGlobalContent must be used inside SiteChromeProvider");
  return ctx.global;
}

export function useProductDisplay(): ProductDisplayMap {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error("useProductDisplay must be used inside SiteChromeProvider");
  return ctx.products;
}
