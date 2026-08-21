// Seed (or update) a puzzle row from a dossier file.
// Run: npx tsx scripts/seed-puzzle.ts   (reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local)
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { dossier } from "../lib/dossiers/2004-det";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

const { error } = await sb.from("puzzles").upsert(
  { id: dossier.id, puzzle_number: 1, dossier, difficulty: "medium", published: true },
  { onConflict: "id" }
);
if (error) {
  console.error(error);
  process.exit(1);
}
console.log(`seeded puzzle #1: ${dossier.id}`);
