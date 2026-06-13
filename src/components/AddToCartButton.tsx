"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function AddToCartButton({
  slug,
  label = "Add to cart",
  qty = 1,
  size = "md",
  className = "",
}: {
  slug: string;
  label?: string;
  qty?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = () => {
    add(slug, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const sizing =
    size === "lg"
      ? "px-8 py-4 text-lg"
      : "px-5 py-2.5 text-sm";

  return (
    <button
      onClick={handleClick}
      className={`rounded-full bg-sun-400 font-display font-bold text-leaf-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-sun-300 hover:shadow-lift active:translate-y-0 ${sizing} ${className}`}
    >
      {justAdded ? "Added! 🌱" : label}
    </button>
  );
}
