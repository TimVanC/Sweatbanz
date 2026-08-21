import type { Dossier } from "./types";
import { dossier as det2004 } from "./dossiers/2004-det";
import { dossier as gsw2016 } from "./dossiers/2016-gsw";
import { dossier as dal2011 } from "./dossiers/2011-dal";
import { dossier as bos2008 } from "./dossiers/2008-bos";
import { dossier as mia2013 } from "./dossiers/2013-mia";
import { dossier as nyk2024 } from "./dossiers/2024-nyk";

// Daily rotation. Puzzle #1 runs on EPOCH (NBA time = Eastern); the list cycles
// after it runs out, so add dossiers faster than one per day to avoid repeats.
export const ROTATION: Dossier[] = [det2004, nyk2024, gsw2016, dal2011, mia2013, bos2008];

export const EPOCH = "2026-08-21";
export const TZ = "America/New_York";

/** YYYY-MM-DD for `d` in the game's timezone. */
export function localDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function dayIndex(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function numberForDate(ymd: string): number {
  return dayIndex(ymd) - dayIndex(EPOCH) + 1;
}

export function todayNumber(): number {
  return Math.max(1, numberForDate(localDate()));
}

export function dossierForNumber(n: number): Dossier | null {
  if (!Number.isInteger(n) || n < 1) return null;
  return ROTATION[(n - 1) % ROTATION.length];
}

/** Next local midnight in TZ, as an absolute instant. */
export function nextPuzzleAt(now: Date = new Date()): Date {
  const today = localDate(now);
  // Walk forward in 15-minute steps until the local date flips, then snap back to the minute.
  let t = Math.floor(now.getTime() / 60_000) * 60_000;
  while (localDate(new Date(t)) === today) t += 15 * 60_000;
  while (localDate(new Date(t - 60_000)) !== today) t -= 60_000;
  return new Date(t);
}
