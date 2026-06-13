"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useGlobalContent } from "./SiteChromeProvider";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/product/releaf-blind-box", label: "Blind Box" },
      { href: "/product/focus-trio", label: "Focus Trio" },
      { href: "/product/full-garden", label: "The Full Garden" },
      { href: "/collection", label: "The 7 Blooms" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/guide", label: "Pomodoro Guide" },
      { href: "/#how-it-works", label: "How Releaf works" },
      { href: "/collection#odds", label: "Pull rates & fairness" },
      { href: "/about", label: "Our story" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/about#contact", label: "Contact us" },
      { href: "/#faq", label: "Shipping & returns" },
      { href: "/#faq", label: "Warranty" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { footer } = useGlobalContent();

  return (
    <footer className="mt-24 border-t border-cream-200 bg-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              {footer.blurb}{" "}
              <span className="font-display font-bold text-leaf-700">{footer.sloganLine}</span>
            </p>
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubscribed(true);
              }}
            >
              <p className="font-display text-sm font-bold text-leaf-800">{footer.newsletterTitle}</p>
              {subscribed ? (
                <p className="mt-2 rounded-2xl bg-leaf-100 px-4 py-2.5 text-sm font-semibold text-leaf-700">
                  {footer.newsletterThanks}
                </p>
              ) : (
                <div className="mt-2 flex max-w-xs gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu.tr"
                    className="w-full rounded-full border border-cream-300 bg-white px-4 py-2 text-sm outline-none focus:border-leaf-400"
                  />
                  <button className="shrink-0 rounded-full bg-leaf-700 px-4 py-2 text-sm font-bold text-cream-50 hover:bg-leaf-600">
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-display font-bold text-leaf-800">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ink-soft transition hover:text-leaf-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream-200 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.bottomNote}</p>
          <p className="flex items-center gap-3">
            {footer.bottomNote2}
            <Link href="/admin" className="font-semibold text-leaf-600 underline-offset-2 hover:underline">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
