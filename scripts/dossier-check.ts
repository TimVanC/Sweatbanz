// Sanity-check every dossier: does its own vibes/facts prose contain a word the
// leak filter would flag? If so, the model is being coached to say a banned word
// and will hit the retry/fallback path on legitimate answers. Fix the prose.
import { ROTATION } from "../lib/puzzles";
import { findLeak } from "../lib/leakFilter";

let problems = 0;
for (const d of ROTATION) {
  const fields: Record<string, string> = {
    ...Object.fromEntries(Object.entries(d.vibes)),
    coachNotes: d.facts.coachNotes,
    playoffResult: d.facts.playoffResult,
    teamLeaders: d.facts.teamLeaders,
    transactions: d.facts.transactions,
    ...Object.fromEntries(d.facts.roster.map((p) => [`roster:${p.name}`, p.notable])),
  };
  for (const [k, v] of Object.entries(fields)) {
    const leak = findLeak(v, d);
    if (leak) {
      problems++;
      console.log(`${d.id} ${k}: "${leak}"`);
    }
  }
}
console.log(problems ? `${problems} problem(s)` : `all ${ROTATION.length} dossiers clean`);
process.exit(problems ? 1 : 0);
