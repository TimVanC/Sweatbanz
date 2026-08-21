"use client";

import { useEffect, useRef, useState } from "react";
import type { Tone } from "@/lib/types";

type ChatEntry = {
  role: "player" | "card";
  text: string;
  tone?: Tone;
  kind?: string;
};

type AskResult = {
  kind: "answer" | "guess_wrong" | "guess_right" | "refuse";
  text: string;
  countsAsQuestion: boolean;
  tone: Tone;
  questionCount: number;
  wrongGuesses: number;
  reveal: { team: string; season: string } | null;
  error?: string;
};

const TONE_SQUARE: Record<string, string> = {
  clean: "🟩",
  hedge: "🟨",
  dunno: "⬜",
  guess_wrong: "🟥",
};

function uuid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
}

// Anonymous local identity (PRD: no auth in v1).
function getUserKey(): string {
  try {
    const k = localStorage.getItem("sweatbanz:user");
    if (k) return k;
    const fresh = uuid();
    localStorage.setItem("sweatbanz:user", fresh);
    return fresh;
  } catch {
    return uuid();
  }
}

export default function Home() {
  const [sessionId] = useState(uuid);
  const [userKey, setUserKey] = useState<string>("");
  const [puzzleNumber, setPuzzleNumber] = useState<number | null>(null);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [squares, setSquares] = useState<string[]>([]);
  const [reveal, setReveal] = useState<{ team: string; season: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserKey(getUserKey());
    fetch("/api/puzzle")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPuzzleNumber(d.number))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  async function send(asGuess: boolean) {
    const raw = input.trim();
    if (!raw || busy || reveal) return;
    const text = asGuess && !/guess/i.test(raw) ? `My guess: ${raw}` : raw;
    setInput("");
    setBusy(true);
    setEntries((e) => [...e, { role: "player", text }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userKey: userKey || getUserKey(), question: text }),
      });
      const data: AskResult = await res.json();
      if (!res.ok) {
        setEntries((e) => [
          ...e,
          { role: "card", text: data.error ?? "Nope. Ask again.", tone: "dunno" },
        ]);
        return;
      }
      setEntries((e) => [
        ...e,
        { role: "card", text: data.text, tone: data.tone, kind: data.kind },
      ]);
      setQuestionCount(data.questionCount);
      setWrongGuesses(data.wrongGuesses);
      if (data.kind === "guess_wrong") {
        setSquares((s) => [...s, TONE_SQUARE.guess_wrong]);
      } else if (data.countsAsQuestion) {
        setSquares((s) => [...s, TONE_SQUARE[data.tone] ?? "⬜"]);
      }
      if (data.reveal) setReveal(data.reveal);
    } catch {
      setEntries((e) => [
        ...e,
        { role: "card", text: "The guy holding your card walked off. Try again.", tone: "dunno" },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <main className="flex flex-col flex-1 max-w-xl w-full mx-auto min-h-dvh">
      {/* The sweatband */}
      <header className="terry sticky top-0 z-10 text-band-cream shadow-lg">
        <div className="h-1.5 bg-band-blue" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className={`w-12 h-12 shrink-0 rounded-full bg-band-cream text-band-red flex items-center justify-center font-[family-name:var(--font-display)] text-2xl border-4 border-band-blue ${
              reveal ? "flip-in" : ""
            }`}
            aria-live="polite"
          >
            {reveal ? "🏆" : "?"}
          </div>
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-wide">
              SWEATBANZ
              {puzzleNumber !== null && (
                <span className="text-base opacity-80 ml-2">#{puzzleNumber}</span>
              )}
            </h1>
            {reveal ? (
              <p className="text-sm font-bold truncate">
                {reveal.season} {reveal.team}
              </p>
            ) : (
              <p className="text-xs opacity-80">
                you are a team-season. figure out who you are.
              </p>
            )}
          </div>
          <div className="ml-auto text-right text-xs leading-tight">
            <div className="font-bold text-base">{questionCount}</div>
            <div className="opacity-80">questions</div>
            {wrongGuesses > 0 && <div>💀 {wrongGuesses}</div>}
          </div>
        </div>
        <div className="h-1.5 bg-band-blue" />
      </header>

      {/* Chat log */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {entries.length === 0 && (
          <p className="text-center text-sm opacity-60 pt-10">
            The card is on your forehead. Everyone else can see it.
            <br />
            Ask something. Or sit there.
          </p>
        )}
        {entries.map((e, i) =>
          e.role === "player" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-foreground/5 px-3 py-2 text-sm">
                {e.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div
                className={`max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-[15px] shadow-sm border ${
                  e.kind === "guess_right"
                    ? "bg-band-blue text-band-cream border-band-blue"
                    : e.kind === "guess_wrong" || e.kind === "refuse"
                    ? "bg-band-red/10 border-band-red/30"
                    : "bg-white border-black/10"
                }`}
              >
                {e.text}
              </div>
            </div>
          )
        )}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white border border-black/10 px-4 py-2.5 text-sm opacity-60">
              …
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Win block */}
      {reveal && (
        <div className="px-4 pb-2 text-center text-lg tracking-widest" aria-label="result">
          {squares.join("")} — {questionCount} · 💀 {wrongGuesses}
        </div>
      )}

      {/* Input */}
      <form
        className="sticky bottom-0 flex gap-2 px-4 py-3 bg-background border-t border-black/10"
        onSubmit={(e) => {
          e.preventDefault();
          send(false);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={reveal ? "You won. Go brag." : "Am I…?"}
          disabled={busy || !!reveal}
          className="flex-1 min-w-0 rounded-full border border-black/20 bg-white px-4 py-2.5 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-band-blue disabled:opacity-50"
          maxLength={300}
          autoFocus
        />
        <button
          type="submit"
          disabled={busy || !!reveal || !input.trim()}
          className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-bold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-band-blue"
        >
          Ask
        </button>
        <button
          type="button"
          onClick={() => send(true)}
          disabled={busy || !!reveal || !input.trim()}
          className="rounded-full bg-band-red text-band-cream px-4 py-2 text-sm font-bold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-band-blue"
        >
          Guess
        </button>
      </form>
    </main>
  );
}
