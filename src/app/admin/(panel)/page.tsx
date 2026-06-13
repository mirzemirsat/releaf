import Link from "next/link";
import { SECTION_META, type SectionKey } from "@/lib/content/defaults";

const SECTION_ICONS: Record<SectionKey, string> = {
  global: "🪴",
  home: "🏡",
  shopPage: "🛍️",
  collectionPage: "🌷",
  guidePage: "📖",
  aboutPage: "💌",
  products: "📦",
  flowers: "🌼",
};

export default function AdminDashboard() {
  const sections = Object.entries(SECTION_META) as [SectionKey, { title: string; description: string }][];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-extrabold text-leaf-800">Good to see you 🌞</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Everything customers read or see on the storefront is editable from here. Changes go live
        the moment you hit <strong>Save</strong> — no rebuild, no deploy. If anything goes wrong,
        every section has a one-click <em>Reset to defaults</em>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map(([key, meta]) => (
          <Link
            key={key}
            href={`/admin/content/${key}`}
            className="group rounded-[1.5rem] border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="text-2xl">{SECTION_ICONS[key]}</span>
            <h2 className="mt-2 font-display text-lg font-bold text-leaf-800 group-hover:text-leaf-600">
              {meta.title}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{meta.description}</p>
          </Link>
        ))}
        <Link
          href="/admin/media"
          className="group rounded-[1.5rem] border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="text-2xl">🖼️</span>
          <h2 className="mt-2 font-display text-lg font-bold text-leaf-800 group-hover:text-leaf-600">
            Media Library
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Upload photos and manage every image on the site</p>
        </Link>
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-leaf-200 bg-leaf-50 p-5 text-sm text-leaf-800">
        <p className="font-display font-bold">How editing works</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Text fields edit the exact words shown on the site — emoji welcome.</li>
          <li>Fields with a 🙂 button are icons: pick from the palette or type any emoji.</li>
          <li>Image fields open the media library — pick an existing photo or upload a new one.</li>
          <li>Prices, blind-box odds and product slugs are locked in code to protect checkout integrity.</li>
        </ul>
      </div>
    </div>
  );
}
