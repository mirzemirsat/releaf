import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { formatTRY } from "@/lib/money";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import Reveal from "@/components/Reveal";
import { getCatalog, getFlowers } from "@/lib/content/store";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getCatalog()).find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.tagline}. ${product.description}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [catalog, flowers] = await Promise.all([getCatalog(), getFlowers()]);
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const others = catalog.filter((p) => p.slug !== product.slug);
  const isBlindBox = product.slug === "releaf-blind-box";
  const savings = product.compareAt ? product.compareAt - product.price : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-leaf-700">Shop</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-leaf-800">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.gallery} name={product.name} />

        <div>
          {product.badge && (
            <span className="rounded-full bg-sun-100 px-4 py-1.5 font-display text-sm font-bold text-sun-700">
              {product.badge}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-extrabold text-leaf-800">{product.name}</h1>
          <p className="mt-1 font-display text-lg font-semibold text-sun-600">{product.tagline}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="font-display text-3xl font-extrabold text-leaf-800">{formatTRY(product.price)}</p>
            {product.compareAt && (
              <>
                <p className="text-lg font-semibold text-ink-soft line-through">{formatTRY(product.compareAt)}</p>
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-bold text-leaf-700">
                  Save {formatTRY(savings)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <AddToCartButton slug={product.slug} label={`Add to cart · ${formatTRY(product.price)}`} size="lg" />
          </div>

          <p className="mt-4 rounded-2xl bg-leaf-100 px-4 py-3 text-sm font-semibold text-leaf-700">
            💡 {product.highlight}
          </p>

          {/* what's in the box */}
          <div className="mt-8 rounded-[1.75rem] border border-cream-200 bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-leaf-800">What&apos;s in the box</h2>
            <ul className="mt-3 space-y-2">
              {product.contents.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-ink-soft">
                  <span className="text-leaf-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {isBlindBox && (
            <div className="mt-5 rounded-[1.75rem] border border-cream-200 bg-white/60 p-6">
              <h2 className="font-display text-lg font-bold text-leaf-800">Pull rates (printed on every box)</h2>
              <div className="mt-4 space-y-2.5">
                {flowers.map((f) => (
                  <div key={f.species} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 truncate font-semibold text-leaf-800">{f.name}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${f.odds * 4}%`, backgroundColor: f.species === "daisy" ? "#e9d3a7" : f.color }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold tabular-nums text-ink-soft">{f.odds}%</span>
                  </div>
                ))}
              </div>
              <Link href="/collection#odds" className="mt-4 inline-block text-sm font-bold text-leaf-600 underline underline-offset-4">
                Read the full fairness policy →
              </Link>
            </div>
          )}

          {/* specs */}
          <div className="mt-5 rounded-[1.75rem] border border-cream-200 bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-leaf-800">The details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><dt className="font-semibold text-leaf-800">Height</dt><dd className="text-ink-soft">25 cm, pot included</dd></div>
              <div><dt className="font-semibold text-leaf-800">Timer</dt><dd className="text-ink-soft">25/5, 50/10 &amp; custom</dd></div>
              <div><dt className="font-semibold text-leaf-800">Battery</dt><dd className="text-ink-soft">USB-C, 8+ weeks per charge</dd></div>
              <div><dt className="font-semibold text-leaf-800">Materials</dt><dd className="text-ink-soft">Recycled-fiber plush, washable cover</dd></div>
              <div><dt className="font-semibold text-leaf-800">Age</dt><dd className="text-ink-soft">14+ (small parts)</dd></div>
              <div><dt className="font-semibold text-leaf-800">Warranty</dt><dd className="text-ink-soft">2 years on the mechanism</dd></div>
            </dl>
          </div>
        </div>
      </div>

      {/* cross-sell */}
      <section className="mt-20">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-leaf-800">Goes well with</h2>
        </Reveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
