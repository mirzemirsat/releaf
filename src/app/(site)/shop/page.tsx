import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getContent, getCatalog } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Releaf blind boxes, the Focus Trio bundle (buy 2 gift 1) and the Full Garden set. Free shipping in Turkey over ₺1.500.",
};

export default async function ShopPage() {
  const [content, catalog] = await Promise.all([getContent(), getCatalog()]);
  const c = content.shopPage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-leaf-800 sm:text-5xl">
          {c.titleA} <span className="text-sun-500">{c.titleB}</span>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{c.sub}</p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-sun-100 px-6 py-4 text-center">
          <span className="font-display font-bold text-sun-700">{c.bannerTitle}</span>
          <span className="text-sm font-semibold text-sun-700">{c.bannerBody}</span>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-7 md:grid-cols-3">
        {catalog.map((product, i) => (
          <Reveal key={product.slug} delay={i * 0.1}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="grid gap-6 rounded-[2.5rem] border border-cream-200 bg-white/60 p-8 sm:grid-cols-3 sm:p-10">
          {c.perks.map((perk) => (
            <div key={perk.title}>
              <p className="text-2xl">{perk.icon}</p>
              <h3 className="mt-2 font-display font-bold text-leaf-800">{perk.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{perk.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
