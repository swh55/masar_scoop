import { NextResponse } from "next/server";
import { getUserXPData } from "@/lib/xp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const data = await getUserXPData(sessionId);
  return NextResponse.json(data);
}
