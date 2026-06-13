import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

/**
 * Two-column "image + copy" editorial block. Alternate `imageSide` between
 * sections so the page never repeats the same layout twice in a row.
 */
export default function PhotoStory({
  src,
  alt,
  width,
  height,
  imageSide = "right",
  eyebrow,
  title,
  body,
  size = "large",
  tilt = 0,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  imageSide?: "left" | "right";
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  size?: "large" | "medium";
  tilt?: number;
}) {
  const photo = (
    <Reveal className={imageSide === "left" ? "lg:order-1" : "lg:order-2"}>
      <PhotoFrame
        src={src}
        alt={alt}
        width={width}
        height={height}
        size={size}
        mat
        tilt={tilt}
        sizes="(max-width: 1024px) 100vw, 520px"
      />
    </Reveal>
  );

  const copy = (
    <Reveal delay={0.1} className={imageSide === "left" ? "lg:order-2" : "lg:order-1"}>
      <p className="font-display text-sm font-bold uppercase tracking-widest text-sun-600">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-leaf-800 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{body}</p>
    </Reveal>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {photo}
        {copy}
      </div>
    </section>
  );
}
