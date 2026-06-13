import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminPassword,
  constantTimeEquals,
  createSessionToken,
  loginAllowed,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (!loginAllowed(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    /* fall through to failure */
  }

  if (!password || !constantTimeEquals(password, adminPassword())) {
    recordLoginFailure(ip);
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  clearLoginFailures(ip);
  const { token, maxAge } = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
