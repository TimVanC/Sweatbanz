import { seasonCheck } from "../lib/prompt";
import { dossier as nyk } from "../lib/dossiers/2024-nyk"; // 2023-24
import { dossier as det } from "../lib/dossiers/2004-det"; // 2003-04
const cases: Array<[string, typeof nyk, string]> = [
  ["2004 pistons", nyk, "not this card's franchise"],
  ["2004 Knicks", nyk, "2004 = EARLIER"],
  ["2020 New York", nyk, "2020 = EARLIER"],
  ["2024-25 Knicks", nyk, "2024-25 = LATER"],
  ["2023-24 knicks", nyk, "2023-24 = matches"],
  ["2024 Knicks", nyk, "2024 = matches"],
  ["2023 Knicks", nyk, "2023 = matches"],
  ["Knicks?", nyk, "did NOT name"],
  ["Am I the '04 Pistons?", det, "'04 = matches"],
  ["2005-06 Pistons", det, "2005-06 = LATER"],
  ["2005-06 Spurs", det, "not this card's franchise"],
  ["Did I play the Lakers in 2004?", det, "not this card's franchise"],
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
