import { productBySlug } from "./products";

/** Quantity of each product in the cart, keyed by product slug. */
export type CartItems = Record<string, number>;

export interface DiscountCode {
  code: string;
  /** e.g. 0.15 for 15% */
  rate: number;
  label: string;
}

/**
 * Penetration-pricing levers from the marketing plan:
 * a student discount and a launch discount.
 */
export const DISCOUNT_CODES: DiscountCode[] = [
  { code: "STUDENT15", rate: 0.15, label: "Student discount (15%)" },
  { code: "FOCUS10", rate: 0.1, label: "Launch code (10%)" },
];

export const FREE_SHIPPING_THRESHOLD = 1_500_00; // kuruş
export const SHIPPING_COST = 89_90; // ₺89,90 flat rate in kuruş

export function findDiscount(code: string | null | undefined): DiscountCode | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return DISCOUNT_CODES.find((d) => d.code === normalized) ?? null;
}

export interface CartLine {
  slug: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CartTotals {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  shipping: number;
  total: number;
  freeShippingGap: number;
}

/**
 * Single source of truth for order math — used by the cart drawer,
 * the checkout page, and re-computed server-side in the checkout API
 * so the client can never invent its own prices.
 */
export function computeTotals(items: CartItems, code?: string | null): CartTotals {
  const lines: CartLine[] = [];

  for (const [slug, qty] of Object.entries(items)) {
    const product = productBySlug(slug);
    if (!product || qty <= 0) continue;
    lines.push({
      slug,
      name: product.name,
      image: product.image,
      qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  const matched = findDiscount(code);
  const discount = matched ? Math.round(subtotal * matched.rate) : 0;

  const afterDiscount = subtotal - discount;
  const shipping =
    itemCount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return {
    lines,
    itemCount,
    subtotal,
    discount,
    discountLabel: matched?.label ?? null,
    shipping,
    total: afterDiscount + shipping,
    freeShippingGap: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount),
  };
}
