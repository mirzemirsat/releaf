"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Flower, FlowerSpecies } from "@/lib/flowers";
import type { SiteContent } from "@/lib/content/defaults";

/* ------------------------------------------------------------------ */
/* Per-bloom theming                                                   */
/* Backgrounds + accents are presentation; all product data (name,     */
/* scientific name, rarity, odds, image) comes from the flower props.  */
/* ------------------------------------------------------------------ */

interface Theme {
  bg: string;
  accent: string;
  glow: string;
  dark?: boolean;
  rays?: boolean;
}

const THEMES: Record<FlowerSpecies, Theme> = {
  sunflower: {
    bg: "radial-gradient(120% 95% at 50% -15%, #fdf4d4 0%, #f8e7ae 45%, #f1d68f 100%)",
    accent: "#c47f0e",
    glow: "rgba(244,188,69,0.55)",
    rays: true,
  },
  daisy: {
    bg: "radial-gradient(120% 95% at 50% -15%, #fffef8 0%, #fbf3dc 50%, #f2e6c7 100%)",
    accent: "#b0892c",
    glow: "rgba(233,211,167,0.65)",
  },
  tulip: {
    bg: "radial-gradient(120% 95% at 50% -15%, #fdeee8 0%, #f8dcd2 50%, #f1c8bb 100%)",
    accent: "#c8533a",
    glow: "rgba(226,101,74,0.38)",
  },
  lavender: {
    bg: "radial-gradient(120% 95% at 50% -15%, #f3eefc 0%, #e4dcf6 50%, #d4c8f0 100%)",
    accent: "#6d56b3",
    glow: "rgba(156,134,216,0.45)",
  },
  hydrangea: {
    bg: "radial-gradient(120% 95% at 50% -15%, #eeecfb 0%, #dcd9f3 50%, #cbc7ee 100%)",
    accent: "#5648ab",
    glow: "rgba(110,98,198,0.42)",
  },
  lily: {
    bg: "radial-gradient(120% 95% at 50% -15%, #fdf0f5 0%, #f8dce7 50%, #f1cad9 100%)",
    accent: "#c26288",
    glow: "rgba(243,204,214,0.7)",
  },
  exotic: {
    bg: "radial-gradient(120% 95% at 50% -15%, #3d4334 0%, #2c3127 55%, #1e221a 100%)",
    accent: "#f4bc45",
    glow: "rgba(244,188,69,0.28)",
    dark: true,
    rays: true,
  },
};

/* A simple low-opacity flower silhouette for the "garden shadow" base. */
function Silhouette({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden fill={color}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="30" cy="20" rx="7" ry="13" transform={`rotate(${deg} 30 34)`} />
      ))}
      <circle cx="30" cy="34" r="9" />
      <rect x="27.5" y="40" width="5" height="80" rx="2.5" />
    </svg>
  );
}

const imageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 90 : -90, scale: 0.94 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -90 : 90, scale: 0.94 }),
};

