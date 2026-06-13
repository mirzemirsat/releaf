"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { computeTotals, findDiscount } from "@/lib/pricing";
import { formatTRY } from "@/lib/money";
import FlowerArt from "./FlowerArt";
import { useProductDisplay } from "./SiteChromeProvider";

export default function CartDrawer() {
  const { items, code, isOpen, closeCart, setQty, remove, applyCode } = useCart();
  const display = useProductDisplay();
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  const totals = computeTotals(items, code);

  const tryApply = () => {
    const match = findDiscount(codeInput);
    if (match) {
      applyCode(match.code);
      setCodeError(null);
      setCodeInput("");
    } else {
      setCodeError("That code doesn't look right. Try STUDENT15 if you're studying!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-leaf-900/40 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream-50 shadow-lift"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
              <h2 className="font-display text-xl font-bold text-leaf-800">Your garden cart</h2>
              <button onClick={closeCart} className="rounded-full p-2 text-ink-soft hover:bg-cream-100" aria-label="Close cart">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {totals.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <FlowerArt species="daisy" pose="bent" animated={false} className="w-40 opacity-80" />
                <p className="font-display text-lg font-bold text-leaf-800">Your cart is having a little rest.</p>
                <p className="text-sm text-ink-soft">Wake it up with a mystery bloom.</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="rounded-full bg-sun-400 px-6 py-3 font-display font-bold text-leaf-900 shadow-soft transition hover:bg-sun-300"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {totals.freeShippingGap > 0 ? (
                    <p className="mb-4 rounded-2xl bg-leaf-100 px-4 py-2.5 text-sm font-semibold text-leaf-700">
                      🌱 {formatTRY(totals.freeShippingGap)} away from free shipping
                    </p>
                  ) : (
                    <p className="mb-4 rounded-2xl bg-leaf-100 px-4 py-2.5 text-sm font-semibold text-leaf-700">
                      🎉 Your order ships free
                    </p>
                  )}

                  <ul className="space-y-4">
                    {totals.lines.map((line) => {
                      const shown = display[line.slug] ?? { name: line.name, image: line.image };
                      return (
                      <li key={line.slug} className="flex gap-4 rounded-3xl bg-white/60 p-3 shadow-soft">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
                          <Image src={shown.image} alt={shown.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display font-bold leading-tight text-leaf-800">{shown.name}</p>
                            <button
                              onClick={() => remove(line.slug)}
                              className="text-xs font-semibold text-ink-soft underline-offset-2 hover:text-tulip hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="mt-0.5 text-sm text-ink-soft">{formatTRY(line.unitPrice)} each</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-cream-300 bg-cream-50">
                              <button
                                onClick={() => setQty(line.slug, line.qty - 1)}
                                className="px-3 py-1 font-bold text-leaf-700 hover:text-leaf-500"
                                aria-label={`Decrease ${line.name} quantity`}
                              >
                                −
                              </button>
                              <span className="min-w-6 text-center text-sm font-bold tabular-nums">{line.qty}</span>
                              <button
                                onClick={() => setQty(line.slug, line.qty + 1)}
                                className="px-3 py-1 font-bold text-leaf-700 hover:text-leaf-500"
                                aria-label={`Increase ${line.name} quantity`}
                              >
                                +
                              </button>
                            </div>
                            <span className="font-display font-bold text-leaf-800">{formatTRY(line.lineTotal)}</span>
                          </div>
                        </div>
                      </li>
                      );
                    })}
                  </ul>

                  {/* discount code */}
                  <div className="mt-5">
                    {totals.discountLabel ? (
                      <div className="flex items-center justify-between rounded-2xl bg-sun-100 px-4 py-2.5 text-sm font-semibold text-sun-700">
                        <span>✓ {totals.discountLabel} applied</span>
                        <button onClick={() => applyCode(null)} className="underline underline-offset-2">
                          remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && tryApply()}
                            placeholder="Discount code (try STUDENT15)"
                            className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus:border-leaf-400"
                          />
                          <button
                            onClick={tryApply}
                            className="rounded-full bg-leaf-700 px-5 text-sm font-bold text-cream-50 hover:bg-leaf-600"
                          >
                            Apply
                          </button>
                        </div>
                        {codeError && <p className="mt-2 text-xs font-semibold text-tulip">{codeError}</p>}
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-cream-200 px-5 py-4">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Subtotal</dt>
                      <dd className="font-semibold">{formatTRY(totals.subtotal)}</dd>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-leaf-600">
                        <dt>Discount</dt>
                        <dd className="font-semibold">−{formatTRY(totals.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Shipping</dt>
                      <dd className="font-semibold">{totals.shipping === 0 ? "Free" : formatTRY(totals.shipping)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-cream-200 pt-2 font-display text-lg font-bold text-leaf-800">
                      <dt>Total</dt>
                      <dd>{formatTRY(totals.total)}</dd>
                    </div>
                  </dl>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 block rounded-full bg-sun-400 py-3.5 text-center font-display text-lg font-bold text-leaf-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-sun-300 hover:shadow-lift"
                  >
                    Checkout · {formatTRY(totals.total)}
                  </Link>
                  <p className="mt-3 text-center text-xs text-ink-soft">
                    Free shipping over ₺1.500 · 2-year mechanism warranty · 14-day returns
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
