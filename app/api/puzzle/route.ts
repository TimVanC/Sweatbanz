import { NextResponse } from "next/server";
import { todayNumber, nextPuzzleAt } from "@/lib/puzzles";

// Public puzzle metadata only. Which team-season it is never leaves the server.
export async function GET() {
  return NextResponse.json({ number: todayNumber(), nextAt: nextPuzzleAt().toISOString() });
}
