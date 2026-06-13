import Reveal from "./Reveal";
import type { SiteContent } from "@/lib/content/defaults";

export default function FAQ({ c }: { c: SiteContent["home"]["faq"] }) {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-20 sm:px-6">
      <Reveal className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{c.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">{c.title}</h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {c.items.map((item, i) => (
          <Reveal key={`${i}-${item.q}`} delay={i * 0.05}>
            <details className="group rounded-3xl bg-white/80 shadow-soft open:shadow-lift">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-display text-lg font-bold text-leaf-800 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="shrink-0 text-sun-500 transition-transform duration-300 group-open:rotate-45">＋</span>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
