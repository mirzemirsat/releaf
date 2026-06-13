"use client";

import { useEffect, useRef, useState } from "react";
import { calculateSectionProgress, clamp, smootherStep } from "@/lib/scroll-bend";
import SunnyPlant from "./SunnyPlant";
import type { SiteContent } from "@/lib/content/defaults";

/* ------------------------------------------------------------------ *
 * Sticky scroll section. Sunny (the one shared flower model) bends from
 * focus into rest as the section scrolls through the viewport.
 * ------------------------------------------------------------------ */

interface Props {
  c: SiteContent["home"]["scrollBend"];
  chips: { focus: string; rest: string; float: string };
}

export default function ReleafScrollBend({ c, chips }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  // Scroll → progress, throttled to one geometry update per animation frame.
  useEffect(() => {
    let frameRequested = false;
    const update = () => {
      frameRequested = false;
      if (!sectionRef.current) return;
      setProgress(calculateSectionProgress(sectionRef.current));
    };
    const onScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const renderedProgress = reduceMotion ? 0 : progress;
  // Scroll easing lives here; SunnyPlant maps bendProgress linearly to angle.
  const eased = smootherStep(renderedProgress);

  const focusChipOpacity = clamp(1 - renderedProgress * 2.2, 0, 1);
  const restChipOpacity = clamp((renderedProgress - 0.5) * 2.4, 0, 1);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: reduceMotion ? "100vh" : "230vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-cream-50">
        {/* themed background — focus → rest cross-fade */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 50% 12%, #f1f5e9 0%, #e3edd2 60%, #d6e3bf 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: eased,
            background: "radial-gradient(120% 90% at 50% 12%, #fdefc5 0%, #f8e2a0 55%, #f1d287 100%)",
          }}
        />
        <div className="bg-speckle absolute inset-0 opacity-60" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6">
          <div className="pt-12 text-center sm:pt-16">
            <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">
              {c.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl lg:text-5xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {c.body}
            </p>
          </div>

          {/* plant stage */}
          <div className="relative mx-auto w-full max-w-[520px] flex-1">
            <SunnyPlant bendProgress={eased} frame="wide" className="h-full w-full" />

            {/* fixed interface labels — never bend or rotate with the plant */}
            <div
              className="pointer-events-none absolute left-2 top-[14%] rounded-2xl bg-white px-3.5 py-2 font-display text-xs font-bold text-leaf-800 shadow-soft transition-opacity duration-300 sm:left-6 sm:text-sm"
              style={{ opacity: focusChipOpacity }}
            >
              {chips.focus}
            </div>
            <div
              className="pointer-events-none absolute right-2 top-[12%] rounded-2xl bg-tulip px-3.5 py-2 font-display text-xs font-bold text-cream-50 shadow-soft transition-opacity duration-300 sm:right-6 sm:text-sm"
              style={{ opacity: restChipOpacity }}
            >
              {chips.rest}
            </div>
            <div className="pointer-events-none absolute bottom-[16%] right-1 rounded-2xl bg-white px-3.5 py-2 font-display text-xs font-bold text-leaf-800 shadow-soft sm:right-4 sm:text-sm">
              {chips.float}
            </div>
          </div>

          {/* state pill + scroll hint */}
          <div className="flex items-center justify-center gap-3 pb-10">
            <span
              className="rounded-full px-4 py-1.5 font-display text-sm font-bold transition-colors duration-300"
              style={{
                backgroundColor: eased > 0.5 ? "var(--color-tulip)" : "var(--color-leaf-700)",
                color: "#fcf8ee",
              }}
            >
              {eased > 0.5 ? c.restLabel : c.focusLabel}
            </span>
            {renderedProgress < 0.06 && !reduceMotion && (
              <span className="animate-float font-display text-sm font-semibold text-ink-soft">
                {c.scrollHint} ↓
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
