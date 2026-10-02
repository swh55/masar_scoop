import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/daily-challenge
 *
 * Returns a deterministic "lesson of the day" based on the date.
 * The same lesson is returned for all users on the same day,
 * so it feels like a shared daily challenge.
 *
 * Also includes the user's completion status for this lesson.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  // Get all published lessons with their track info
  const lessons = await db.lesson.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      duration: true,
      order: true,
      trackId: true,
      track: {
        select: {
          id: true,
          slug: true,
          title: true,
          color: true,
          icon: true,
          level: true,
        },
      },
    },
  });

  if (lessons.length === 0) {
    return NextResponse.json({ error: "No lessons available" }, { status: 404 });
  }

  // Deterministic index based on the date (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  }
  const todaysLesson = lessons[hash % lessons.length];

  // Check if the user completed this lesson
  let completed = false;
  let bestScore = 0;
  if (sessionId && sessionId !== "ssr") {
    const progress = await db.lessonProgress.findUnique({
      where: {
        sessionId_lessonId: {
          sessionId,
          lessonId: todaysLesson.id,
        },
      },
    });
    completed = progress?.completed ?? false;
    bestScore = progress?.bestScore ?? 0;
  }

  // Calculate how many days since the lesson was first available
  // (just for display — shows "challenge #N")
  const epochDays = Math.floor(
    (Date.now() - new Date("2025-01-01").getTime()) / (1000 * 60 * 60 * 24)
  );

  return NextResponse.json({
    challengeDay: epochDays,
    lesson: {
      id: todaysLesson.id,
      slug: todaysLesson.slug,
      title: todaysLesson.title,
      summary: todaysLesson.summary,
      duration: todaysLesson.duration,
      order: todaysLesson.order,
      track: todaysLesson.track,
    },
    completed,
    bestScore,
  });
}
