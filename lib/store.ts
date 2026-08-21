import { createHash } from "node:crypto";
import { db, hasSupabase } from "./db";
import { dossier as fallbackDossier } from "./dossiers/2004-det";
import type { Dossier, Turn } from "./types";

export type Puzzle = { id: string; number: number | null; dossier: Dossier };

export type SessionState = {
  puzzleId: string;
  turns: Turn[];
  solved: boolean;
  questionCount: number;
  wrongGuesses: number;
};

export interface Store {
  /** Today's puzzle (or the latest published one). */
  currentPuzzle(): Promise<Puzzle>;
  puzzleById(id: string): Promise<Puzzle | null>;
  /** Load a session, creating it against the current puzzle if it doesn't exist. */
  loadOrCreateSession(sessionId: string, userKey: string, ipHash: string | null): Promise<SessionState>;
  appendTurn(sessionId: string, state: SessionState, turn: Turn): Promise<void>;
  /** Games started from this IP in the last 24h (rate limiting). */
  sessionsTodayForIp(ipHash: string): Promise<number>;
}

export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "sweatbanz";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

function counts(turns: Turn[]) {
  return {
    questionCount: turns.filter((t) => t.response.countsAsQuestion).length,
    wrongGuesses: turns.filter((t) => t.response.kind === "guess_wrong").length,
    solved: turns.some((t) => t.response.kind === "guess_right"),
  };
}

// ---------- In-memory backend (local dev without Supabase) ----------

type MemSession = { puzzleId: string; turns: Turn[]; ipHash: string | null; startedAt: number };
const g = globalThis as typeof globalThis & { __sweatbanzSessions?: Map<string, MemSession> };
const memSessions = (g.__sweatbanzSessions ??= new Map<string, MemSession>());

const memoryStore: Store = {
  async currentPuzzle() {
    return { id: fallbackDossier.id, number: 1, dossier: fallbackDossier };
  },
  async puzzleById(id) {
    return id === fallbackDossier.id ? { id, number: 1, dossier: fallbackDossier } : null;
  },
  async loadOrCreateSession(sessionId, _userKey, ipHash) {
    let s = memSessions.get(sessionId);
    if (!s) {
      s = { puzzleId: fallbackDossier.id, turns: [], ipHash, startedAt: Date.now() };
      memSessions.set(sessionId, s);
    }
    return { puzzleId: s.puzzleId, turns: s.turns, ...counts(s.turns) };
  },
  async appendTurn(sessionId, _state, turn) {
    memSessions.get(sessionId)?.turns.push(turn);
  },
  async sessionsTodayForIp(ipHash) {
    const cutoff = Date.now() - 86_400_000;
    return [...memSessions.values()].filter((s) => s.ipHash === ipHash && s.startedAt > cutoff).length;
  },
};

// ---------- Supabase backend ----------

const supabaseStore: Store = {
  async currentPuzzle() {
    const today = new Date().toISOString().slice(0, 10);
    const sb = db();
    let { data } = await sb
      .from("puzzles")
      .select("id, puzzle_number, dossier")
      .eq("published", true)
      .eq("play_date", today)
      .maybeSingle();
    if (!data) {
      const res = await sb
        .from("puzzles")
        .select("id, puzzle_number, dossier")
        .eq("published", true)
        .order("puzzle_number", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      data = res.data;
    }
    if (!data) throw new Error("no published puzzle");
    return { id: data.id, number: data.puzzle_number, dossier: data.dossier as Dossier };
  },

  async puzzleById(id) {
    const { data } = await db().from("puzzles").select("id, puzzle_number, dossier").eq("id", id).maybeSingle();
    return data ? { id: data.id, number: data.puzzle_number, dossier: data.dossier as Dossier } : null;
  },

  async loadOrCreateSession(sessionId, userKey, ipHash) {
    const sb = db();
    const { data: existing, error } = await sb
      .from("sessions")
      .select("puzzle_id")
      .eq("id", sessionId)
      .maybeSingle();
    if (error) throw error;

    let puzzleId: string;
    if (existing) {
      puzzleId = existing.puzzle_id;
    } else {
      const puzzle = await this.currentPuzzle();
      puzzleId = puzzle.id;
      const { error: insErr } = await sb
        .from("sessions")
        .insert({ id: sessionId, puzzle_id: puzzleId, user_key: userKey, ip_hash: ipHash });
      if (insErr) throw insErr;
      await sb.rpc("bump_plays", { p_puzzle_id: puzzleId });
    }

    const { data: rows, error: tErr } = await sb
      .from("turns")
      .select("question, response")
      .eq("session_id", sessionId)
      .order("idx", { ascending: true });
    if (tErr) throw tErr;
    const turns: Turn[] = (rows ?? []).map((r) => ({ question: r.question, response: r.response }));
    return { puzzleId, turns, ...counts(turns) };
  },

  async appendTurn(sessionId, state, turn) {
    const sb = db();
    const { error } = await sb.from("turns").insert({
      session_id: sessionId,
      idx: state.turns.length,
      question: turn.question,
      response: turn.response,
    });
    if (error) throw error;

    const solved = turn.response.kind === "guess_right";
    const questionCount = state.questionCount + (turn.response.countsAsQuestion ? 1 : 0);
    const wrongGuesses = state.wrongGuesses + (turn.response.kind === "guess_wrong" ? 1 : 0);
    await sb
      .from("sessions")
      .update({
        question_count: questionCount,
        wrong_guesses: wrongGuesses,
        ...(solved ? { solved_at: new Date().toISOString() } : {}),
      })
      .eq("id", sessionId);
    if (solved) await sb.rpc("record_solve", { p_puzzle_id: state.puzzleId, p_questions: questionCount });
  },

  async sessionsTodayForIp(ipHash) {
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { count } = await db()
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("started_at", since);
    return count ?? 0;
  },
};

export const store: Store = hasSupabase() ? supabaseStore : memoryStore;
export const storeBackend = hasSupabase() ? "supabase" : "memory";
