import type { Dossier } from "./types";

// Names that are also ordinary English words. For these we only flag a
// capitalized occurrence that isn't at the start of a sentence — "Green and
// white" is fine, "ask Green about it" is a leak. Everything else is matched
// case-insensitively.
const COMMON_WORDS = new Set([
  "green", "house", "rush", "hart", "brown", "prince", "ham", "james", "jones", "cole",
  "miller", "lewis", "butler", "terry", "davis", "clark", "rose", "wade", "young", "long",
  "white", "hill", "price", "love", "bell", "hunter", "miles", "precious", "ray", "glen",
  "sam", "tony", "mike", "ian", "leon", "eddie", "chris", "paul", "kevin", "josh", "alec",
  "og", "marion", "powe", "burks", "sims", "heat", "bay", "city", "big",
]);

// Build the banned-term list for a dossier: team name, city, aliases, arena,
// and every roster/coach name (full names, surnames, first names).
export function bannedTerms(dossier: Dossier): string[] {
  const terms = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (t.length >= 2) terms.add(t.toLowerCase());
  };

  add(dossier.team);
  add(dossier.city);
  dossier.aliases.forEach(add);
  add(dossier.facts.arena);
  // Arena fragments that stand alone as giveaways.
  for (const frag of dossier.facts.arena.replace(/^the\s+/i, "").split(/\s+of\s+|\s+at\s+/i)) {
    if (frag.split(/\s+/).length <= 2 && !/^(arena|center|centre|garden)$/i.test(frag)) add(frag);
  }

  const people = [dossier.facts.coach, ...dossier.facts.roster.map((p) => p.name)];
  for (const name of people) {
    add(name);
    const parts = name.split(/\s+/);
    if (parts.length > 1) add(parts[parts.length - 1]);
    if (parts[0].length >= 3) add(parts[0]);
  }
  // Generic words that are only a leak as part of a longer alias.
  for (const t of ["heat", "bay", "city", "big", "ny"]) {
    if (!dossier.aliases.map((a) => a.toLowerCase()).includes(t)) terms.delete(t);
  }
  return [...terms];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Returns the first banned term found in the text, or null if clean.
export function findLeak(text: string, dossier: Dossier): string | null {
  for (const term of bannedTerms(dossier)) {
    if (COMMON_WORDS.has(term)) {
      // Capitalized, not at sentence start.
      const re = new RegExp(`(?<!(?:^|[.!?])\\s*)\\b${escapeRe(capitalize(term))}\\b`);
      if (re.test(text)) return term;
    } else {
      const re = new RegExp(`\\b${escapeRe(term)}\\b`, "i");
      if (re.test(text)) return term;
    }
  }
  return null;
}
