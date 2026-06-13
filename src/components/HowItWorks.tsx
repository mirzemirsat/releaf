import SunnyPlant from "./SunnyPlant";
import Reveal from "./Reveal";
import type { SiteContent } from "@/lib/content/defaults";

/**
 * The three states of the SAME Sunny — fixed; card copy/icons are editable.
 * Card 1: upright (focus). Card 2: fully bent (rest), using the real
 * cantilever physics. Card 3: upright again (focus).
 */
const STEP_PLANT: {
  bend: number;
  frame: "tight" | "wide";
  expression: "focus" | "rest";
  box: string;
}[] = [
  { bend: 0, frame: "tight", expression: "focus", box: "h-40 w-40" },
  { bend: 1, frame: "wide", expression: "rest", box: "h-40 w-56" },
  { bend: 0, frame: "tight", expression: "focus", box: "h-40 w-40" },
];

export default function HowItWorks({ c }: { c: SiteContent["home"]["howItWorks"] }) {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <Reveal className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">
          {c.titleA} <span className="text-sun-500">{c.titleB}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-ink-soft">{c.body}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {c.steps.map((step, i) => {
          const plant = STEP_PLANT[i % STEP_PLANT.length];
          return (
            <Reveal key={step.title} delay={i * 0.12}>
              <div className="group h-full rounded-[2rem] bg-white/70 p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="relative mx-auto flex h-44 items-center justify-center">
                  <div className="absolute inset-x-8 inset-y-4 -z-10 rounded-full bg-cream-100 blur-xl" />
                  <div className={`relative ${plant.box}`}>
                    <SunnyPlant
                      bendProgress={plant.bend}
                      frame={plant.frame}
                      expression={plant.expression}
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun-100 text-lg">{step.icon}</span>
                  <h3 className="font-display text-xl font-bold text-leaf-800">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
