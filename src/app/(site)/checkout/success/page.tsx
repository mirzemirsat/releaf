"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FlowerArt from "@/components/FlowerArt";
import { formatTRY } from "@/lib/money";

interface OrderSummary {
  orderId: string;
  total: number;
  itemCount: number;
  email: string;
  name: string;
  eta: string;
}

const NEXT_STEPS = [
  { emoji: "📦", title: "We pack it blind", body: "Your mystery box is sealed at the warehouse — even we don't know which bloom you're getting." },
  { emoji: "🚚", title: "It travels carefully", body: "Delivery in 1–3 business days. You'll get a tracking link by email the moment it ships." },
  { emoji: "🎬", title: "Film the reveal", body: "Unbox it on camera and tag @releaf.desk — rare pulls get featured (and envied)." },
];

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("releaf-last-order");
      if (raw) setOrder(JSON.parse(raw) as OrderSummary);
    } catch {
      // ignore malformed storage
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <FlowerArt species="daisy" animated={false} className="w-44" />
        <h1 className="mt-6 font-display text-3xl font-extrabold text-leaf-800">No recent order found</h1>
        <p className="mt-3 text-ink-soft">Looks like you wandered here without checking out. The garden awaits!</p>
        <Link href="/shop" className="mt-6 rounded-full bg-sun-400 px-7 py-3.5 font-display text-lg font-bold text-leaf-900 shadow-soft transition hover:bg-sun-300">
          Back to the shop
        </Link>
      </div>
    );
  }

  const firstName = order.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="mx-auto w-56"
      >
        <FlowerArt species="sunflower" className="w-full" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">Order confirmed</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-leaf-800">
          Something is growing your way, {firstName} 🌱
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          {order.itemCount} {order.itemCount === 1 ? "box" : "boxes"} · {formatTRY(order.total)} · confirmation sent to{" "}
          <span className="font-semibold text-leaf-800">{order.email}</span>
        </p>
        <p className="mt-4 inline-block rounded-full bg-leaf-100 px-5 py-2 font-display font-bold text-leaf-700">
          Order № {order.orderId}
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 text-left sm:grid-cols-3">
        {NEXT_STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.12 }}
            className="rounded-[1.75rem] bg-white/70 p-6 shadow-soft"
          >
            <span className="text-2xl">{step.emoji}</span>
            <h2 className="mt-2 font-display font-bold text-leaf-800">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12">
        <Link href="/collection" className="font-display font-bold text-leaf-600 underline underline-offset-4 hover:text-leaf-700">
          While you wait — meet all seven blooms →
        </Link>
      </motion.div>
    </div>
  );
}
