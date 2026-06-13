"use client";

import { useCallback, useEffect, useState } from "react";

interface MediaImage {
  path: string;
  name: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function MediaManager() {
  const [images, setImages] = useState<MediaImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

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
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const copyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(path);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-leaf-800">Media Library</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Every image available to the storefront. Upload here, then assign photos from any
            content editor — or use an image field&apos;s &ldquo;Change photo&rdquo; button directly.
          </p>
        </div>
        <label className={`cursor-pointer rounded-full bg-leaf-700 px-5 py-2.5 text-sm font-bold text-cream-50 hover:bg-leaf-600 ${uploading ? "opacity-50" : ""}`}>
          {uploading ? "Uploading…" : "⬆ Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-tulip">{error}</p>}

      {!images ? (
        <p className="mt-8 text-sm text-ink-soft">Loading…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.path} className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt={img.name} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-xs font-bold text-leaf-800">{img.name}</p>
                <p className="text-[11px] text-ink-soft">{formatSize(img.size)}</p>
                <button
                  onClick={() => copyPath(img.path)}
                  className="mt-2 w-full rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold text-leaf-700 hover:bg-cream-200"
                >
                  {copied === img.path ? "Copied ✓" : "Copy path"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
