import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "../../../db/client";
import { scores } from "../../../db/schema";

export const runtime = "nodejs";

// GET /api/scores - return top 10 scores
export async function GET() {
  const entries = await db
    .select()
    .from(scores)
    .orderBy(sql`${scores.score} desc`)
    .limit(10);
  return NextResponse.json(entries);
}

// POST /api/scores - submit a new score
export async function POST(req: Request) {
  try {
    const { name, score } = await req.json();
    if (!name || typeof score !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const [entry] = await db.insert(scores).values({ name, score }).returning();
    return NextResponse.json(entry);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
