"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Tone, Turn } from "@/lib/types";

type ChatEntry = { role: "player" | "card"; text: string; kind?: string };
type Reveal = { team: string; season: string };

type AskResult = {
  kind: "answer" | "guess_wrong" | "guess_right" | "refuse";
  text: string;
  countsAsQuestion: boolean;
  tone: Tone;
  questionCount: number;
  wrongGuesses: number;
  won: boolean;
  over: boolean;
  reveal: Reveal | null;
  closer: string | null;
  error?: string;
};

type Game = {
  number: number;
  turns: Turn[];
  entries: ChatEntry[];
  squares: string[];
  questionCount: number;
  wrongGuesses: number;
  over: boolean;
  won: boolean;
  reveal: Reveal | null;
  closer: string | null;
  recorded: boolean;
};

type Stats = {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
  lastNumber: number | null;
  dist: Record<string, number>;
};

const TONE_SQUARE: Record<string, string> = { clean: "🟩", hedge: "🟨", dunno: "⬜", guess_wrong: "🟥" };
const SITE = "sweatbanz.vercel.app";
// iOS commits a pending autocorrect suggestion when you tap send, which fires a
// change event after the draft was cleared and re-fills the field. Drop those.
const SEND_ECHO_WINDOW_MS = 400;
const COMPOSER_MAX_PX = 128;

