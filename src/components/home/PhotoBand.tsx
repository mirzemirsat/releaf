import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

/**
 * Full-width editorial band: a wide photograph with a short statement, used
 * as a strong visual break between text-heavy sections. The statement can sit
 * above or below the image.
 */
export default function PhotoBand({
  src,
  alt,
  width,
  height,
  eyebrow,
  title,
  body,
  statementPlacement = "above",
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  statementPlacement?: "above" | "below";
  children?: React.ReactNode;
}) {
  const statement = (
    <Reveal className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-leaf-800 sm:text-4xl">{title}</h2>
      {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{body}</p>}
    </Reveal>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      {statementPlacement === "above" && <div className="mb-10">{statement}</div>}
      <Reveal delay={0.08}>
        <PhotoFrame
          src={src}
          alt={alt}
          width={width}
          height={height}
          size="large"
          sizes="(max-width: 1152px) 100vw, 1152px"
        />
      </Reveal>
      {statementPlacement === "below" && <div className="mt-10">{statement}</div>}
      {children}
    </section>
  );
}
