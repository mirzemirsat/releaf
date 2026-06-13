import { createHmac, createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "releaf_admin";
const SESSION_HOURS = 8;

/**
 * Demo-friendly credentials: set ADMIN_PASSWORD (and ideally
 * ADMIN_SESSION_SECRET) in .env.local for anything beyond local use.
 */
export const DEFAULT_PASSWORD = "releaf-admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function usingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    // fall back to a secret derived from the password so tokens are
    // still unforgeable without knowing it
    createHash("sha256").update("releaf-session::" + adminPassword()).digest("hex")
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // compare against self to keep timing uniform, then fail
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/** Create a signed session token valid for SESSION_HOURS. */
export function createSessionToken(): { token: string; maxAge: number } {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = String(expires);
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!constantTimeEquals(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/* ------------------------------------------------------------------ */
/* Tiny in-memory login rate limit (per process)                       */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60_000;

export function loginAllowed(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) return true;
  return entry.count < MAX_ATTEMPTS;
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}
