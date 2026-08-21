import { NextResponse } from "next/server";
import { store, storeBackend } from "@/lib/store";

// Public puzzle metadata only. The puzzle id and dossier never leave the server.
export async function GET() {
  try {
    const puzzle = await store.currentPuzzle();
    return NextResponse.json({ number: puzzle.number, backend: storeBackend });
  } catch (err) {
    console.error("[/api/puzzle]", err);
    return NextResponse.json({ error: "no puzzle today" }, { status: 500 });
  }
}
