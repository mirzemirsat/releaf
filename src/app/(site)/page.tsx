import Link from "next/link";
import Hero from "@/components/Hero";
import ReleafScrollBend from "@/components/ReleafScrollBend";
import HowItWorks from "@/components/HowItWorks";
import PomodoroDemo from "@/components/PomodoroDemo";
import ProductShowcase from "@/components/ProductShowcase";
import ProductCard from "@/components/ProductCard";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import PhotoStory from "@/components/home/PhotoStory";
import PhotoBand from "@/components/home/PhotoBand";
import { getContent, getCatalog, getFlowers } from "@/lib/content/store";

export default async function HomePage() {
  const [content, catalog, flowers] = await Promise.all([getContent(), getCatalog(), getFlowers()]);
  const c = content.home;

  return (
    <>
      <Hero c={c.hero} />

      {/* trust strip */}
      <div className="border-y border-cream-200 bg-cream-100/70">
        <div className="scroll-strip mx-auto flex max-w-6xl gap-8 overflow-x-auto px-4 py-4 sm:px-6">
          {c.trustStrip.map((item) => (
            <span key={item} className="shrink-0 font-display text-sm font-bold text-leaf-700">
              {item}
            </span>
          ))}
        </div>
      </div>

      <ReleafScrollBend
        c={c.scrollBend}
        chips={{ focus: c.hero.chipFocus, rest: c.hero.chipRest, float: c.hero.chipFloat }}
      />

      <HowItWorks c={c.howItWorks} />

      {/* break editorial band — wide lifestyle photo + statement */}
      <PhotoBand
        src="/photos/break.png"
        alt="A person pausing for coffee with their eyes closed, a Releaf sunflower companion and its box on the desk beside an open notebook"
        width={1672}
        height={941}
        eyebrow="Rest is the point"
        title={<>You don&apos;t need another notification.<br className="hidden sm:block" /> You need a cue you can <span className="text-sun-500">see</span>.</>}
        body="A phone reminder is easy to swipe away. A flower on your desk that's finished working is not. When the timer ends, the break becomes something you notice — and actually take."
        statementPlacement="above"
      />

      {/* interactive demo */}
      <section id="try-it" className="scroll-mt-24 bg-cream-100/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.demo.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">{c.demo.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft">{c.demo.body}</p>
          </Reveal>
          <div className="mt-12">
            <PomodoroDemo />
          </div>
        </div>
      </section>

      {/* what's in every box — flat-lay contents, photo left + copy right */}
      <PhotoStory
        src="/photos/box-contents.png"
        alt="Flat-lay of an opened Releaf box: the sunflower plush, the blind-box pouch, a collector card, a Pomodoro guide card and a 'meet your bloom' QR card on a cream surface"
        width={1122}
        height={1402}
        imageSide="left"
        size="medium"
        tilt={1}
        eyebrow="Open the box"
        title="A bloom for every moment — and a little ceremony"
        body="Every blind box holds your mystery plush with its in-pot Pomodoro timer, a collector card, the pocket Pomodoro guide, and a QR code to register your bloom. Half the joy is finding out which of the seven you got."
      />

      <ProductShowcase c={c.collectionPreview} flowers={flowers} />

      {/* why it's different */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.differences.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">
            {c.differences.titleLine1}
            <br className="hidden sm:block" /> {c.differences.titleLine2}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {c.differences.items.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.12}>
              <div className="h-full rounded-[2rem] border border-cream-200 bg-white/60 p-7">
                <span className="text-3xl">{d.icon}</span>
                <h3 className="mt-4 font-display text-xl font-bold text-leaf-800">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* collection band — the whole 7-bloom lineup */}
      <PhotoBand
        src="/photos/collection-lineup.png"
        alt="All seven Releaf plush flowers lined up in their beige pots beside the box: daisy, tulip, sunflower, lavender, hydrangea, lily and the black exotic bloom"
        width={1672}
        height={941}
        eyebrow="The collection"
        title={<>Seven companions. <span className="text-sun-500">One mystery</span> in every box.</>}
        body="Daisy, Tulip, Sunflower, Lavender, Hydrangea, Lily — and the ultra-rare Exotic. The same calm timer, seven different personalities for your desk."
        statementPlacement="above"
      />

      {/* shop teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.shopTeaser.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">{c.shopTeaser.title}</h2>
          </div>
          <Link href="/shop" className="font-display font-bold text-leaf-600 underline-offset-4 hover:underline">
            {c.shopTeaser.linkLabel}
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {catalog.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.1}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section className="bg-sun-100/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">{c.testimonials.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {c.testimonials.items.map((t, i) => (
              <Reveal key={`${i}-${t.name}`} delay={i * 0.12}>
                <figure className="flex h-full flex-col rounded-[2rem] bg-white/80 p-7 shadow-soft">
                  <p className="text-sun-500" aria-hidden>★★★★★</p>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="font-display font-bold text-leaf-800">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQ c={c.faq} />

      {/* gifting moment — social/emotional, photo right + copy left, before the CTA */}
      <PhotoStory
        src="/photos/gifting.png"
        alt="Two friends sitting together, one excitedly handing the other a Releaf box, a shelf of plush blooms glowing behind them"
        width={1672}
        height={941}
        imageSide="right"
        eyebrow="Giftable by design"
        title="The kind of gift people actually keep"
        body="Exam season, a new job, a friend who works too hard — Releaf is a small, thoughtful 'take care of yourself.' Buy two, gift one, and start a collection together."
      />

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="bg-speckle relative overflow-hidden rounded-[2.5rem] bg-leaf-800 px-8 py-14 text-center sm:py-16">
            <h2 className="font-display text-3xl font-extrabold text-cream-50 sm:text-4xl">{c.cta.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-leaf-200">{c.cta.body}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <AddToCartButton slug="releaf-blind-box" label={c.cta.primaryCta} size="lg" />
              <Link
                href="/collection"
                className="rounded-full border-2 border-leaf-500 px-7 py-3.5 font-display text-lg font-bold text-cream-100 transition hover:border-sun-300 hover:text-sun-300"
              >
                {c.cta.secondaryCta}
              </Link>
            </div>
            <p className="mt-6 font-display text-sm font-bold tracking-wide text-sun-300">{c.cta.slogan}</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
