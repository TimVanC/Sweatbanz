# SWEATBANZ

A daily NBA guessing game. You are a team-season. Ask an AI questions about yourself until you figure out who you are.

Spec: see the PRD (`sweatbanz-prd.md`). This repo is at **Phase 3**: a daily rotation of hand-authored dossiers, a stateless live `/api/ask`, a share block with a model-written closing line, and localStorage stats/streaks. No database, no accounts.

Live at https://sweatbanz.vercel.app (Vercel project `sweatbanz`, auto-deploys from `main`).

## Setup

1. Put your Anthropic API key in `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
2. Run the dev server:
   ```
   npm run dev
   ```
3. Open http://localhost:3000 and play.

## How it works

- `lib/dossiers/*.ts` — hand-authored dossiers (verified facts + opinionated vibes). Each one is the model's entire world for that puzzle.
- `lib/puzzles.ts` — the daily rotation. Puzzle #1 ran on `EPOCH` (Eastern time); the list cycles, so keep adding dossiers. Outside production any puzzle number is playable (`?` → pass `number` to `/api/ask`), or set `SWEATBANZ_ANY_PUZZLE=1`.
- `lib/prompt.ts` — system prompt (turn contract, taunt ladder, ban list, injection resistance) and the closing-line prompt. Static per dossier so prompt caching works.
- `lib/leakFilter.ts` — output filter over team/city/aliases/arena/roster names. Names that are also English words only flag a capitalized mid-sentence use. On a hit the route retries once with a stricter reminder, then falls back to "Not answering that one."
- `app/api/ask/route.ts` — the only model call site. **Stateless**: the browser sends the full transcript with every question, so it works across serverless instances with no store. `claude-haiku-4-5`, structured JSON output, 25 questions per game, best-effort per-IP daily cap.
- `app/api/puzzle/route.ts` — today's puzzle number and the next rollover time. Nothing that identifies the team leaves the server.
- `app/page.tsx` — sweatband header, chat log, messaging-style composer, game persistence and stats in localStorage, share block.

The API key never touches the browser.

## Scripts

- `npx tsx scripts/playtest.ts <port> [puzzleNumber]` — 18-turn scripted game against a running dev server.
- `npx tsx scripts/leak-filter-test.ts` — leak filter unit cases.
- `npx tsx scripts/dossier-check.ts` — flags dossier prose that would trip its own leak filter (i.e. coaches the model to say a banned word). Run after editing any dossier.

## Adding a dossier

1. Copy an existing file in `lib/dossiers/`, fill in `facts` from Basketball Reference and `vibes` in prose. Use positions/descriptions, not names, in prose fields — names belong only in `roster[].name` and `coach`.
2. Add it to `ROTATION` in `lib/puzzles.ts`.
3. Run `scripts/dossier-check.ts`, then play it: `npx tsx scripts/playtest.ts <port> <number>`.

## Cost

Each question is one Haiku 4.5 call of roughly 4–5K input tokens and under 100 output tokens — about half a cent. A full game is 5–10 cents; a loss (25 questions) about 15 cents. Set a monthly spend limit in the Anthropic console as the hard ceiling.

## Next (Phase 4)

Flip animation with era-correct logo, difficulty curve across the week, more dossiers.
