import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildSystemPrompt, buildTurnMessage, buildHistory } from "@/lib/prompt";
import { findLeak } from "@/lib/leakFilter";
import { store, hashIp } from "@/lib/store";
import type { Dossier, TurnResponse } from "@/lib/types";

const MODEL = "claude-haiku-4-5";
const MAX_QUESTIONS = 25;
const MAX_GAMES_PER_IP_PER_DAY = 30;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

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
  if (response.stop_reason === "max_tokens") {
    throw new Error("response truncated");
  }
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text) as TurnResponse;
}

async function answer(
  dossier: Dossier,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  turnMsg: string
): Promise<TurnResponse> {
  const system = buildSystemPrompt(dossier);
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

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set." }, { status: 500 });
  }

  let body: { sessionId?: string; userKey?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { sessionId, userKey, question } = body;
  if (
    !sessionId || !UUID_RE.test(sessionId) ||
    !userKey || userKey.length > 64 ||
    !question?.trim() || question.length > 500
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipHash = hashIp(ip);

  try {
    if (ipHash && (await store.sessionsTodayForIp(ipHash)) >= MAX_GAMES_PER_IP_PER_DAY) {
      return NextResponse.json({ error: "That's enough games for one day. Come back tomorrow." }, { status: 429 });
    }

    const state = await store.loadOrCreateSession(sessionId, userKey, ipHash);
    if (state.solved) {
      return NextResponse.json({ error: "already solved" }, { status: 409 });
    }
    if (state.questionCount >= MAX_QUESTIONS) {
      return NextResponse.json({ error: "Out of questions. The card wins." }, { status: 429 });
    }

    const puzzle = await store.puzzleById(state.puzzleId);
    if (!puzzle) return NextResponse.json({ error: "puzzle missing" }, { status: 500 });

    const history = buildHistory(state.turns);
    const turnMsg = buildTurnMessage(question.trim(), state.questionCount, state.wrongGuesses);
    const turn = await answer(puzzle.dossier, history, turnMsg);

    await store.appendTurn(sessionId, state, { question: question.trim(), response: turn });

    return NextResponse.json({
      ...turn,
      questionCount: state.questionCount + (turn.countsAsQuestion ? 1 : 0),
      wrongGuesses: state.wrongGuesses + (turn.kind === "guess_wrong" ? 1 : 0),
      reveal: turn.kind === "guess_right" ? { team: puzzle.dossier.team, season: puzzle.dossier.season } : null,
    });
  } catch (err) {
    console.error("[/api/ask]", err);
    return NextResponse.json({ error: "The guy holding your card walked off. Try again." }, { status: 502 });
  }
}
