"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Field heuristics — how the editor decides what control to render    */
/* ------------------------------------------------------------------ */

type Json = string | number | boolean | Json[] | { [key: string]: Json };

const isIconKey = (key: string) => /^(icon|emoji)$/i.test(key);
const isImageKey = (key: string) => /image|photo/i.test(key);
const isImageArrayKey = (key: string) => /gallery|images/i.test(key);
const isLockedKey = (key: string) => key === "slug" || key === "species";

const EMOJIS = [
  "🌻", "🌼", "🌷", "🌸", "💐", "🪻", "🌺", "🪴", "🌱", "🍃", "🍀", "🌿",
  "⏱", "⏰", "📚", "✍️", "📵", "📱", "💻", "🧠", "☕", "🧃", "🍵", "🌙",
  "🧸", "🎁", "📦", "🚚", "🛡", "🔁", "🎓", "🤝", "🌍", "🫂", "💡", "✨",
];

const LOGO_OPTIONS = ["leaf", "sprout", "flower", "sun"];

function prettyLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/* Media picker modal                                                  */
/* ------------------------------------------------------------------ */

interface MediaImage {
  path: string;
  name: string;
  size: number;
}

function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (path: string) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<MediaImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSelect(data.path);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-900/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-[1.5rem] bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h3 className="font-display text-lg font-bold text-leaf-800">Choose an image</h3>
          <div className="flex items-center gap-3">
            <label className={`cursor-pointer rounded-full bg-leaf-700 px-4 py-2 text-sm font-bold text-cream-50 hover:bg-leaf-600 ${uploading ? "opacity-50" : ""}`}>
              {uploading ? "Uploading…" : "⬆ Upload new"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
            </label>
            <button onClick={onClose} className="rounded-full p-2 text-ink-soft hover:bg-cream-100" aria-label="Close">
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {error && <p className="mb-3 text-sm font-semibold text-tulip">{error}</p>}
          {!images ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-ink-soft">No images yet — upload one above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <button
                  key={img.path}
                  onClick={() => {
                    onSelect(img.path);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl border border-cream-200 bg-cream-50 text-left transition hover:border-leaf-400 hover:shadow-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.path} alt={img.name} className="aspect-square w-full object-cover" />
                  <p className="truncate px-2 py-1.5 text-[11px] font-semibold text-ink-soft group-hover:text-leaf-700">
                    {img.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual field controls                                           */
/* ------------------------------------------------------------------ */

function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded-xl border border-cream-300 bg-white px-3 py-2 text-center text-xl outline-none focus:border-leaf-400"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full bg-cream-100 px-3 py-2 text-sm font-bold text-leaf-700 hover:bg-cream-200"
        >
          🙂 Pick
        </button>
      </div>
      {open && (
        <div className="absolute z-20 mt-2 grid w-72 grid-cols-9 gap-1 rounded-2xl border border-cream-200 bg-white p-3 shadow-lift">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji);
                setOpen(false);
              }}
              className="rounded-lg p-1 text-xl hover:bg-cream-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-cream-200 bg-cream-50">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-soft">none</div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="rounded-full bg-leaf-700 px-4 py-2 text-sm font-bold text-cream-50 hover:bg-leaf-600"
        >
          Change photo
        </button>
        <p className="mt-1 max-w-44 truncate text-[11px] text-ink-soft">{value}</p>
      </div>
      {picking && <MediaPicker onSelect={onChange} onClose={() => setPicking(false)} />}
    </div>
  );
}

function StringField({
  fieldKey,
  value,
  onChange,
  inGallery,
}: {
  fieldKey: string;
  value: string;
  onChange: (v: string) => void;
  inGallery?: boolean;
}) {
  if (fieldKey === "logoIcon") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-leaf-400"
      >
        {LOGO_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {prettyLabel(opt)}
          </option>
        ))}
      </select>
    );
  }
  if (isLockedKey(fieldKey)) {
    return (
      <span className="inline-block rounded-full bg-cream-100 px-3 py-1.5 font-mono text-xs font-bold text-ink-soft">
        {value} 🔒
      </span>
    );
  }
  if (isIconKey(fieldKey)) return <IconField value={value} onChange={onChange} />;
  if (isImageKey(fieldKey) || inGallery) return <ImageField value={value} onChange={onChange} />;

  if (value.length > 90 || value.includes("\n")) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(3, Math.ceil(value.length / 80)))}
        className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-leaf-400"
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-leaf-400"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Recursive renderer                                                  */
/* ------------------------------------------------------------------ */

