import type { Turn } from "./types";

// Phase 1: in-memory session store. Survives dev-server HMR via globalThis.
// Replaced by Supabase in Phase 2.
type Session = {
  turns: Turn[];
  solved: boolean;
};

const g = globalThis as typeof globalThis & {
  __sweatbanzSessions?: Map<string, Session>;
};

const sessions = (g.__sweatbanzSessions ??= new Map<string, Session>());

export function getSession(id: string): Session {
  let s = sessions.get(id);
  if (!s) {
    s = { turns: [], solved: false };
    sessions.set(id, s);
  }
  return s;
}
