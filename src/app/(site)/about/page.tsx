import type { Metadata } from "next";
import Link from "next/link";
import FlowerArt from "@/components/FlowerArt";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Releaf exists to make healthy work and study habits feel natural — by turning the moment of rest into something visible, friendly, and easy to act on.",
};

export default async function AboutPage() {
  const content = await getContent();
  const c = content.aboutPage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-leaf-800 sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{c.p1}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{c.p2}</p>
        </Reveal>
        <Reveal delay={0.15} className="mx-auto w-full max-w-xs">
          <FlowerArt species="tulip" className="w-full" />
        </Reveal>
      </div>

      {/* mission */}
      <Reveal className="mt-16">
        <div className="bg-speckle rounded-[2.5rem] bg-leaf-800 px-8 py-12 text-center sm:px-16">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-300">{c.missionEyebrow}</p>
          <blockquote className="mx-auto mt-4 max-w-3xl font-display text-2xl font-bold leading-snug text-cream-50 sm:text-3xl">
            {c.missionQuote}
          </blockquote>
        </div>
      </Reveal>

      {/* values */}
      <section className="mt-16">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold text-leaf-800">{c.valuesTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {c.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-[2rem] bg-white/70 p-7 shadow-soft">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-leaf-800">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="mt-16 scroll-mt-24">
        <Reveal>
          <div className="rounded-[2.5rem] border border-cream-200 bg-white/60 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-extrabold text-leaf-800">{c.contactTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">{c.contactBody}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-display font-bold text-leaf-700">
              <a href={`mailto:${c.contactEmail}`} className="rounded-full bg-cream-100 px-5 py-2.5 transition hover:bg-cream-200">
                {c.contactEmail}
              </a>
              <span className="rounded-full bg-cream-100 px-5 py-2.5">{c.contactSocial}</span>
            </div>
            <p className="mt-6 text-sm text-ink-soft">
              Or start where everyone starts:{" "}
              <Link href="/shop" className="font-bold text-leaf-600 underline underline-offset-4">
                your first blind box
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
