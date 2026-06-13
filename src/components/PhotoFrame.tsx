import Image from "next/image";

/**
 * The single styling system for every real product photograph on the site:
 * consistent rounded corners by size, soft green-tinted shadows (never pure
 * black), an optional cream mat, a slight tilt, and an optional hover lift.
 * Wraps next/image so we get WebP/AVIF, responsive srcset, lazy-loading and
 * no layout shift for free.
 */

type Size = "hero" | "large" | "medium" | "small";

const RADIUS: Record<Size, string> = {
  hero: "rounded-[28px]",
  large: "rounded-[24px]",
  medium: "rounded-[20px]",
  small: "rounded-[16px]",
};

const INNER_RADIUS: Record<Size, string> = {
  hero: "rounded-[22px]",
  large: "rounded-[18px]",
  medium: "rounded-[15px]",
  small: "rounded-[12px]",
};

// Soft, diffused shadows tinted with Releaf forest-green (57,72,43).
const SHADOW: Record<Size, string> = {
  hero: "shadow-[0_24px_60px_rgba(57,72,43,0.14),0_8px_24px_rgba(57,72,43,0.08)]",
  large: "shadow-[0_20px_50px_rgba(57,72,43,0.12),0_6px_18px_rgba(57,72,43,0.06)]",
  medium: "shadow-[0_16px_40px_rgba(57,72,43,0.11),0_5px_14px_rgba(57,72,43,0.06)]",
  small: "shadow-[0_12px_30px_rgba(57,72,43,0.10)]",
};

interface PhotoFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  size?: Size;
  /** Wrap the photo in a warm cream mat for separation from the background. */
  mat?: boolean;
  /** Gentle rotation in degrees (keep within ±1.5). */
  tilt?: number;
  /** Hero photo: eager + high priority. Everything else lazy-loads. */
  priority?: boolean;
  /** Responsive sizes hint for srcset. */
  sizes?: string;
  /** Subtle lift on hover — only for clickable/interactive images. */
  hover?: boolean;
  className?: string;
}

export default function PhotoFrame({
  src,
  alt,
  width,
  height,
  size = "large",
  mat = false,
  tilt = 0,
  priority = false,
  sizes,
  hover = false,
  className = "",
}: PhotoFrameProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      {...(priority
        ? { fetchPriority: "high" as const }
        : { loading: "lazy" as const, decoding: "async" as const })}
      className={`block h-full w-full object-cover ${mat ? INNER_RADIUS[size] : RADIUS[size]}`}
    />
  );

  const hoverCls = hover
    ? "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(57,72,43,0.15)]"
    : "";

  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined;

  if (mat) {
    return (
      <figure
        style={style}
        className={`bg-cream-50 p-2.5 ${RADIUS[size]} ${SHADOW[size]} ${hoverCls} ${className}`}
      >
        <div className={`overflow-hidden ${INNER_RADIUS[size]}`}>{image}</div>
      </figure>
    );
  }

  return (
    <figure
      style={style}
      className={`overflow-hidden ${RADIUS[size]} ${SHADOW[size]} ${hoverCls} ${className}`}
    >
      {image}
    </figure>
  );
}
