"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { computeTotals, findDiscount } from "@/lib/pricing";
import { formatTRY } from "@/lib/money";
import FlowerArt from "@/components/FlowerArt";

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, code, clear, applyCode } = useCart();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [codeInput, setCodeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const totals = computeTotals(items, code);

  if (!mounted) {
    return <div className="mx-auto max-w-6xl px-4 py-24 text-center text-ink-soft">Loading your cart…</div>;
  }

  if (totals.lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <FlowerArt species="daisy" pose="bent" animated={false} className="w-44 opacity-80" />
        <h1 className="mt-6 font-display text-3xl font-extrabold text-leaf-800">Nothing to check out yet</h1>
        <p className="mt-3 text-ink-soft">Your cart is empty — every garden starts with a single box.</p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-sun-400 px-7 py-3.5 font-display text-lg font-bold text-leaf-900 shadow-soft transition hover:bg-sun-300"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (field === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (field === "cvc") value = value.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "That email doesn't look right.";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Please enter a valid phone number.";
    if (form.address.trim().length < 10) next.address = "Please enter your full address.";
    if (!form.city.trim()) next.city = "Required.";
    if (!/^\d{5}$/.test(form.postalCode.trim())) next.postalCode = "5 digits.";
    if (form.cardName.trim().length < 3) next.cardName = "Name on card.";
    if (form.cardNumber.replace(/\s/g, "").length !== 16) next.cardNumber = "16-digit card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) next.expiry = "MM/YY.";
    if (form.cvc.length < 3) next.cvc = "3–4 digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          code,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      sessionStorage.setItem("releaf-last-order", JSON.stringify(data));
      clear();
      router.push("/checkout/success");
    } catch {
      setServerError("We couldn't reach the store. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const tryApplyCode = () => {
    const match = findDiscount(codeInput);
    if (match) {
      applyCode(match.code);
      setCodeInput("");
    }
  };

  const inputCls = (field: keyof FormState) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft/50 focus:border-leaf-400 ${
      errors[field] ? "border-tulip" : "border-cream-300"
    }`;

  const err = (field: keyof FormState) =>
    errors[field] ? <p className="mt-1 text-xs font-semibold text-tulip">{errors[field]}</p> : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-leaf-800 sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink-soft">
        🔒 Demo checkout — payments are simulated, no card is ever charged. Use any test card, e.g. 4242 4242 4242 4242.
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]" noValidate>
        <div className="space-y-8">
          {/* contact & shipping */}
          <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-bold text-leaf-800">1 · Where the bloom goes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-bold text-leaf-800">Full name</label>
                <input value={form.name} onChange={set("name")} placeholder="Zeynep Yılmaz" className={inputCls("name")} />
                {err("name")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">Email</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@uni.edu.tr" className={inputCls("email")} />
                {err("email")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">Phone</label>
                <input value={form.phone} onChange={set("phone")} placeholder="05xx xxx xx xx" className={inputCls("phone")} />
                {err("phone")}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-bold text-leaf-800">Address</label>
                <input value={form.address} onChange={set("address")} placeholder="Street, building, flat…" className={inputCls("address")} />
                {err("address")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">City</label>
                <input value={form.city} onChange={set("city")} placeholder="İstanbul" className={inputCls("city")} />
                {err("city")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">Postal code</label>
                <input value={form.postalCode} onChange={set("postalCode")} placeholder="34000" className={inputCls("postalCode")} />
                {err("postalCode")}
              </div>
            </div>
          </section>

          {/* payment */}
          <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-bold text-leaf-800">2 · Payment</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-bold text-leaf-800">Name on card</label>
                <input value={form.cardName} onChange={set("cardName")} placeholder="ZEYNEP YILMAZ" className={inputCls("cardName")} />
                {err("cardName")}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-bold text-leaf-800">Card number</label>
                <input inputMode="numeric" value={form.cardNumber} onChange={set("cardNumber")} placeholder="4242 4242 4242 4242" className={inputCls("cardNumber")} />
                {err("cardNumber")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">Expiry</label>
                <input inputMode="numeric" value={form.expiry} onChange={set("expiry")} placeholder="MM/YY" className={inputCls("expiry")} />
                {err("expiry")}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-leaf-800">CVC</label>
                <input inputMode="numeric" value={form.cvc} onChange={set("cvc")} placeholder="123" className={inputCls("cvc")} />
                {err("cvc")}
              </div>
            </div>
          </section>

          {serverError && (
            <p className="rounded-2xl bg-tulip/10 px-5 py-3.5 text-sm font-semibold text-tulip">{serverError}</p>
          )}
        </div>

        {/* order summary */}
        <aside className="h-fit rounded-[2rem] border border-cream-200 bg-cream-100/70 p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-leaf-800">Your order</h2>
          <ul className="mt-5 space-y-4">
            {totals.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-leaf-800">{line.name}</p>
                  <p className="text-xs text-ink-soft">Qty {line.qty}</p>
                </div>
                <p className="text-sm font-bold text-leaf-800">{formatTRY(line.lineTotal)}</p>
              </li>
            ))}
          </ul>

          {totals.discountLabel ? (
            <p className="mt-5 flex items-center justify-between rounded-2xl bg-sun-100 px-4 py-2.5 text-sm font-semibold text-sun-700">
              ✓ {totals.discountLabel}
              <button type="button" onClick={() => applyCode(null)} className="underline underline-offset-2">remove</button>
            </p>
          ) : (
            <div className="mt-5 flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Discount code"
                className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-leaf-400"
              />
              <button type="button" onClick={tryApplyCode} className="rounded-full bg-leaf-700 px-5 text-sm font-bold text-cream-50 hover:bg-leaf-600">
                Apply
              </button>
            </div>
          )}

          <dl className="mt-5 space-y-1.5 border-t border-cream-200 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="font-semibold">{formatTRY(totals.subtotal)}</dd></div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-leaf-600"><dt>Discount</dt><dd className="font-semibold">−{formatTRY(totals.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="font-semibold">{totals.shipping === 0 ? "Free" : formatTRY(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-cream-200 pt-2 font-display text-xl font-bold text-leaf-800">
              <dt>Total</dt><dd>{formatTRY(totals.total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-sun-400 py-4 font-display text-lg font-bold text-leaf-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-sun-300 hover:shadow-lift disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Planting your order… 🌱" : `Place order · ${formatTRY(totals.total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft">
            By ordering you agree to our 14-day return policy for unopened boxes.
          </p>
        </aside>
      </form>
    </div>
  );
}
