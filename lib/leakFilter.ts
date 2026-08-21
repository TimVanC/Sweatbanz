import type { Dossier } from "./types";

// Build the banned-term list for a dossier: team name, city, aliases, arena,
// and every roster/coach name (full names and surnames).
export function bannedTerms(dossier: Dossier): string[] {
  const terms = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (t.length >= 3) terms.add(t.toLowerCase());
  };

  add(dossier.team);
  add(dossier.city);
  dossier.aliases.forEach(add);
  add(dossier.facts.arena);
  // "The Palace of Auburn Hills" → also ban "Palace" and "Auburn Hills"
  add("Auburn Hills");
  add("Palace");

  const people = [dossier.facts.coach, ...dossier.facts.roster.map((p) => p.name)];
  for (const name of people) {
    add(name);
    const parts = name.split(/\s+/);
    if (parts.length > 1) add(parts[parts.length - 1]);
    add(parts[0]);
  }
  return [...terms];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Returns the first banned term found in the text, or null if clean.
export function findLeak(text: string, dossier: Dossier): string | null {
  for (const term of bannedTerms(dossier)) {
    const re = new RegExp(`\\b${escapeRe(term)}\\b`, "i");
    if (re.test(text)) return term;
  }
  return null;
}
