"use client";

import { motion } from "framer-motion";
import type { FlowerSpecies } from "@/lib/flowers";

export type FlowerPose = "upright" | "bent";

interface FlowerArtProps {
  species?: FlowerSpecies;
  pose?: FlowerPose;
  /** When true, the flower sways gently and bends with a soft spring. */
  animated?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Face                                                                */
/* ------------------------------------------------------------------ */

function Face({
  tired,
  scale = 1,
  y = 0,
  tone = "#2b2417",
}: {
  tired: boolean;
  scale?: number;
  y?: number;
  tone?: string;
}) {
  return (
    <g transform={`translate(0 ${y}) scale(${scale})`}>
      {tired ? (
        <>
          {/* sleepy, closed eyes */}
          <path d="M -9 -2 Q -6 1 -3 -2" stroke={tone} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 3 -2 Q 6 1 9 -2" stroke={tone} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="-6" cy="-2.5" r="2.7" fill={tone} />
          <circle cx="6" cy="-2.5" r="2.7" fill={tone} />
          <circle cx="-5.2" cy="-3.3" r="0.9" fill="#fff" opacity="0.9" />
          <circle cx="6.8" cy="-3.3" r="0.9" fill="#fff" opacity="0.9" />
        </>
      )}
      <path d="M -5 4 Q 0 8.5 5 4" stroke={tone} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="-11" cy="3" r="2.6" fill="#e8927c" opacity="0.45" />
      <circle cx="11" cy="3" r="2.6" fill="#e8927c" opacity="0.45" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Species heads — each is drawn centered on (0,0)                     */
/* ------------------------------------------------------------------ */

function SunflowerHead({ tired }: { tired: boolean }) {
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <ellipse cx="0" cy="-28" rx="9.5" ry="16" fill="#f4bc45" stroke="#d88e12" strokeWidth="1" />
        </g>
      ))}
      <circle r="19" fill="#6f4d2f" />
      <circle r="13.5" fill="#5a3d24" opacity="0.45" />
      <Face tired={tired} tone="#241a10" />
    </g>
  );
}

function DaisyHead({ tired }: { tired: boolean }) {
  return (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 36})`}>
          <ellipse cx="0" cy="-26" rx="8.5" ry="15" fill="#fffdf6" stroke="#ece0c4" strokeWidth="1" />
        </g>
      ))}
      <circle r="14.5" fill="#f4bc45" stroke="#d88e12" strokeWidth="1" />
      <Face tired={tired} scale={0.85} tone="#5a3d24" />
    </g>
  );
}

function TulipHead({ tired }: { tired: boolean }) {
  return (
    <g>
      <path
        d="M -23 2 C -25 -14 -17 -25 -8 -27 C -3 -29.5 3 -29.5 8 -27 C 17 -25 25 -14 23 2 C 21 17 12 26 0 26 C -12 26 -21 17 -23 2 Z"
        fill="#e2654a"
        stroke="#c44e36"
        strokeWidth="1.2"
      />
      <path d="M -9 -26 C -11 -10 -10 6 -7 22" stroke="#c44e36" strokeWidth="1.4" fill="none" opacity="0.5" />
      <path d="M 9 -26 C 11 -10 10 6 7 22" stroke="#c44e36" strokeWidth="1.4" fill="none" opacity="0.5" />
      <Face tired={tired} y={1} tone="#3d1f15" />
    </g>
  );
}

function LavenderHead({ tired: _tired }: { tired: boolean }) {
  const spike = (
    buds: { y: number; r: number }[],
    x: number,
    stemTo: number
  ) => (
    <g transform={`translate(${x} 0)`}>
      <path d={`M 0 42 L 0 ${stemTo}`} stroke="#547539" strokeWidth="4" strokeLinecap="round" />
      {buds.map((b, i) => (
        <ellipse
          key={i}
          cx={i % 2 === 0 ? -1.5 : 1.5}
          cy={b.y}
          rx={b.r}
          ry={b.r * 1.3}
          fill={i === buds.length - 1 ? "#b5a3e3" : "#9c86d8"}
          stroke="#8169c2"
          strokeWidth="0.8"
        />
      ))}
    </g>
  );
  return (
    <g>
      {spike(
        [
          { y: 22, r: 7.5 },
          { y: 11, r: 7 },
          { y: 0, r: 6.5 },
          { y: -10, r: 6 },
          { y: -19, r: 5.2 },
          { y: -27, r: 4.2 },
        ],
        -10,
        24
      )}
      {spike(
        [
          { y: 30, r: 7 },
          { y: 19, r: 6.5 },
          { y: 9, r: 6 },
          { y: 0, r: 5.2 },
          { y: -8, r: 4.2 },
        ],
        11,
        32
      )}
    </g>
  );
}

function HydrangeaHead({ tired }: { tired: boolean }) {
  const ring = Array.from({ length: 6 }).map((_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    return { x: Math.cos(a) * 19, y: Math.sin(a) * 19, alt: i % 2 === 0 };
  });
  return (
    <g>
      {ring.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="11.5" fill={p.alt ? "#7c70d2" : "#685cc0"} stroke="#594fae" strokeWidth="0.8" />
      ))}
      <circle r="12.5" fill="#6e62c6" stroke="#594fae" strokeWidth="0.8" />
      <circle cx="-14" cy="-16" r="2.2" fill="#fff" opacity="0.35" />
      <circle cx="16" cy="-10" r="1.8" fill="#fff" opacity="0.3" />
      <Face tired={tired} scale={0.8} tone="#241f3f" />
    </g>
  );
}

function LilyHead({ tired }: { tired: boolean }) {
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 60})`}>
          <path
            d="M 0 -4 C -10 -14 -11 -30 0 -40 C 11 -30 10 -14 0 -4 Z"
            fill="#f6d9e0"
            stroke="#e8b7c6"
            strokeWidth="1"
          />
        </g>
      ))}
      <circle r="10" fill="#fbeef2" />
      {[-22, 0, 22].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <line x1="0" y1="-3" x2="0" y2="-15" stroke="#e9a23b" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="0" cy="-16.5" r="2.8" fill="#d88e12" />
        </g>
      ))}
      <Face tired={tired} scale={0.72} y={7} tone="#5c4a50" />
    </g>
  );
}

