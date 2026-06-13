import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { saveSection } from "@/lib/content/store";
import { DEFAULT_CONTENT, type SectionKey } from "@/lib/content/defaults";

/**
 * Save (or reset, with `data: null`) one content section.
 * Every public page is revalidated so edits go live immediately.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { section?: string; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const section = body.section as SectionKey;
  if (!section || !(section in DEFAULT_CONTENT)) {
    return NextResponse.json({ error: "Unknown content section." }, { status: 400 });
  }

  try {
    await saveSection(section, body.data ?? null);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save." },
      { status: 400 }
    );
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
