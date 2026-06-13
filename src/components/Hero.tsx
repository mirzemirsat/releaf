"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";
import PhotoFrame from "./PhotoFrame";
import type { SiteContent } from "@/lib/content/defaults";

/**
 * Hero — copy on the left, the real product photograph on the right.
 * (The illustrated Sunny, its pot, leaves, shadow and the floating timer /
 * mystery-bloom chips were removed; the photo is the product reveal now.)
 */
export default function Hero({ c }: { c: SiteContent["home"]["hero"] }) {
  return (
    <section className="bg-speckle relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-1.5 font-display text-sm font-bold text-leaf-700"
          >
            {c.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.08] text-leaf-800 sm:text-5xl lg:text-6xl"
          >
            {c.titleLead} <span className="text-sun-500">{c.titleStand}</span> {c.titleMid}{" "}
            <span className="text-tulip">{c.titleBend}</span> {c.titleTail}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {c.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <AddToCartButton slug="releaf-blind-box" label={c.primaryCta} size="lg" />
            <Link
              href="/#try-it"
              className="rounded-full border-2 border-leaf-300 px-7 py-3.5 font-display text-lg font-bold text-leaf-700 transition hover:border-leaf-500 hover:bg-leaf-50"
            >
              {c.secondaryCta}
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm font-semibold text-ink-soft"
          >
            {c.trustLine}
          </motion.p>
        </div>

        {/* Product photograph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.21, 0.65, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* subtle pale-green glow for separation from the cream background */}
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-leaf-100/70 blur-2xl" />
          <PhotoFrame
            src="/photos/hero-unboxing.png"
            alt="A smiling person opening a Releaf blind box and lifting out the pink Lily plush desk companion"
            width={1122}
            height={1402}
            size="hero"
            mat
            tilt={-1.2}
            priority
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </motion.div>
      </div>
    </section>
  );
}
