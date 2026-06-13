import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminRequest, usingDefaultPassword } from "@/lib/admin-auth";
import { SECTION_META, type SectionKey } from "@/lib/content/defaults";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Releaf Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminRequest())) redirect("/admin/login");

  const sections = Object.entries(SECTION_META) as [SectionKey, { title: string }][];

  return (
    <div className="flex min-h-screen bg-cream-100/60">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-cream-200 bg-cream-50 p-5 md:flex">
        <Link href="/admin" className="font-display text-xl font-extrabold text-leaf-700">
          🌻 Releaf Admin
        </Link>

        <nav className="mt-6 flex-1 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Content</p>
          {sections.map(([key, meta]) => (
            <Link
              key={key}
              href={`/admin/content/${key}`}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink hover:bg-cream-100 hover:text-leaf-800"
            >
              {meta.title}
            </Link>
          ))}
          <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Assets</p>
          <Link
            href="/admin/media"
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink hover:bg-cream-100 hover:text-leaf-800"
          >
            Media Library
          </Link>
        </nav>

        <div className="space-y-2 border-t border-cream-200 pt-4">
          <Link
            href="/"
            target="_blank"
            className="block w-full rounded-full bg-sun-400 px-4 py-2 text-center text-sm font-bold text-leaf-900 transition hover:bg-sun-300"
          >
            View live site ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* main */}
      <div className="min-w-0 flex-1">
        {usingDefaultPassword() && (
          <p className="border-b border-sun-300 bg-sun-100 px-6 py-2.5 text-sm font-semibold text-sun-700">
            ⚠️ Running with the default admin password. Set <code>ADMIN_PASSWORD</code> in{" "}
            <code>.env.local</code> before sharing this server.
          </p>
        )}
        <div className="p-6 sm:p-10">{children}</div>
      </div>
    </div>
  );
}
