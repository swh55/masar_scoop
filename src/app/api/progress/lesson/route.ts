import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardXP } from "@/lib/xp";

type Body = {
  sessionId: string;
  lessonId: string;
  completed?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  const lesson = await db.lesson.findUnique({
    where: { id: body.lessonId },
    select: { trackId: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const completed = body.completed ?? true;

  // Check existing progress to detect first-time completion
  const existing = await db.lessonProgress.findUnique({
    where: {
      sessionId_lessonId: {
        sessionId: body.sessionId,
        lessonId: body.lessonId,
      },
    },
  });
  const wasCompleted = existing?.completed ?? false;

  await db.lessonProgress.upsert({
    where: {
      sessionId_lessonId: {
        sessionId: body.sessionId,
        lessonId: body.lessonId,
      },
    },
    update: { completed },
    create: {
      sessionId: body.sessionId,
      lessonId: body.lessonId,
      completed,
    },
  });

  // Award XP only on first-time completion
  let xpAwarded = 0;
  if (completed && !wasCompleted) {
    const xp = await awardXP(body.sessionId, "lesson_complete", body.lessonId);
    xpAwarded = xp.awarded;
  }

  // recompute track percent
  const trackLessons = await db.lesson.findMany({
    where: { trackId: lesson.trackId },
    select: { id: true },
  });
  const lessonIds = trackLessons.map((l) => l.id);
  const completedCount = await db.lessonProgress.count({
    where: {
      sessionId: body.sessionId,
      lessonId: { in: lessonIds },
      completed: true,
    },
  });
  const percent = Math.round((completedCount / lessonIds.length) * 100);

  await db.trackProgress.upsert({
    where: {
      sessionId_trackId: {
        sessionId: body.sessionId,
        trackId: lesson.trackId,
      },
    },
    update: { percent, lastOpenedAt: new Date() },
    create: {
      sessionId: body.sessionId,
      trackId: lesson.trackId,
      percent,
      lastOpenedAt: new Date(),
    },
  });

  // Award XP for track completion (first time only) — awardXP is idempotent
  let trackXpAwarded = 0;
  if (percent >= 100) {
    const trackXp = await awardXP(
      body.sessionId,
      "track_complete",
      lesson.trackId
    );
    trackXpAwarded = trackXp.awarded;
  }

  return NextResponse.json({
    ok: true,
    trackPercent: percent,
    xpAwarded: xpAwarded + trackXpAwarded,
  });
}

