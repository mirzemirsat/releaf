"use client";

import { useMemo } from "react";
import {
  buildStemPoints,
  clamp,
  degreesToRadians,
  getPoseAt,
  pointsToSvgPath,
  radiansToDegrees,
  type Point,
} from "@/lib/scroll-bend";

/**
 * Sunny — the one and only flower model used across the site (mechanism
 * cards, the interactive timer, the scroll demo, the hero). Its shape is a
 * pure function of `bendProgress`: a flexible cantilever stem whose root is
 * pinned in the pot, with the head and leaves derived from the stem
 * centreline. There is no separate "upright" or "bent" asset.
 *
 *   bendProgress = 0   fully upright
 *   bendProgress = 0.5 halfway bent
 *   bendProgress = 1   fully bent (end of a focus session)
 */

const ROOT: Point = { x: 300, y: 404 };
const STEM_LENGTH = 234;
const MAX_BEND = degreesToRadians(100);
const SEGMENTS = 48;
const STRAIGHT_ROOT_RATIO = 0.06;
const STEM_WIDTH = 18;

const LOWER_LEAF_U = 0.36;
const UPPER_LEAF_U = 0.59;
const LOWER_LEAF_DESIGN_ANGLE = -68;
const UPPER_LEAF_DESIGN_ANGLE = 62;
const HEAD_ROTATION_TRANSFER = 0.22;
const HEAD_GRAVITY_DROOP = 7;

/**
 * Two crops that share the SAME vertical range (y 96→566) and therefore the
 * SAME flower scale and pot baseline when rendered at a fixed height. "wide"
 * just adds horizontal room on the right so a fully bent Sunny is never
 * clipped; "tight" centres an upright Sunny.
 */
const FRAMES = {
  tight: "198 96 204 470",
  wide: "188 96 384 470",
} as const;

export type SunnyProps = {
  bendProgress: number;
  scale?: number;
  expression?: "focus" | "rest";
  frame?: keyof typeof FRAMES;
  className?: string;
};

/* ---- static parts (origins chosen for single translate+rotate) -------- */

function GroundShadow() {
  return <ellipse cx="300" cy="540" rx="120" ry="18" fill="#46301d" opacity="0.12" />;
}

/** Pot body + soil, BEHIND the stem so the stem roots into visible soil. */
function PotBack() {
  return (
    <g>
      <path
        d="M 224 402 L 376 402 L 360 520 Q 358 532 344 532 L 256 532 Q 242 532 240 520 Z"
        fill="#e5cfa5"
        stroke="#d4b888"
        strokeWidth="2"
      />
      <path d="M 248 470 h 104" stroke="#d4b888" strokeWidth="1.4" opacity="0.5" />
      <ellipse cx="300" cy="398" rx="66" ry="13" fill="#5a3d24" />
      <ellipse cx="300" cy="396" rx="58" ry="9" fill="#6f4d2f" opacity="0.55" />
    </g>
  );
}

/** Front rim lip, IN FRONT of everything, hiding the fixed stem root. */
function PotFrontLip() {
  return (
    <g>
      <rect x="220" y="392" width="160" height="26" rx="13" fill="#ead7ae" stroke="#d4b888" strokeWidth="2" />
      <text
        x="300"
        y="500"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#41592d"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Releaf
      </text>
    </g>
  );
}

/** Leaf — local origin at the petiole base (0,0); blade points up (-y). */
function Leaf() {
  return (
    <g>
      <path
        d="M 0 0 C -17 -11 -19 -36 0 -52 C 19 -36 17 -11 0 0 Z"
        fill="#7ba055"
        stroke="#547539"
        strokeWidth="1.6"
      />
      <path d="M 0 -4 L 0 -46" stroke="#4f6a30" strokeWidth="1.4" fill="none" opacity="0.55" />
    </g>
  );
}

/** Sunny's head — local origin at the centre of the brown face. */
function FlowerHead({ tired }: { tired: boolean }) {
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <ellipse cx="0" cy="-34" rx="11" ry="19" fill="#f4bc45" stroke="#d88e12" strokeWidth="1.2" />
        </g>
      ))}
      <circle r="24" fill="#6f4d2f" />
      <circle r="17" fill="#5a3d24" opacity="0.45" />
      {tired ? (
        <>
          <path d="M -11 -3 Q -7 1 -3 -3" stroke="#241a10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M 3 -3 Q 7 1 11 -3" stroke="#241a10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="-7" cy="-3" r="3.2" fill="#241a10" />
          <circle cx="7" cy="-3" r="3.2" fill="#241a10" />
          <circle cx="-6" cy="-4.2" r="1" fill="#fff" opacity="0.9" />
          <circle cx="8" cy="-4.2" r="1" fill="#fff" opacity="0.9" />
        </>
      )}
      <path d="M -6 5 Q 0 10 6 5" stroke="#241a10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="-14" cy="4" r="3" fill="#e8927c" opacity="0.45" />
      <circle cx="14" cy="4" r="3" fill="#e8927c" opacity="0.45" />
    </g>
  );
}

/* ---- assembled plant -------------------------------------------------- */

export default function SunnyPlant({
  bendProgress,
  scale = 1,
  expression,
  frame = "wide",
  className,
}: SunnyProps) {
  const progress = clamp(bendProgress, 0, 1);

  const stemPoints = useMemo(
    () =>
      buildStemPoints({
        root: ROOT,
        length: STEM_LENGTH,
        progress,
        maxBendAngle: MAX_BEND,
        segments: SEGMENTS,
        straightRootRatio: STRAIGHT_ROOT_RATIO,
      }),
    [progress]
  );

  const stemPath = useMemo(() => pointsToSvgPath(stemPoints), [stemPoints]);

  const lowerLeafPose = getPoseAt(stemPoints, LOWER_LEAF_U);
  const upperLeafPose = getPoseAt(stemPoints, UPPER_LEAF_U);
  const flowerPose = getPoseAt(stemPoints, 1);

  const lowerLeafRotation = radiansToDegrees(lowerLeafPose.angle) + LOWER_LEAF_DESIGN_ANGLE;
  const upperLeafRotation = radiansToDegrees(upperLeafPose.angle) + UPPER_LEAF_DESIGN_ANGLE;

  const tipAngleDegrees = radiansToDegrees(flowerPose.angle);
  const flowerRotation = tipAngleDegrees * HEAD_ROTATION_TRANSFER + progress * HEAD_GRAVITY_DROOP;

  const tired = expression ? expression === "rest" : progress > 0.5;

  return (
    <svg
      viewBox={FRAMES[frame]}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      aria-label={`Sunny the sunflower, ${tired ? "bent for a break" : "standing tall"}`}
    >
      <GroundShadow />
      <PotBack />

      <path
        d={stemPath}
        fill="none"
        stroke="#536D3C"
        strokeWidth={STEM_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g transform={`translate(${lowerLeafPose.x} ${lowerLeafPose.y}) rotate(${lowerLeafRotation})`}>
        <Leaf />
      </g>
      <g transform={`translate(${upperLeafPose.x} ${upperLeafPose.y}) rotate(${upperLeafRotation})`}>
        <Leaf />
      </g>

      <g transform={`translate(${flowerPose.x} ${flowerPose.y}) rotate(${flowerRotation})`}>
        <FlowerHead tired={tired} />
      </g>

      <PotFrontLip />
    </svg>
  );
}
