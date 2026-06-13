"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SunnyPlant from "./SunnyPlant";
import { getBreakBendProgress, getFocusBendProgress, lerp } from "@/lib/timer-bend";

type Phase = "idle" | "focus" | "rest";

interface Preset {
  id: string;
  label: string;
  focus: number;
  rest: number;
  note: string;
}

const PRESETS: Preset[] = [
  { id: "demo", label: "10-second demo", focus: 10, rest: 6, note: "See the bend right now" },
  { id: "classic", label: "Classic 25 / 5", focus: 25 * 60, rest: 5 * 60, note: "The standard Pomodoro" },
  { id: "deep", label: "Deep 50 / 10", focus: 50 * 60, rest: 10 * 60, note: "For long study blocks" },
];

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const COPY: Record<Phase, { title: string; body: string }> = {
  idle: {
    title: "Sunny is ready when you are",
    body: "Pick a rhythm and start a session. Sunny stands tall the whole time you focus.",
  },
  focus: {
    title: "Focus time — Sunny stands with you",
    body: "Phone down, head up. When the timer ends, watch the desk instead of your notifications.",
  },
  rest: {
    title: "Time to breathe",
    body: "Sunny just bent forward — that is your cue. Stand up, stretch, look out a window. The work will wait.",
  },
};

/**
 * A working Pomodoro timer wired to Sunny — the physical product mechanism,
 * recreated in the browser. The timer (in seconds) is the source of truth;
 * Sunny's bend is derived from it every frame and bends *continuously* as
 * focus elapses, then rises again across the break.
 */
export default function PomodoroDemo() {
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].focus);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "idle") return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (secondsLeft > 0) return;
    if (phase === "focus") {
      setPhase("rest");
      setSecondsLeft(preset.rest);
    } else if (phase === "rest") {
      setPhase("idle");
      setSecondsLeft(preset.focus);
      setCompleted((c) => c + 1);
    }
  }, [secondsLeft, phase, preset]);

  const total = phase === "rest" ? preset.rest : preset.focus;
  const progress = phase === "idle" ? 0 : 1 - secondsLeft / total;

  // Timer state → Sunny's target bend. One model, derived purely from time.
  const targetBend =
    phase === "focus"
      ? getFocusBendProgress(preset.focus, secondsLeft)
      : phase === "rest"
        ? getBreakBendProgress(preset.rest, secondsLeft)
        : 0;

  // Smoothly interpolate the displayed bend toward the per-second target so
  // Sunny glides instead of snapping once a second.
  const [displayBend, setDisplayBend] = useState(0);
  const displayRef = useRef(0);
  const targetRef = useRef(0);
  targetRef.current = targetBend;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const next = lerp(displayRef.current, targetRef.current, 0.12);
      const settled = Math.abs(targetRef.current - next) < 0.0015;
      displayRef.current = settled ? targetRef.current : next;
      setDisplayBend(displayRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const choosePreset = (p: Preset) => {
    setPreset(p);
    setPhase("idle");
    setSecondsLeft(p.focus);
  };

  const start = () => {
    setSecondsLeft(preset.focus);
    setPhase("focus");
  };

  const stop = () => {
    setPhase("idle");
    setSecondsLeft(preset.focus);
  };

  const finishBreak = () => {
    setCompleted((c) => c + 1);
    setPhase("idle");
    setSecondsLeft(preset.focus);
  };

  const ringColor = phase === "rest" ? "var(--color-tulip)" : "var(--color-leaf-500)";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {/* Sunny */}
      <div className="relative mx-auto w-full max-w-sm">
        <div
          className={`absolute inset-0 -z-10 rounded-full blur-3xl transition-colors duration-1000 ${
            phase === "rest" ? "bg-sun-200/70" : "bg-leaf-100"
          }`}
        />
        <SunnyPlant bendProgress={displayBend} frame="wide" className="w-full" />
        <AnimatePresence>
          {phase === "rest" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              className="absolute right-0 top-6 rounded-2xl rounded-br-sm bg-leaf-700 px-4 py-2 font-display text-sm font-semibold text-cream-100 shadow-soft"
            >
              time to breathe…
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The timer */}
      <div>
        <div className="mb-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => choosePreset(p)}
              title={p.note}
              className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                preset.id === p.id
                  ? "bg-leaf-700 text-cream-50 shadow-soft"
                  : "bg-cream-100 text-leaf-700 hover:bg-cream-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {/* progress ring */}
          <div className="relative h-32 w-32 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-cream-200)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold tabular-nums text-leaf-800">
                {fmt(secondsLeft)}
              </span>
            </div>
          </div>

          <div className="min-h-28">
            <h3 className="font-display text-xl font-bold text-leaf-800">{COPY[phase].title}</h3>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">{COPY[phase].body}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {phase === "idle" && (
            <button
              onClick={start}
              className="rounded-full bg-sun-400 px-7 py-3 font-display font-bold text-leaf-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-sun-300 hover:shadow-lift"
            >
              Start focusing 🌻
            </button>
          )}
          {phase === "focus" && (
            <>
              <button
                onClick={() => setSecondsLeft(0)}
                className="rounded-full bg-leaf-700 px-6 py-3 font-display font-bold text-cream-50 shadow-soft transition hover:bg-leaf-600"
              >
                Skip to the bend
              </button>
              <button onClick={stop} className="rounded-full px-5 py-3 font-display font-semibold text-ink-soft hover:text-leaf-700">
                Stop session
              </button>
            </>
          )}
          {phase === "rest" && (
            <button
              onClick={finishBreak}
              className="rounded-full bg-tulip px-7 py-3 font-display font-bold text-cream-50 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              I took my break 🌿
            </button>
          )}
          {completed > 0 && (
            <span className="font-display text-sm font-semibold text-leaf-600">
              {"🌼".repeat(Math.min(completed, 8))} {completed} session{completed > 1 ? "s" : ""} today
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
