import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif)$/i;

async function listDir(publicSubdir: string): Promise<{ path: string; name: string; size: number }[]> {
  const dir = path.join(process.cwd(), "public", publicSubdir);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile() && IMAGE_EXT.test(e.name))
        .map(async (e) => {
          const stat = await fs.stat(path.join(dir, e.name));
          return { path: `/${publicSubdir}/${e.name}`, name: e.name, size: stat.size };
        })
    );
    return files;
  } catch {
    return [];
  }
}

/** List every image available to the site (bundled products + admin uploads). */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const [products, uploads] = await Promise.all([listDir("products"), listDir("uploads")]);
  // newest uploads first so a fresh upload is easy to pick
  uploads.sort((a, b) => b.name.localeCompare(a.name));
  return NextResponse.json({ images: [...uploads, ...products] });
}