export default function ProductShowcase({
  c,
  flowers,
}: {
  c: SiteContent["home"]["collectionPreview"];
  flowers: Flower[];
}) {
  const count = flowers.length;
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const index = ((page % count) + count) % count;
  const flower = flowers[index];
  const theme = THEMES[flower.species];

  // Functional updaters so rapid clicks accumulate from the latest page.
  const paginate = (dir: number) => setPage(([p]) => [p + dir, dir]);
  const goTo = (i: number) =>
    setPage(([p]) => {
      const cur = ((p % count) + count) % count;
      if (i === cur) return [p, 0];
      return [p + (i - cur), i > cur ? 1 : -1];
    });

  const ink = theme.dark ? "#f5ecd6" : "#2f3a26";
  const inkMuted = theme.dark ? "rgba(245,236,214,0.72)" : "rgba(79,87,71,0.85)";
  const inactiveDot = theme.dark ? "rgba(245,236,214,0.3)" : "rgba(47,58,38,0.18)";

  return (
    <section className="relative overflow-hidden">
      {/* themed background — cross-fades on every change */}
      <AnimatePresence initial={false}>
        <motion.div
          key={flower.species}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: theme.bg }}
        >
          {theme.rays && (
            <div
              className="absolute inset-x-0 top-0 h-[70%]"
              style={{
                background:
                  "repeating-conic-gradient(from 90deg at 50% -8%, rgba(255,251,231,0.55) 0deg 3.5deg, transparent 3.5deg 13deg)",
                maskImage: "radial-gradient(70% 80% at 50% 0%, #000 0%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(70% 80% at 50% 0%, #000 0%, transparent 72%)",
                opacity: theme.dark ? 0.25 : 0.5,
              }}
            />
          )}
          {/* faint garden-shadow silhouettes along the bottom */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 opacity-[0.07]">
            {Array.from({ length: 9 }).map((_, i) => (
              <Silhouette
                key={i}
                color={theme.dark ? "#f5ecd6" : "#2f3a26"}
                className="h-24 w-12 sm:h-32 sm:w-16"
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        {/* heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="font-display text-sm font-bold uppercase tracking-[0.18em] transition-colors duration-700"
              style={{ color: theme.accent }}
            >
              {c.eyebrow}
            </p>
            <h2
              className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: "var(--font-serif)", color: ink }}
            >
              {c.titleLead}{" "}
              <span className="transition-colors duration-700" style={{ color: theme.accent }}>
                {c.titleHighlight}
              </span>
            </h2>
          </div>
          <Link
            href="/collection"
            className="rounded-full border px-5 py-2.5 font-display text-sm font-bold transition-colors duration-700 hover:opacity-80"
            style={{ borderColor: theme.accent, color: theme.accent }}
          >
            {c.ctaLabel}
          </Link>
        </div>

        {/* carousel */}
        <div className="mt-10 flex items-center justify-center gap-3 sm:gap-6 lg:gap-10">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous bloom"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/75 text-[#2f3a26] shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {/* image stage */}
          <div className="relative aspect-[4/5] w-[260px] shrink-0 sm:w-[330px] lg:w-[380px]">
            {/* glow behind the product */}
            <div
              className="absolute inset-[8%] -z-0 rounded-full blur-3xl transition-colors duration-700"
              style={{ backgroundColor: theme.glow }}
            />
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={flower.species}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={flower.image}
                  alt={`${flower.name} plush companion with its blind box`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 80vw, 380px"
                  className="object-contain drop-shadow-[0_24px_36px_rgba(70,48,29,0.22)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => paginate(1)}
            aria-label="Next bloom"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/75 text-[#2f3a26] shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* product info — fades on change */}
        <div className="relative mx-auto mt-8 min-h-[150px] max-w-md text-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={flower.species}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "var(--font-serif)", color: ink }}>
                  {flower.nickname && flower.nickname !== "???" ? flower.nickname : flower.name}
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: theme.accent + "26", color: theme.dark ? "#fbe6b0" : theme.accent }}
                >
                  {flower.rarity}
                </span>
              </div>
              <p className="mt-1 text-base italic" style={{ fontFamily: "var(--font-serif)", color: theme.accent }}>
                {flower.scientificName}
              </p>

              {/* rarity / pull-chance meter */}
              <div className="mx-auto mt-5 max-w-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: inkMuted }}>
                  <span>{c.rarityLabel}</span>
                  <span>
                    {flower.odds}% {c.pullChanceSuffix}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: theme.dark ? "rgba(245,236,214,0.18)" : "rgba(47,58,38,0.1)" }}>
                  <motion.div
                    key={flower.species + "-bar"}
                    initial={{ width: 0 }}
                    animate={{ width: `${flower.odds}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </div>

              <Link
                href="/collection"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-6 py-3 font-display font-bold text-[#2f3a26] shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lift"
              >
                {c.detailsLabel}
                <span aria-hidden style={{ color: theme.accent }}>→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* dots */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {flowers.map((f, i) => (
            <button
              key={f.species}
              onClick={() => goTo(i)}
              aria-label={`Go to ${f.name}`}
              aria-current={i === index}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 28 : 10,
                backgroundColor: i === index ? theme.accent : inactiveDot,
              }}
            />
          ))}
        </div>

        {/* fairness note */}
        <p className="mt-8 text-center text-sm" style={{ color: inkMuted }}>
          {c.oddsNote}{" "}
          <Link href="/collection#odds" className="font-semibold underline underline-offset-2" style={{ color: theme.accent }}>
            {c.oddsLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
