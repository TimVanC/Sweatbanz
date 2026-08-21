# SWEATBANZ

A daily NBA guessing game. You are a team-season. Ask an AI questions about yourself until you figure out who you are.

Spec: see the PRD (`sweatbanz-prd.md`). This repo is at **Phase 2**: one dossier, live `/api/ask`, chat UI, and a Supabase-backed store (puzzles/sessions/turns/stats) with an in-memory fallback for local dev.

Deployed at https://sweatbanz.vercel.app (Vercel project `sweatbanz`, auto-deploys from `main`).

## Setup

1. Put your Anthropic API key in `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
2. (Optional) Point it at Supabase. Without these, sessions live in server memory and reset on restart:
   ```
   SUPABASE_URL=https://<ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
   Apply `supabase/migrations/0001_init.sql` to the project, then seed puzzle #1:
   ```
   npx tsx scripts/seed-puzzle.ts
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open http://localhost:3000 and play.

## How it works

- `lib/dossiers/2004-det.ts` — the hand-authored dossier (facts + vibes). The model's entire world.
- `lib/prompt.ts` — system prompt: turn contract, taunt ladder, ban list, injection resistance. Static per dossier so prompt caching works.
- `lib/leakFilter.ts` — regex output filter over team/city/aliases/arena/roster names. On a hit the route retries once with a stricter reminder, then falls back to "Not answering that one." Test: `npx tsx scripts/leak-filter-test.ts`.
- `lib/store.ts` — `Store` interface with two backends: Supabase (when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set) or in-memory. Puzzle ids and dossiers never leave the server; `/api/puzzle` exposes only the puzzle number.
- `supabase/migrations/0001_init.sql` — schema from PRD §5 plus `bump_plays` / `record_solve` functions that maintain `stats_daily`. RLS on with no policies, so only the service role can read anything.
- `app/api/ask/route.ts` — the only model call site. `claude-haiku-4-5`, structured JSON output (`TurnResponse`), 25-question cap per session, 30 games per IP per day.
- `app/page.tsx` — sweatband header with puzzle number, chat log, Ask/Guess buttons, tone squares, win flip. Anonymous `user_key` in localStorage.

The API key and service role key never touch the browser — all calls go through route handlers.

## Scripts

- `npx tsx scripts/playtest.ts <port>` — 18-turn scripted game against a running dev server (vibes, injection attacks, fuzzy/wrong/right guesses).
- `npx tsx scripts/leak-filter-test.ts` — leak filter unit cases.
- `npx tsx scripts/seed-puzzle.ts` — upsert the dossier as puzzle #1 in Supabase.

## Next phases

- **Phase 3** — daily rotation by `play_date`, share block, local streak.
- **Phase 4** — flip animation with era-correct logo, difficulty curve across the week.
