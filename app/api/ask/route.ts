import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { buildSystemPrompt, buildTurnMessage, buildHistory, buildCloserPrompt } from "@/lib/prompt";
import { findLeak } from "@/lib/leakFilter";
import { dossierForNumber, todayNumber, localDate } from "@/lib/puzzles";
import type { Dossier, Turn, TurnResponse } from "@/lib/types";

// Stateless by design: the browser holds the transcript and sends it with every
// question, so this works across serverless instances with no database.

const MODEL = "claude-haiku-4-5";
const MAX_QUESTIONS = 25;
const MAX_REQUESTS_PER_IP_PER_DAY = 120; // ~4 full games
const KINDS = new Set(["answer", "guess_wrong", "guess_right", "refuse"]);
const TONES = new Set(["clean", "hedge", "dunno"]);

const turnSchema = {
  type: "object",
  properties: {
    kind: { type: "string", enum: ["answer", "guess_wrong", "guess_right", "refuse"] },
    text: { type: "string" },
    countsAsQuestion: { type: "boolean" },
    tone: { type: "string", enum: ["clean", "hedge", "dunno"] },
  },
  required: ["kind", "text", "countsAsQuestion", "tone"],
  additionalProperties: false,
} as const;

const closerSchema = {
  type: "object",
  properties: { closer: { type: "string" } },
  required: ["closer"],
  additionalProperties: false,
} as const;

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

// Best-effort per-instance rate limit. Good enough to stop a runaway script;
// not a substitute for real limits once there's a database.
const g = globalThis as typeof globalThis & { __sbRate?: Map<string, { day: string; n: number }> };
const rate = (g.__sbRate ??= new Map());
function overLimit(ipHash: string): boolean {
  const day = localDate();
  const r = rate.get(ipHash);
  if (!r || r.day !== day) {
    rate.set(ipHash, { day, n: 1 });
    return false;
  }
  r.n++;
  return r.n > MAX_REQUESTS_PER_IP_PER_DAY;
}

function hashIp(ip: string | null): string {
  return createHash("sha256").update((process.env.IP_HASH_SALT ?? "sweatbanz") + (ip ?? "")).digest("hex").slice(0, 32);
}

async function callModel(
  system: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<TurnResponse> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 200,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { format: { type: "json_schema", schema: turnSchema } },
  });
  if (response.stop_reason === "max_tokens") throw new Error("response truncated");
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text) as TurnResponse;
}

async function answer(dossier: Dossier, turns: Turn[], question: string, qCount: number, wrong: number): Promise<TurnResponse> {
  const system = buildSystemPrompt(dossier);
  const history = buildHistory(turns, dossier);
  const turnMsg = buildTurnMessage(question, qCount, wrong, dossier);
  let turn = await callModel(system, [...history, { role: "user", content: turnMsg }]);

  // Leak filter (skipped on a correct guess — the reveal is allowed).
  if (turn.kind !== "guess_right" && findLeak(turn.text, dossier)) {
    turn = await callModel(system, [
      ...history,
      {
        role: "user",
        content:
          turnMsg +
          "\n[reminder: your previous draft leaked a banned name. Re-answer WITHOUT the team, city, arena, alias, or any player/coach name.]",
      },
    ]);
    if (turn.kind !== "guess_right" && findLeak(turn.text, dossier)) {
      turn = { kind: turn.kind, text: "Not answering that one.", countsAsQuestion: turn.countsAsQuestion, tone: "dunno" };
    }
  }
  return turn;
}

async function closer(dossier: Dossier, turns: Turn[], won: boolean, questionCount: number, wrongGuesses: number): Promise<string> {
  const fallback = won
    ? `Got there in ${questionCount}. No notes.`
    : "Twenty-five questions. Nothing. Incredible.";
  try {
    const response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 120,
      messages: [{ role: "user", content: buildCloserPrompt(dossier, turns, { won, questionCount, wrongGuesses }) }],
      output_config: { format: { type: "json_schema", schema: closerSchema } },
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const line = (JSON.parse(text) as { closer: string }).closer.trim();
    if (!line || line.length > 160 || findLeak(line, dossier) || new RegExp(dossier.season.slice(0, 4)).test(line)) {
      return fallback;
    }
    return line;
  } catch (err) {
    console.error("[closer]", err);
    return fallback;
  }
}

function validTurn(t: unknown): t is Turn {
  if (!t || typeof t !== "object") return false;
  const { question, response } = t as Turn;
  return (
    typeof question === "string" && question.length <= 500 &&
    !!response && typeof response === "object" &&
    KINDS.has(response.kind) && TONES.has(response.tone) &&
    typeof response.text === "string" && response.text.length <= 600 &&
    typeof response.countsAsQuestion === "boolean"
  );
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set." }, { status: 500 });
  }

  let body: { number?: unknown; question?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const number = body.number;
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const history = body.history;
  // Outside production (or with SWEATBANZ_ANY_PUZZLE=1) any puzzle number is playable, for testing dossiers.
  const today = todayNumber();
  const anyPuzzle = process.env.NODE_ENV !== "production" || process.env.SWEATBANZ_ANY_PUZZLE === "1";
  if (
    typeof number !== "number" || !Number.isInteger(number) || number < 1 ||
    (!anyPuzzle && (number > today || number < today - 1)) ||
    !question || question.length > 500 ||
    !Array.isArray(history) || history.length > 80 || !history.every(validTurn)
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const ipHash = hashIp(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null);
  if (overLimit(ipHash)) {
    return NextResponse.json({ error: "That's enough for one day. Come back tomorrow." }, { status: 429 });
  }

  const dossier = dossierForNumber(number);
  if (!dossier) return NextResponse.json({ error: "no such puzzle" }, { status: 404 });

  const turns = history as Turn[];
  const questionCount = turns.filter((t) => t.response.countsAsQuestion).length;
  const wrongGuesses = turns.filter((t) => t.response.kind === "guess_wrong").length;
  if (turns.some((t) => t.response.kind === "guess_right")) {
    return NextResponse.json({ error: "already solved" }, { status: 409 });
  }
  if (questionCount >= MAX_QUESTIONS) {
    return NextResponse.json({ error: "Out of questions. The card wins." }, { status: 409 });
  }

  try {
    const turn = await answer(dossier, turns, question, questionCount, wrongGuesses);
    const newCount = questionCount + (turn.countsAsQuestion ? 1 : 0);
    const newWrong = wrongGuesses + (turn.kind === "guess_wrong" ? 1 : 0);
    const won = turn.kind === "guess_right";
    const over = won || newCount >= MAX_QUESTIONS;
    const allTurns = [...turns, { question, response: turn }];

    return NextResponse.json({
      ...turn,
      questionCount: newCount,
      wrongGuesses: newWrong,
      won,
      over,
      reveal: over ? { team: dossier.team, season: dossier.season } : null,
      closer: over ? await closer(dossier, allTurns, won, newCount, newWrong) : null,
    });
  } catch (err) {
    console.error("[/api/ask]", err);
    return NextResponse.json({ error: "The guy holding your card walked off. Try again." }, { status: 502 });
  }
}