function ExoticHead() {
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <ellipse cx="0" cy="-28" rx="9.5" ry="16" fill="#2f3327" stroke="#20241b" strokeWidth="1" />
        </g>
      ))}
      <circle r="19" fill="#20241b" />
      <text
        y="8"
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        fill="#f8f0dc"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ?
      </text>
      <path d="M -30 -34 l 2.4 5 5 2.4 -5 2.4 -2.4 5 -2.4 -5 -5 -2.4 5 -2.4 Z" fill="#f4bc45" opacity="0.8" />
    </g>
  );
}

const HEADS: Record<FlowerSpecies, (tired: boolean) => React.ReactNode> = {
  sunflower: (t) => <SunflowerHead tired={t} />,
  daisy: (t) => <DaisyHead tired={t} />,
  tulip: (t) => <TulipHead tired={t} />,
  lavender: (t) => <LavenderHead tired={t} />,
  hydrangea: (t) => <HydrangeaHead tired={t} />,
  lily: (t) => <LilyHead tired={t} />,
  exotic: () => <ExoticHead />,
};

/* ------------------------------------------------------------------ */
/* The flower                                                          */
/* ------------------------------------------------------------------ */

const BEND_ANGLE = 76;

/**
 * The Releaf companion, drawn as SVG.
 * The plant group pivots at the soil line (110, 198) — upright while
 * focusing, bending forward when it is time to rest, exactly like the
 * physical mechanism in the pot.
 */
export default function FlowerArt({
  species = "sunflower",
  pose = "upright",
  animated = true,
  className,
}: FlowerArtProps) {
  const tired = pose === "bent";

  const plant = (
    <>
      {/* stem */}
      <path
        d="M 110 198 C 108 165 112 132 110 100"
        stroke="#547539"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* leaves */}
      <path
        d="M 110 168 C 96 160 80 160 70 171 C 80 182 99 180 110 169 Z"
        fill="#6c9148"
        stroke="#547539"
        strokeWidth="1"
      />
      <path d="M 76 170 Q 92 170 108 168" stroke="#547539" strokeWidth="1.4" fill="none" opacity="0.6" />
      <path
        d="M 110 146 C 124 138 140 138 150 149 C 140 160 121 158 110 147 Z"
        fill="#8bad62"
        stroke="#547539"
        strokeWidth="1"
      />
      <path d="M 144 148 Q 128 148 112 146" stroke="#547539" strokeWidth="1.4" fill="none" opacity="0.6" />
      {/* head — slight extra curl when bent, applied around the neck */}
      {animated ? (
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "110px 100px" }}
          animate={{ rotate: tired ? 22 : 0 }}
          transition={{ type: "spring", stiffness: 26, damping: 9, mass: 1.1 }}
        >
          <g transform="translate(110 72)">{HEADS[species](tired)}</g>
        </motion.g>
      ) : (
        <g transform={`translate(110 72)${tired ? " rotate(22 0 28)" : ""}`}>{HEADS[species](tired)}</g>
      )}
    </>
  );

  return (
    <svg
      viewBox="0 0 220 290"
      className={className}
      role="img"
      aria-label={`Releaf ${species} plush companion, ${tired ? "bending for a break" : "standing tall"}`}
    >
      {/* ground shadow */}
      <ellipse cx="110" cy="276" rx="54" ry="8" fill="#46301d" opacity="0.12" />

      {/* the plant — pivots at the soil line */}
      {animated ? (
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "110px 198px" }}
          animate={
            tired
              ? { rotate: BEND_ANGLE }
              : { rotate: [0, -2.4, 0, 2.4, 0] }
          }
          transition={
            tired
              ? { type: "spring", stiffness: 22, damping: 8.5, mass: 1.4 }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {plant}
        </motion.g>
      ) : (
        <g transform={tired ? `rotate(${BEND_ANGLE} 110 198)` : undefined}>{plant}</g>
      )}

      {/* pot — stays put while the plant moves */}
      <g>
        <path
          d="M 74 210 L 146 210 L 139 258 Q 138 266 129 266 L 91 266 Q 82 266 81 258 Z"
          fill="#e5cfa5"
          stroke="#d4b888"
          strokeWidth="1.5"
        />
        <rect x="64" y="190" width="92" height="22" rx="11" fill="#ead7ae" stroke="#d4b888" strokeWidth="1.5" />
        <ellipse cx="110" cy="196" rx="34" ry="6" fill="#5a3d24" />
        <text
          x="110"
          y="243"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#41592d"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Releaf
        </text>
      </g>
    </svg>
  );
}
