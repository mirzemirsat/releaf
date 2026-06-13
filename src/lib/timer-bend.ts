import { clamp } from "./scroll-bend";

/**
 * Map timer state → Sunny's bendProgress. The timer (seconds) is the single
 * source of truth; these are pure and exactly mirror the acceptance tests.
 */

/** Focus phase: upright at the start, fully bent as the timer hits zero. */
export function getFocusBendProgress(totalDuration: number, remainingTime: number): number {
  if (totalDuration <= 0) return 0;
  const elapsed = totalDuration - remainingTime;
  return clamp(elapsed / totalDuration, 0, 1);
}

/** Break phase: fully bent at the start, rising back to upright as it ends. */
export function getBreakBendProgress(totalBreakDuration: number, remainingBreakTime: number): number {
  if (totalBreakDuration <= 0) return 0;
  const breakElapsed = totalBreakDuration - remainingBreakTime;
  const breakProgress = clamp(breakElapsed / totalBreakDuration, 0, 1);
  return 1 - breakProgress;
}

/** Linear interpolation used to smooth Sunny toward the timer-derived value. */
export function lerp(current: number, target: number, amount: number): number {
  return current + (target - current) * amount;
}
