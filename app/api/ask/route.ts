import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { dossier } from "@/lib/dossiers/2004-det";
import { buildSystemPrompt, buildTurnMessage, buildHistory } from "@/lib/prompt";
import { findLeak } from "@/lib/leakFilter";
import { getSession } from "@/lib/store";
import type { TurnResponse } from "@/lib/types";

const MODEL = "claude-haiku-4-5";
const MAX_QUESTIONS = 25;

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

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart." },
      { status: 500 }
    );
  }

  let body: { sessionId?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { sessionId, question } = body;
  if (!sessionId || !question?.trim() || question.length > 500) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (session.solved) {
    return NextResponse.json({ error: "already solved" }, { status: 409 });
  }

  const questionCount = session.turns.filter((t) => t.response.countsAsQuestion).length;
  const wrongGuesses = session.turns.filter((t) => t.response.kind === "guess_wrong").length;
  if (questionCount >= MAX_QUESTIONS) {
    return NextResponse.json({ error: "out of questions" }, { status: 429 });
  }

  const system = buildSystemPrompt(dossier);
  const history = buildHistory(session.turns);
  const turnMsg = buildTurnMessage(question.trim(), questionCount, wrongGuesses);

  let turn: TurnResponse;
  try {
    turn = await callModel(system, [...history, { role: "user", content: turnMsg }]);

    // Leak filter (skipped on a correct guess — the reveal is allowed).
    if (turn.kind !== "guess_right" && findLeak(turn.text, dossier)) {
      // Retry once with a stricter reminder.
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
        turn = {
          kind: turn.kind,
          text: "Not answering that one.",
          countsAsQuestion: turn.countsAsQuestion,
          tone: "dunno",
        };
      }
    }
  } catch (err) {
    console.error("[/api/ask]", err);
    return NextResponse.json({ error: "The guy holding your card walked off. Try again." }, { status: 502 });
  }

  session.turns.push({ question: question.trim(), response: turn });
  if (turn.kind === "guess_right") session.solved = true;

  return NextResponse.json({
    ...turn,
    questionCount: questionCount + (turn.countsAsQuestion ? 1 : 0),
    wrongGuesses: wrongGuesses + (turn.kind === "guess_wrong" ? 1 : 0),
    reveal: turn.kind === "guess_right" ? { team: dossier.team, season: dossier.season } : null,
  });
}