function emptyClone(template: Json): Json {
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  const out: { [key: string]: Json } = {};
  for (const [k, v] of Object.entries(template)) {
    out[k] = isIconKey(k) || isImageKey(k) || isLockedKey(k) ? v : emptyClone(v);
  }
  return out;
}

function Node({
  fieldKey,
  value,
  onChange,
  depth,
  inGallery,
}: {
  fieldKey: string;
  value: Json;
  onChange: (v: Json) => void;
  depth: number;
  inGallery?: boolean;
}) {
  if (typeof value === "string") {
    return <StringField fieldKey={fieldKey} value={value} onChange={onChange} inGallery={inGallery} />;
  }
  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm outline-none focus:border-leaf-400"
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
    );
  }

  if (Array.isArray(value)) {
    const galleryItems = isImageArrayKey(fieldKey);
    const locked =
      value.length > 0 &&
      typeof value[0] === "object" &&
      !Array.isArray(value[0]) &&
      ("slug" in (value[0] as object) || "species" in (value[0] as object));

    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div
            key={i}
            className={
              typeof item === "object"
                ? "rounded-2xl border border-cream-200 bg-cream-50/60 p-4"
                : "flex items-center gap-2"
            }
          >
            {typeof item === "object" && !locked && (
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="text-xs font-bold text-ink-soft hover:text-tulip"
                >
                  ✕ Remove item {i + 1}
                </button>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Node
                fieldKey={`${fieldKey}.${i}`}
                value={item}
                onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
                depth={depth + 1}
                inGallery={galleryItems}
              />
            </div>
            {typeof item !== "object" && !locked && (
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="shrink-0 text-xs font-bold text-ink-soft hover:text-tulip"
                aria-label="Remove item"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {!locked && (
          <button
            type="button"
            onClick={() => onChange([...value, value.length > 0 ? emptyClone(value[value.length - 1]) : ""])}
            className="rounded-full border border-dashed border-leaf-400 px-4 py-1.5 text-sm font-bold text-leaf-600 hover:bg-leaf-50"
          >
            ＋ Add item
          </button>
        )}
      </div>
    );
  }

  // object
  return (
    <div className={depth > 0 ? "space-y-4" : "space-y-6"}>
      {Object.entries(value).map(([key, v]) => {
        const isLeafString = typeof v === "string" || typeof v === "number" || typeof v === "boolean";
        return (
          <div key={key} className={!isLeafString && depth === 0 ? "rounded-[1.5rem] border border-cream-200 bg-white p-5 shadow-soft" : ""}>
            <label className={`mb-1.5 block font-display font-bold text-leaf-800 ${depth === 0 && !isLeafString ? "text-lg" : "text-sm"}`}>
              {prettyLabel(key)}
            </label>
            <Node
              fieldKey={key}
              value={v}
              onChange={(nv) => onChange({ ...value, [key]: nv })}
              depth={depth + 1}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The editor shell                                                    */
/* ------------------------------------------------------------------ */

export default function SectionEditor({
  section,
  title,
  description,
  initial,
}: {
  section: string;
  title: string;
  description: string;
  initial: Json;
}) {
  const router = useRouter();
  const [data, setData] = useState<Json>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (v: Json) => {
    setData(v);
    setDirty(true);
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      setStatus("saved");
      setDirty(false);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Save failed.");
    }
  };

  const reset = async () => {
    if (!confirm("Reset this section to the original copy? Your edits to it will be discarded.")) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: null }),
      });
      if (!res.ok) throw new Error();
      window.location.reload();
    } catch {
      setStatus("error");
      setErrorMsg("Reset failed.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* sticky action bar */}
      <div className="sticky top-0 z-30 -mx-2 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50/95 px-5 py-3.5 shadow-soft backdrop-blur">
        <div>
          <h1 className="font-display text-xl font-extrabold text-leaf-800">{title}</h1>
          <p className="text-xs text-ink-soft">{description}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {status === "saved" && <span className="text-sm font-bold text-leaf-600">✓ Saved — live on the site</span>}
          {status === "error" && <span className="text-sm font-bold text-tulip">{errorMsg}</span>}
          {dirty && status === "idle" && <span className="text-sm font-semibold text-sun-600">Unsaved changes</span>}
          <button
            onClick={reset}
            className="rounded-full border border-cream-300 px-4 py-2 text-sm font-bold text-ink-soft hover:border-tulip hover:text-tulip"
          >
            Reset to defaults
          </button>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-full bg-leaf-700 px-6 py-2 text-sm font-bold text-cream-50 transition hover:bg-leaf-600 disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <Node fieldKey={section} value={data} onChange={update} depth={0} />

      <div className="mt-8 flex justify-end">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-leaf-700 px-8 py-3 font-display font-bold text-cream-50 transition hover:bg-leaf-600 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
