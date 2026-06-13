"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-full border border-cream-300 px-4 py-2 text-sm font-bold text-ink-soft transition hover:border-tulip hover:text-tulip"
    >
      Log out
    </button>
  );
}
