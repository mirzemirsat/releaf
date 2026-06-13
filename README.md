# 🌻 Releaf — Brand & E-Commerce Site

> **Focus. Rest. Releaf.**
> The official storefront for Releaf, a plush Pomodoro desk companion that **stands tall while
> you focus and bends forward when it's time to rest**.

Built from the Releaf launch marketing plan: cute, comforting, wellness-first — with the
product's signature bend recreated as a living, interactive animation, the 7-bloom blind box
collection front and center, and a complete purchase flow.

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. That's it — no env vars, no database, no API keys.

Production build:

```bash
npm run build
npm start
```

> Requires Node.js 18.18+ (tested on Node 24).

---

## What's inside

| Route | What it does |
| --- | --- |
| `/` | Hero with the flower demonstrating its bend on a loop, how-it-works, **interactive Pomodoro demo**, collection strip, comparisons, testimonials, FAQ |
| `/shop` | The three SKUs: Blind Box (₺1.099), Focus Trio "buy 2 gift 1" (₺2.198), Full Garden set (₺5.499) |
| `/collection` | All 7 blooms with personalities, rarity tiers, and the **openly disclosed pull-rate table** (a brand commitment from the marketing plan) |
| `/product/[slug]` | Product detail: photo gallery, contents, specs, odds bars, cross-sell |
| `/guide` | The Pomodoro guide — why breaks are the hard part, and how Releaf fixes that |
| `/about` | Mission, story ("relief, spelled with a leaf"), values, contact |
| `/checkout` → `/checkout/success` | Full checkout: validated shipping + payment form, order summary, discount codes, then a confirmation page with order number |
| `POST /api/checkout` | Order endpoint — **recomputes all totals server-side** from the catalog so a tampered client can never set its own prices |

### The signature interaction

The physical product's whole pitch is *"the behavior is the campaign"* — so the site performs it:

- **`FlowerArt.tsx`** draws all 7 plush companions (sunflower, daisy, tulip, lavender,
  hydrangea, lily, and the mystery Exotic) as hand-built SVG, with kawaii faces, the beige
  "Releaf" pot, and a plant group that pivots at the soil line.
- Upright, it idles with a gentle sway. On "break time" it **droops forward on a slow spring**,
  eyes closing sleepily — the exact behavior of the motor in the physical pot.
- **`PomodoroDemo.tsx`** wires that flower to a real working Pomodoro timer (10-second demo
  preset, classic 25/5, deep 50/10) on the homepage — visitors experience the product before
  buying it.
- The hero runs an endless tiny focus/rest cycle so the mechanism is understood within five
  seconds of landing, with zero copy. Works with the sound off, just like the TikTok ads.

### Commerce details

- **Cart**: Zustand store persisted to `localStorage` (`releaf-cart`), slide-over drawer with
  quantity controls, free-shipping progress bar.
- **Pricing**: integer kuruş everywhere (no floating-point money), formatted as Turkish lira.
  Single source of truth in `src/lib/pricing.ts`, shared by drawer, checkout page and API.
- **Penetration-pricing levers from the report**: `STUDENT15` (15% student discount) and
  `FOCUS10` (10% launch code); free shipping over ₺1.500, flat ₺89,90 below.
- **Payments are simulated** (this is a demo store — clearly labeled in the UI). The PSP call
  is isolated in `simulatePayment()` inside `src/app/api/checkout/route.ts`; swap it for an
  iyzico / PayTR / Stripe adapter and the rest of the flow ships as-is.
- **Blind-box fairness**: pull rates (3×18% / 2×13% / 12% / 8% = 100%) are displayed on the
  collection page, product page and FAQ — addressing the regulatory note in the marketing plan
  about transparent randomized-sale communication.

---

## Tech stack & why

| Choice | Why |
| --- | --- |
| **Next.js 15 (App Router) + TypeScript** | Static-rendered marketing pages for SEO + an API route for checkout in one deploy; image optimization for the heavy product photography |
| **Tailwind CSS v4** | The whole brand system (cream / sunflower yellow / leaf green / soil brown, soft shadows, rounded everything) lives as design tokens in `globals.css` `@theme` |
| **Framer Motion** | Spring physics for the bend (a tween would look robotic), scroll reveals, cart drawer, page micro-interactions |
| **Zustand** | Tiny persistent cart state without context boilerplate |
| **Baloo 2 + Nunito** (next/font) | The "rounded soft typography" called for in the brand identity, self-hosted with zero layout shift |

No database is required by design — the catalog is three SKUs in a typed module
(`src/lib/products.ts`). When the range grows, swap that module for a CMS or commerce backend
without touching the UI.

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # fonts, metadata, header/footer/cart shell
│   ├── page.tsx              # homepage
│   ├── globals.css           # Tailwind v4 theme = the brand design system
│   ├── shop/ collection/ guide/ about/
│   ├── product/[slug]/       # SSG product pages
│   ├── checkout/ + checkout/success/
│   ├── api/checkout/route.ts # validated, server-priced order endpoint
│   ├── icon.svg  not-found.tsx  robots.ts  sitemap.ts
├── components/
│   ├── FlowerArt.tsx         # ⭐ the 7 SVG companions + bend animation
│   ├── PomodoroDemo.tsx      # ⭐ working timer wired to the flower
│   ├── Hero.tsx  HowItWorks.tsx  CollectionPreview.tsx  FAQ.tsx
│   ├── Header.tsx  Footer.tsx  CartDrawer.tsx  Logo.tsx
│   ├── ProductCard.tsx  ProductGallery.tsx  AddToCartButton.tsx  Reveal.tsx
└── lib/
    ├── flowers.ts            # the 7 blooms: rarity, odds, personalities
    ├── products.ts           # SKUs & bundles
    ├── pricing.ts            # totals, discounts, shipping (client + server)
    ├── cart-store.ts         # persistent Zustand cart
    └── money.ts              # kuruş → ₺ formatting

public/products/              # the 7 product photographs
```

## Going to production for real

The storefront is deploy-ready (Vercel or any Node host). To take real money you'd:

1. Replace `simulatePayment()` with a PSP integration (iyzico is the natural fit for the
   Turkish launch market) and add 3-D Secure redirect handling.
2. Persist orders (the endpoint currently returns the order — point it at Postgres/Supabase).
3. Send the confirmation email (Resend/Postmark) where the success page promises one.
4. Add inventory counts to `products.ts` or move the catalog to a CMS.

Everything else — cart, totals, validation, discounts, the brand experience — already works.

---

*Demo storefront for the Releaf new-product-launch concept. Payments are simulated; no real
orders are taken. Ages 14+. Blind-box odds always sum to 100%.* 🌱
