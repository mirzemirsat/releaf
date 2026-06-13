"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-store";
import { computeTotals } from "@/lib/pricing";
import { useGlobalContent } from "./SiteChromeProvider";

export default function Header() {
  const pathname = usePathname();
  const NAV = useGlobalContent().nav;
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? computeTotals(items).itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 font-display text-sm font-semibold transition hover:bg-cream-100 hover:text-leaf-800 ${
                pathname === item.href ? "text-leaf-800" : "text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-full bg-leaf-700 px-4 py-2 font-display text-sm font-bold text-cream-50 shadow-soft transition hover:bg-leaf-600"
            aria-label={`Open cart, ${count} items`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l-1.2 12.1a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            Cart
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-400 px-1 text-xs font-extrabold text-leaf-900">
                {count}
              </span>
            )}
          </button>

          <button
            className="rounded-full p-2 text-leaf-700 hover:bg-cream-100 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-cream-200 bg-cream-50 px-4 py-3 md:hidden" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2.5 font-display font-semibold text-leaf-800 hover:bg-cream-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
