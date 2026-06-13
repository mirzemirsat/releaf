import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

/** Upload an image into public/uploads and return its public path. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be between 1 byte and 8 MB." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WebP, AVIF or GIF images are allowed." },
      { status: 400 }
    );
  }

  // sanitize the original name down to a slug, defeat any path tricks
  const base = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
  const stamp = Date.now().toString(36);
  const filename = `${stamp}-${base}${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  revalidatePath("/", "layout");
  return NextResponse.json({ path: `/uploads/${filename}` });
}
