"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FlowerArt from "@/components/FlowerArt";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-speckle px-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-white/85 p-8 shadow-lift">
        <div className="mx-auto w-28">
          <FlowerArt species="sunflower" animated={false} className="w-full" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-leaf-800">
          Releaf Admin
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          The garden&apos;s control room. Staff only. 🌱
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-bold text-leaf-800">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3 text-sm outline-none focus:border-leaf-400"
              placeholder="••••••••••"
            />
          </div>
          {error && <p className="text-sm font-semibold text-tulip">{error}</p>}
          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="w-full rounded-full bg-leaf-700 py-3 font-display font-bold text-cream-50 transition hover:bg-leaf-600 disabled:opacity-50"
          >
            {busy ? "Checking…" : "Enter the greenhouse"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-ink-soft">
          Set <code className="rounded bg-cream-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> in{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5">.env.local</code> · default for local
          demos: <code className="rounded bg-cream-100 px-1.5 py-0.5">releaf-admin</code>
        </p>
      </div>
    </div>
  );
}
