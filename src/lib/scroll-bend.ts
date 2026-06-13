/**
 * Physics geometry for the Releaf scroll-bend animation.
 *
 * The stem is modelled as a flexible cantilever rod: its root is pinned
 * inside the pot and never moves, and the centreline is regenerated every
 * frame as a chain of fixed-length segments whose local tangent angle grows
 * along the stem. The flower head and leaves derive their poses from this
 * centreline, so the plant always reads as one connected object — the stem
 * can never stretch, shrink, or detach.
 *
 * Pure functions only — no React, no DOM (except the scroll helper). This
 * keeps the model testable and lets geometry be shared/memoised.
 */

export type Point = { x: number; y: number };

export interface StemConfig {
  root: Point;
  length: number;
  progress: number;
  maxBendAngle: number; // radians
  segments?: number;
  straightRootRatio?: number;
}

export interface Pose {
  x: number;
  y: number;
  angle: number; // radians, measured from the upright vertical
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Quintic smoothstep: zero velocity at both ends, no snapping on reversal. */
export function smootherStep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Local tangent angle at normalised position `u` along the stem.
 * The lowest `straightRootRatio` of the stem stays vertical (held in the
 * pot); above it the angle follows phi(v) = total * (2v - v²) so curvature
 * builds progressively toward the head instead of pivoting at the base.
 */
export function localStemAngle(
  u: number,
  totalBendAngle: number,
  straightRootRatio = 0.06
): number {
  if (u <= straightRootRatio) return 0;
  const v = (u - straightRootRatio) / (1 - straightRootRatio);
  return totalBendAngle * (2 * v - v * v);
}

/**
 * Build the stem centreline as fixed-length segments. Because every segment
 * is the same length, the total polyline length is constant regardless of
 * bend — the core guarantee of the model.
 *
 * `progress` maps linearly to the bend angle (bendProgress 0.5 → half the
 * max angle). Any easing — scroll smoothing, or the timer's per-frame lerp —
 * is applied by the caller before it reaches here.
 */
export function buildStemPoints({
  root,
  length,
  progress,
  maxBendAngle,
  segments = 48,
  straightRootRatio = 0.06,
}: StemConfig): Point[] {
  const totalBendAngle = maxBendAngle * clamp(progress, 0, 1);
  const segmentLength = length / segments;

  let x = root.x;
  let y = root.y;
  const points: Point[] = [{ x, y }];

  for (let i = 1; i <= segments; i++) {
    // Midpoint integration gives smoother geometry than endpoint sampling.
    const uMid = (i - 0.5) / segments;
    const angle = localStemAngle(uMid, totalBendAngle, straightRootRatio);

    // SVG axes: +x right, +y down — an upright stem advances in -y.
    x += segmentLength * Math.sin(angle);
    y -= segmentLength * Math.cos(angle);
    points.push({ x, y });
  }

  return points;
}

export function pointsToSvgPath(points: Point[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

/** Position and tangent angle at a normalised distance along the centreline. */
export function getPoseAt(points: Point[], normalizedPosition: number): Pose {
  const safe = clamp(normalizedPosition, 0, 1);
  const exactIndex = safe * (points.length - 1);
  const indexA = Math.floor(exactIndex);
  const indexB = Math.min(points.length - 1, indexA + 1);
  const t = exactIndex - indexA;

  const a = points[indexA];
  const b = points[indexB];

  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;

  // Tangent relative to the upright vertical (0 = straight up).
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const angle = Math.atan2(dx, -dy);

  return { x, y, angle };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function measuredPolylineLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += distance(points[i - 1], points[i]);
  return total;
}

/**
 * Progress of a sticky section through the viewport: 0 as it pins, 1 as it
 * releases. Decreases smoothly when scrolling back up.
 */
export function calculateSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const scrollableDistance = section.offsetHeight - window.innerHeight;
  if (scrollableDistance <= 0) return 0;
  return clamp(-rect.top / scrollableDistance, 0, 1);
}