const freshGame = (number: number): Game => ({
  number, turns: [], entries: [], squares: [], questionCount: 0, wrongGuesses: 0,
  over: false, won: false, reveal: null, closer: null, recorded: false,
});
const freshStats = (): Stats => ({ played: 0, won: 0, streak: 0, maxStreak: 0, lastNumber: null, dist: {} });

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function shareText(g: Game): string {
  const line = `${g.squares.join("")} — ${g.won ? g.questionCount : "✗"}`;
  return [`SWEATBANZ #${g.number}`, line, `💀 ${g.wrongGuesses}`, "", g.closer ? `"${g.closer}"` : "", "", SITE]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [stats, setStats] = useState<Stats>(freshStats);
  const [nextAt, setNextAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSentAt = useRef(0);

  const scrollToEnd = useCallback((smooth = false) => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Boot: find out which puzzle today is, restore any in-progress game for it.
  useEffect(() => {
    setStats(load("sweatbanz:stats", freshStats()));
    fetch("/api/puzzle")
      .then((r) => r.json())
      .then((d: { number: number; nextAt: string }) => {
        setNextAt(Date.parse(d.nextAt));
        setGame(load(`sweatbanz:game:${d.number}`, freshGame(d.number)));
      })
      .catch(() => setGame(freshGame(1)));
  }, []);

  // Persist the game whenever it changes.
  useEffect(() => {
    if (game) save(`sweatbanz:game:${game.number}`, game);
  }, [game]);

  // Record stats exactly once when a game ends.
  useEffect(() => {
    if (!game?.over || game.recorded) return;
    setStats((s) => {
      const continues = s.lastNumber === null || s.lastNumber === game.number - 1;
      const streak = game.won ? (continues ? s.streak + 1 : 1) : 0;
      const next: Stats = {
        played: s.played + 1,
        won: s.won + (game.won ? 1 : 0),
        streak,
        maxStreak: Math.max(s.maxStreak, streak),
        lastNumber: game.number,
        dist: game.won ? { ...s.dist, [game.questionCount]: (s.dist[game.questionCount] ?? 0) + 1 } : s.dist,
      };
      save("sweatbanz:stats", next);
      return next;
    });
    setGame((g) => (g ? { ...g, recorded: true } : g));
  }, [game]);

  // Keep the newest message visible: on new content, and when the mobile
  // keyboard opens/closes (the visual viewport shrinks after focus fires).
  useEffect(() => {
    scrollToEnd();
  }, [game?.entries.length, busy, scrollToEnd]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => scrollToEnd();
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, [scrollToEnd]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Auto-grow the composer up to a cap, then scroll inside.
  const autosize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_PX)}px`;
  }, []);
  useEffect(autosize, [input, autosize]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (Date.now() - lastSentAt.current < SEND_ECHO_WINDOW_MS && v.length > 0) {
      e.target.value = ""; // autocorrect echo — force-clear the native field
      return;
    }
    setInput(v);
  };

  const send = useCallback(
    async (asGuess: boolean) => {
      const raw = input.trim();
      if (!raw || busy || !game || game.over) return;
      const text = asGuess && !/guess/i.test(raw) ? `My guess: ${raw}` : raw;
      lastSentAt.current = Date.now();
      setInput("");
      if (inputRef.current) inputRef.current.value = "";
      setBusy(true);
      setGame((g) => (g ? { ...g, entries: [...g.entries, { role: "player", text }] } : g));

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: game.number, question: text, history: game.turns }),
        });
        const data: AskResult = await res.json();
        if (!res.ok) {
          setGame((g) => (g ? { ...g, entries: [...g.entries, { role: "card", text: data.error ?? "Nope. Ask again." }] } : g));
          return;
        }
        const turn: Turn = {
          question: text,
          response: { kind: data.kind, text: data.text, countsAsQuestion: data.countsAsQuestion, tone: data.tone },
        };
        const square = data.kind === "guess_wrong" ? TONE_SQUARE.guess_wrong : data.countsAsQuestion ? TONE_SQUARE[data.tone] ?? "⬜" : null;
        setGame((g) =>
          g
            ? {
                ...g,
                turns: [...g.turns, turn],
                entries: [...g.entries, { role: "card", text: data.text, kind: data.kind }],
                squares: square ? [...g.squares, square] : g.squares,
                questionCount: data.questionCount,
                wrongGuesses: data.wrongGuesses,
                over: data.over,
                won: data.won,
                reveal: data.reveal,
                closer: data.closer,
              }
            : g
        );
        if (data.over) inputRef.current?.blur();
      } catch {
        setGame((g) => (g ? { ...g, entries: [...g.entries, { role: "card", text: "The guy holding your card walked off. Try again." }] } : g));
      } finally {
        setBusy(false);
      }
    },
    [input, busy, game]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(false);
    }
  }

  async function share() {
    if (!game) return;
    const text = shareText(game);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (navigator.share) navigator.share({ text }).catch(() => {});
    }
  }

  const over = !!game?.over;
  const reveal = game?.reveal ?? null;
  const hasText = input.trim().length > 0;
  const canSend = hasText && !busy && !over && !!game;
  const winPct = stats.played ? Math.round((100 * stats.won) / stats.played) : 0;
  const dismissKeyboard = () => inputRef.current?.blur();

  return (
    <main className="flex flex-col flex-1 max-w-xl w-full mx-auto min-h-dvh">
      {/* The sweatband */}
      <header className="terry sticky top-0 z-10 text-band-cream shadow-lg">
        <div className="h-1.5 bg-band-blue" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className={`w-12 h-12 shrink-0 rounded-full bg-band-cream text-band-red flex items-center justify-center font-[family-name:var(--font-display)] text-2xl border-4 border-band-blue ${
              over ? "flip-in" : ""
            }`}
            aria-live="polite"
          >
            {over ? (game?.won ? "🏆" : "💀") : "?"}
          </div>
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-wide">
              SWEATBANZ
              {game && <span className="text-base opacity-80 ml-2">#{game.number}</span>}
            </h1>
            {reveal ? (
              <p className="text-sm font-bold truncate">
                {reveal.season} {reveal.team}
              </p>
            ) : (
              <p className="text-xs opacity-80">you are a team-season. figure out who you are.</p>
            )}
          </div>
          <div className="ml-auto text-right text-xs leading-tight">
            <div className="font-bold text-base">{game?.questionCount ?? 0}</div>
            <div className="opacity-80">questions</div>
            {(game?.wrongGuesses ?? 0) > 0 && <div>💀 {game?.wrongGuesses}</div>}
          </div>
        </div>
        <div className="h-1.5 bg-band-blue" />
      </header>

      {/* Chat log. Touching or dragging it dismisses the keyboard (messaging-app
          standard); buttons inside still get their taps. */}
      <div
        className="flex-1 px-4 py-4 space-y-3 overflow-y-auto"
        onTouchStart={dismissKeyboard}
        onTouchMove={dismissKeyboard}
      >
        {game && game.entries.length === 0 && (
          <p className="text-center text-sm opacity-60 pt-10">
            The card is on your forehead. Everyone else can see it.
            <br />
            Ask something. Or sit there.
          </p>
        )}
        {game?.entries.map((e, i) =>
          e.role === "player" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-foreground/5 px-3 py-2 text-[15px] whitespace-pre-wrap">{e.text}</div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div
                className={`max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-[16px] shadow-sm border ${
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
            <div className="rounded-2xl rounded-bl-sm bg-white border border-black/10 px-4 py-2.5 text-sm opacity-60">…</div>
          </div>
        )}

        {/* End of game */}
        {game && over && (
          <div className="mt-6 rounded-2xl border-2 border-band-blue bg-white p-4 space-y-3 flip-in">
            <pre className="font-sans whitespace-pre-wrap text-center text-[15px] leading-relaxed">{shareText(game)}</pre>
            <button
              type="button"
              onClick={share}
              className="w-full rounded-full bg-band-blue text-band-cream py-2.5 font-bold focus-visible:ring-2 focus-visible:ring-band-red"
            >
              {copied ? "Copied. Go rub it in." : "Share"}
            </button>
            <div className="grid grid-cols-4 text-center text-xs pt-2 border-t border-black/10">
              <div><div className="text-lg font-bold">{stats.played}</div>played</div>
              <div><div className="text-lg font-bold">{winPct}%</div>won</div>
              <div><div className="text-lg font-bold">{stats.streak}</div>streak</div>
              <div><div className="text-lg font-bold">{stats.maxStreak}</div>best</div>
            </div>
            {nextAt && <p className="text-center text-xs opacity-60">next card in {fmtCountdown(nextAt - now)}</p>}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer: bordered card, text alone on top, controls on a row below.
          Sticks above the keyboard via dvh; the textarea is never unmounted so
          sending doesn't drop the keyboard. */}
      <form
        className="sticky bottom-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-background"
        onSubmit={(e) => {
          e.preventDefault();
          send(false);
        }}
      >
        <div
          className={`rounded-3xl border bg-white shadow-sm transition-colors ${
            over ? "border-black/10 opacity-60" : "border-black/20 focus-within:border-band-blue"
          }`}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={() => setTimeout(() => scrollToEnd(), 80)}
            placeholder={over ? (game?.won ? "You won. Go brag." : "The card won. Tomorrow.") : "Am I…?"}
            disabled={over || !game}
            enterKeyHint="send"
            autoCapitalize="sentences"
            autoComplete="off"
            maxLength={300}
            // 16px minimum: anything smaller makes iOS Safari zoom the page on focus.
            className="block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-[16px] leading-6 outline-none placeholder:text-black/40 disabled:cursor-not-allowed"
            style={{ maxHeight: COMPOSER_MAX_PX }}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <button
              type="button"
              onClick={() => send(true)}
              disabled={!canSend}
              className="rounded-full bg-band-red/10 text-band-red px-3.5 py-1.5 text-sm font-bold transition-opacity disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-band-blue"
            >
              Guess
            </button>
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Ask"
              className={`w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-band-blue ${
                hasText && !over ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
