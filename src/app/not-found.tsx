import Link from "next/link";
import FlowerArt from "@/components/FlowerArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <FlowerArt species="tulip" pose="bent" animated={false} className="w-48 opacity-90" />
      <h1 className="mt-6 font-display text-4xl font-extrabold text-leaf-800">This page took a break.</h1>
      <p className="mt-3 text-ink-soft">
        And unlike you, it never came back. Let&apos;s get you somewhere that exists.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-full bg-sun-400 px-7 py-3.5 font-display text-lg font-bold text-leaf-900 shadow-soft transition hover:bg-sun-300"
      >
        Back to the garden
      </Link>
    </div>
  );
}
