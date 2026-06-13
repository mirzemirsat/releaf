"use client";

import Link from "next/link";
import { useGlobalContent } from "./SiteChromeProvider";

/** The swappable brand marks available in the admin panel. */
const MARKS: Record<string, ReactNodeFactory> = {
  leaf: () => (
    <>
      <path d="M3 21 C3 11 11 3 21 3 C21 13 13 21 3 21 Z" fill="var(--color-leaf-500)" />
      <path d="M5 19 C9 13 13 9 19 5" stroke="var(--color-leaf-100)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  sprout: () => (
    <>
      <path d="M12 21 V11" stroke="var(--color-leaf-600)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 12 C12 7 8 4 3 4 C3 9 7 12 12 12 Z" fill="var(--color-leaf-500)" />
      <path d="M12 9 C12 5.5 15 3 20 3 C20 7 16.5 9.5 12 9 Z" fill="var(--color-leaf-300)" />
    </>
  ),
  flower: () => (
    <>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.4" rx="3" ry="5" fill="var(--color-sun-400)" transform={`rotate(${deg} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3.4" fill="var(--color-soil-500)" />
    </>
  ),
  sun: () => (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <path key={deg} d="M12 1.5 L12 5" stroke="var(--color-sun-500)" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${deg} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="5" fill="var(--color-sun-400)" />
    </>
  ),
};

type ReactNodeFactory = () => React.ReactNode;

export default function Logo({ className = "" }: { className?: string }) {
  const { brandName, logoIcon } = useGlobalContent();
  const Mark = MARKS[logoIcon] ?? MARKS.leaf;

  return (
    <Link href="/" className={`group inline-flex items-end gap-1 ${className}`} aria-label={`${brandName} — home`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6 -mb-0.5 transition-transform group-hover:-rotate-12" aria-hidden>
        {Mark()}
      </svg>
      <span className="font-display text-2xl font-bold leading-none text-leaf-700">{brandName}</span>
    </Link>
  );
}
