import type { Metadata } from "next";
import Link from "next/link";
import FlowerArt from "@/components/FlowerArt";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "The Pomodoro Guide",
  description:
    "How the Pomodoro technique works, why breaks are the hard part, and how to build a sustainable focus rhythm with Releaf.",
};

export default async function GuidePage() {
  const content = await getContent();
  const c = content.guidePage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-leaf-800 sm:text-5xl">
            {c.titleA}
            <br />
            <span className="text-sun-500">{c.titleB}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{c.intro}</p>
        </Reveal>
        <Reveal delay={0.15} className="mx-auto w-full max-w-xs">
          <FlowerArt species="lavender" className="w-full" />
        </Reveal>
      </div>

      {/* the rhythm */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-leaf-800 sm:text-3xl">{c.stepsTitle}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {c.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="flex h-full gap-5 rounded-[1.75rem] bg-white/70 p-6 shadow-soft">
                <span className="font-display text-3xl font-extrabold text-sun-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-leaf-800">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* why the break is the point */}
      <section className="mt-16">
        <Reveal>
          <div className="bg-speckle rounded-[2.5rem] bg-leaf-800 p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[0.6fr_1.4fr]">
              <FlowerArt species="sunflower" pose="bent" animated={false} className="mx-auto w-48" />
              <div>
                <h2 className="font-display text-2xl font-extrabold text-cream-50 sm:text-3xl">{c.whyTitle}</h2>
                <p className="mt-4 leading-relaxed text-leaf-200">{c.whyP1}</p>
                <p className="mt-4 leading-relaxed text-leaf-200">{c.whyP2}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* tips */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-leaf-800 sm:text-3xl">{c.tipsTitle}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.tips.map((tip, i) => (
            <Reveal key={tip.title} delay={i * 0.08}>
              <div className="h-full rounded-[1.75rem] border border-cream-200 bg-white/60 p-6">
                <span className="text-2xl">{tip.icon}</span>
                <h3 className="mt-3 font-display font-bold text-leaf-800">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tip.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mt-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-extrabold text-leaf-800">{c.ctaTitle}</h2>
          <p className="mt-3 text-ink-soft">
            {c.ctaBody}{" "}
            <Link href="/#try-it" className="font-bold text-leaf-600 underline underline-offset-4">
              Try the interactive demo →
            </Link>
          </p>
          <div className="mt-6">
            <AddToCartButton slug="releaf-blind-box" label={c.ctaButton} size="lg" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
