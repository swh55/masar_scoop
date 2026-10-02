import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/bookmarks?sessionId=...
 * Returns all bookmarked lesson IDs + details for the session.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId || sessionId === "ssr") {
    return NextResponse.json({ bookmarks: [], ids: [] });
  }

  const bookmarks = await db.bookmark.findMany({
    where: { sessionId },
    include: {
      lesson: {
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          duration: true,
          order: true,
          track: {
            select: {
              id: true,
              slug: true,
              title: true,
              color: true,
              icon: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    ids: bookmarks.map((b) => b.lessonId),
    bookmarks: bookmarks.map((b) => ({
      id: b.id,
      lessonId: b.lessonId,
      createdAt: b.createdAt,
      lesson: b.lesson,
    })),
  });
}

type Body = {
  sessionId: string;
  lessonId: string;
};

/**
 * POST /api/bookmarks
 * Toggles a bookmark (add if not present, remove if present).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.sessionId || !body.lessonId) {
    return NextResponse.json(
      { error: "sessionId and lessonId required" },
      { status: 400 }
    );
  }

  const existing = await db.bookmark.findUnique({
    where: {
      sessionId_lessonId: {
        sessionId: body.sessionId,
        lessonId: body.lessonId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  const bookmark = await db.bookmark.create({
    data: { sessionId: body.sessionId, lessonId: body.lessonId },
  });
  return NextResponse.json({ bookmarked: true, id: bookmark.id });
}
