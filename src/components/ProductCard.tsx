import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatTRY } from "@/lib/money";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white/80 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-sun-400 px-3.5 py-1.5 font-display text-xs font-bold text-leaf-900 shadow-soft">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-xl font-bold text-leaf-800 transition group-hover:text-leaf-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-ink-soft">{product.tagline}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-extrabold text-leaf-800">
            {formatTRY(product.price)}
            {product.compareAt && (
              <span className="ml-2 text-sm font-semibold text-ink-soft line-through">
                {formatTRY(product.compareAt)}
              </span>
            )}
          </p>
          <AddToCartButton slug={product.slug} label="Add" />
        </div>
      </div>
    </div>
  );
}
