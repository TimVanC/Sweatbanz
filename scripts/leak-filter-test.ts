// Quick check of the §6 leak filter. Run: npx tsx scripts/leak-filter-test.ts
import { dossier } from "../lib/dossiers/2004-det";
import { findLeak } from "../lib/leakFilter";

const cases: Array<[string, boolean]> = [
  ["You won a title in June. Figure it out.", false],
  ["The Pistons? Never heard of them.", true],
  ["Your best defender wore a giant afro.", false],
  ["Ben Wallace was on the team.", true],
  ["It rhymes with Shmetroit.", false],
  ["Ask about the palace sometime.", true],
  ["My coach was Larry Brown.", true],
  ["Cold winters, warm summers. Midwest energy.", false],
  ["You're in the Motor City, genius.", true],
];

let pass = 0;
for (const [text, shouldLeak] of cases) {
  const got = findLeak(text, dossier);
  const ok = shouldLeak ? got !== null : got === null;
  console.log(ok ? "PASS" : "FAIL", JSON.stringify(text), "->", got);
  if (ok) pass++;
}
console.log(`${pass}/${cases.length}`);
if (pass !== cases.length) process.exit(1);
