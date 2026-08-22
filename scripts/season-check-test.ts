import { seasonCheck } from "../lib/prompt";
import { dossier as nyk } from "../lib/dossiers/2024-nyk"; // 2023-24
import { dossier as det } from "../lib/dossiers/2004-det"; // 2003-04
const cases: Array<[string, typeof nyk, string]> = [
  ["2004 pistons", nyk, "2004 = EARLIER"],
  ["2024-25 Knicks", nyk, "2024-25 = LATER"],
  ["2023-24 knicks", nyk, "2023-24 = matches"],
  ["2024 Knicks", nyk, "2024 = matches"],
  ["2023 Knicks", nyk, "2023 = matches"],
  ["Knicks?", nyk, "did NOT name"],
  ["Am I the '04 Pistons?", det, "'04 = matches"],
  ["2005-06 Pistons", det, "2005-06 = LATER"],
  ["Did I play the Lakers in 2004?", det, "2004 = matches"],
];
let pass = 0;
for (const [q, d, want] of cases) {
  const got = seasonCheck(q, d);
  const ok = got.includes(want);
  console.log(ok ? "PASS" : "FAIL", JSON.stringify(q), "->", got);
  if (ok) pass++;
}
console.log(`${pass}/${cases.length}`);
process.exit(pass === cases.length ? 0 : 1);
