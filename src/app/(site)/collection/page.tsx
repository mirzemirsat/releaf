import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RARITY_STYLES } from "@/lib/flowers";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { getContent, getFlowers } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "The Collection — 7 blooms",
  description:
    "Meet all seven Releaf blooms: Sunny, Dia, Tülin, Lale, Hira, Lili and the ultra-rare Exotic. Full blind box pull rates, disclosed openly.",
};

export default async function CollectionPage() {
  const [content, flowers] = await Promise.all([getContent(), getFlowers()]);
  const c = content.collectionPage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-leaf-800 sm:text-5xl">
          {c.titleLine1}
          <br />
          {c.titleLine2}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{c.sub}</p>
      </Reveal>

      <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {flowers.map((flower, i) => (
          <Reveal key={flower.species} delay={(i % 3) * 0.1}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white/80 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                <Image
                  src={flower.image}
                  alt={`${flower.name} plush companion with its blind box`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 font-display text-xs font-bold shadow-soft ${RARITY_STYLES[flower.rarity]}`}
                >
                  {flower.rarity}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 font-display text-xs font-bold text-leaf-800 shadow-soft">
                  {flower.odds}% pull rate
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl font-bold text-leaf-800">{flower.name}</h2>
                <p className="font-display text-sm font-semibold text-sun-600">{flower.mood}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{flower.bio}</p>
              </div>
            </article>
          </Reveal>
        ))}

        {/* CTA card to complete the grid */}
        <Reveal delay={0.1}>
          <div className="bg-speckle flex h-full flex-col items-center justify-center rounded-[2rem] bg-leaf-800 p-8 text-center shadow-soft">
            <p className="font-display text-2xl font-extrabold text-cream-50">{c.luckyTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-leaf-200">{c.luckyBody}</p>
            <div className="mt-6">
              <AddToCartButton slug="releaf-blind-box" label={c.luckyCta} />
            </div>
            <Link href="/product/full-garden" className="mt-4 text-sm font-bold text-sun-300 underline underline-offset-4">
              {c.luckyLink}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* odds & fairness */}
      <section id="odds" className="mt-20 scroll-mt-24">
        <Reveal>
          <div className="rounded-[2.5rem] border border-cream-200 bg-white/70 p-8 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-extrabold text-leaf-800 sm:text-3xl">{c.oddsTitle}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.oddsBody}</p>
              </div>
              <table className="w-full max-w-sm overflow-hidden rounded-2xl text-sm">
                <thead>
                  <tr className="bg-leaf-700 text-left font-display text-cream-50">
                    <th className="px-4 py-2.5">Bloom</th>
                    <th className="px-4 py-2.5">Rarity</th>
                    <th className="px-4 py-2.5 text-right">Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {flowers.map((f, i) => (
                    <tr key={f.species} className={i % 2 ? "bg-cream-100/70" : "bg-cream-50"}>
                      <td className="px-4 py-2.5 font-semibold text-leaf-800">{f.name}</td>
                      <td className="px-4 py-2.5 text-ink-soft">{f.rarity}</td>
                      <td className="px-4 py-2.5 text-right font-bold tabular-nums text-leaf-800">{f.odds}%</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-leaf-200 bg-cream-50">
                    <td className="px-4 py-2.5 font-display font-bold text-leaf-800" colSpan={2}>Total</td>
                    <td className="px-4 py-2.5 text-right font-display font-bold text-leaf-800">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
