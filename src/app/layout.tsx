import type { Metadata } from "next";
import { Baloo_2, Nunito, Fraunces } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

// Soft display serif used for the product-showcase headings.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Releaf — Focus. Rest. Releaf.",
    template: "%s · Releaf",
  },
  description:
    "Releaf is a plush Pomodoro desk companion that stands tall while you focus and bends forward when it's time to rest. Seven blooms to collect, one mystery box at a time.",
  keywords: ["Releaf", "Pomodoro", "desk companion", "plush", "blind box", "focus timer", "study"],
  openGraph: {
    title: "Releaf — the flower that reminds you to rest",
    description:
      "A plush Pomodoro companion with a real timer in its pot. Stands while you focus, bends when it's break time. 7 blooms to collect.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} ${fraunces.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
