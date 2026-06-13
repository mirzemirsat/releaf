import { NextResponse } from "next/server";
import { computeTotals, type CartItems } from "@/lib/pricing";
import { productBySlug } from "@/lib/products";

interface CheckoutBody {
  items: CartItems;
  code?: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Order placement endpoint.
 *
 * Totals are recomputed server-side from the product catalog, so a
 * tampered client can never set its own prices. Payment is simulated:
 * swap `simulatePayment` for a real PSP adapter (iyzico / Stripe /
 * PayTR) to go live — the rest of the flow stays identical.
 */
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, code, customer } = body ?? {};

  // — validate cart —
  if (!items || typeof items !== "object" || Object.keys(items).length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  for (const [slug, qty] of Object.entries(items)) {
    if (!productBySlug(slug)) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
    }
  }

  // — validate customer —
  const required = ["name", "email", "phone", "address", "city", "postalCode"] as const;
  for (const field of required) {
    if (!customer?.[field]?.trim()) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }
  if (!EMAIL_RE.test(customer.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const totals = computeTotals(items, code);

  await simulatePayment(totals.total);

  const orderId = `RLF-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  return NextResponse.json({
    orderId,
    total: totals.total,
    itemCount: totals.itemCount,
    email: customer.email,
    name: customer.name,
    eta: "1–3 business days",
  });
}

/** Stand-in for a real payment service provider call. */
async function simulatePayment(_amountKurus: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
}
