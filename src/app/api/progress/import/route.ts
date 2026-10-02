import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardXP } from "@/lib/xp";

type ImportData = {
  version: string;
  trackProgress: { trackSlug: string; percent: number; lastOpenedAt: string }[];
  lessonProgress: {
    lessonSlug: string;
    completed: boolean;
    quizAttempts: number;
    bestScore: number;
  }[];
  bookmarks: { lessonSlug: string }[];
  ratings: { lessonSlug: string; rating: number; feedback?: string }[];
};

/**
 * POST /api/progress/import
 * Body: { sessionId, data: ImportData }
 *
 * Imports progress data from a JSON backup.
 * Uses upsert to avoid duplicates and merges with existing data.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    sessionId: string;
    data: ImportData;
  };

  if (!body.sessionId || !body.data) {
    return NextResponse.json(
      { error: "sessionId and data required" },
      { status: 400 }
    );
  }

  const { sessionId, data } = body;
  const results = {
    trackProgress: 0,
    lessonProgress: 0,
    bookmarks: 0,
    ratings: 0,
    errors: [] as string[],
  };

  // Import track progress
  if (data.trackProgress) {
    for (const tp of data.trackProgress) {
      try {
        const track = await db.track.findUnique({
          where: { slug: tp.trackSlug },
        });
        if (!track) {
          results.errors.push(`Track not found: ${tp.trackSlug}`);
          continue;
        }
        await db.trackProgress.upsert({
          where: {
            sessionId_trackId: { sessionId, trackId: track.id },
          },
          update: {
            percent: tp.percent,
            lastOpenedAt: new Date(tp.lastOpenedAt),
          },
          create: {
            sessionId,
            trackId: track.id,
            percent: tp.percent,
            lastOpenedAt: new Date(tp.lastOpenedAt),
          },
        });
        results.trackProgress++;
      } catch {
        results.errors.push(`Failed to import track: ${tp.trackSlug}`);
      }
    }
  }

  // Import lesson progress
  if (data.lessonProgress) {
    for (const lp of data.lessonProgress) {
      try {
        const lesson = await db.lesson.findUnique({
          where: { slug: lp.lessonSlug },
        });
        if (!lesson) {
          results.errors.push(`Lesson not found: ${lp.lessonSlug}`);
          continue;
        }
        await db.lessonProgress.upsert({
          where: {
            sessionId_lessonId: { sessionId, lessonId: lesson.id },
          },
          update: {
            completed: lp.completed,
            quizAttempts: lp.quizAttempts,
            bestScore: lp.bestScore,
          },
          create: {
            sessionId,
            lessonId: lesson.id,
            completed: lp.completed,
            quizAttempts: lp.quizAttempts,
            bestScore: lp.bestScore,
          },
        });
        results.lessonProgress++;
      } catch {
        results.errors.push(`Failed to import lesson: ${lp.lessonSlug}`);
      }
    }
  }

  // Import bookmarks
  if (data.bookmarks) {
    for (const b of data.bookmarks) {
      try {
        const lesson = await db.lesson.findUnique({
          where: { slug: b.lessonSlug },
        });
        if (!lesson) continue;
        await db.bookmark.upsert({
          where: {
            sessionId_lessonId: { sessionId, lessonId: lesson.id },
          },
          update: {},
          create: {
            sessionId,
            lessonId: lesson.id,
          },
        });
        results.bookmarks++;
      } catch {
        results.errors.push(`Failed to import bookmark: ${b.lessonSlug}`);
      }
    }
  }

  // Import ratings
  if (data.ratings) {
    for (const r of data.ratings) {
      try {
        const lesson = await db.lesson.findUnique({
          where: { slug: r.lessonSlug },
        });
        if (!lesson) continue;
        await db.lessonRating.upsert({
          where: {
            sessionId_lessonId: { sessionId, lessonId: lesson.id },
          },
          update: {
            rating: r.rating,
            feedback: r.feedback ?? null,
          },
          create: {
            sessionId,
            lessonId: lesson.id,
            rating: r.rating,
            feedback: r.feedback ?? null,
          },
        });
        results.ratings++;
      } catch {
        results.errors.push(`Failed to import rating: ${r.lessonSlug}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    imported: results,
  });
}
