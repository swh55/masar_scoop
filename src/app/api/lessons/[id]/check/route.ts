import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { awardXP } from "@/lib/xp";

type CheckBody = {
  sessionId: string;
  answers: { questionId: string; choiceId: string }[];
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as CheckBody;

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: {
      quiz: {
        include: {
          questions: {
            include: { choices: true },
          },
        },
      },
    },
  });

  if (!lesson || !lesson.quiz) {
    return NextResponse.json({ error: "Lesson or quiz not found" }, { status: 404 });
  }

  let correctCount = 0;
  const results = lesson.quiz.questions.map((q) => {
    const ans = body.answers.find((a) => a.questionId === q.id);
    const chosen = q.choices.find((c) => c.id === ans?.choiceId);
    const correct = q.choices[q.correctIndex];
    const isCorrect = chosen?.id === correct.id;
    if (isCorrect) correctCount += 1;
    return {
      questionId: q.id,
      chosenChoiceId: chosen?.id ?? null,
      correctChoiceId: correct.id,
      isCorrect,
    };
  });

  const total = lesson.quiz.questions.length;
  const score = Math.round((correctCount / total) * 100);

  // Update lesson progress
  const existing = await db.lessonProgress.findUnique({
    where: {
      sessionId_lessonId: { sessionId: body.sessionId, lessonId: id },
    },
  });

  const lessonProgress = await db.lessonProgress.upsert({
    where: {
      sessionId_lessonId: { sessionId: body.sessionId, lessonId: id },
    },
    update: {
      quizAttempts: { increment: 1 },
      bestScore: Math.max(existing?.bestScore ?? 0, score),
      completed: score >= 60 ? true : (existing?.completed ?? false),
    },
    create: {
      sessionId: body.sessionId,
      lessonId: id,
      quizAttempts: 1,
      bestScore: score,
      completed: score >= 60,
    },
  });

  // Recompute track percent
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
      sessionId_trackId: { sessionId: body.sessionId, trackId: lesson.trackId },
    },
    update: { percent, lastOpenedAt: new Date() },
    create: {
      sessionId: body.sessionId,
      trackId: lesson.trackId,
      percent,
      lastOpenedAt: new Date(),
    },
  });

  // Award XP for quiz pass / perfect (idempotent via awardXP)
  // Daily challenge: if this lesson is today's challenge, apply ×2 multiplier
  const isDailyChallenge = await isTodayDailyChallenge(id);
  const multiplier = isDailyChallenge ? 2 : 1;
  let quizXpAwarded = 0;
  let perfectXpAwarded = 0;
  let trackXpAwarded = 0;
  let lessonXpAwarded = 0;
  if (score >= 60) {
    const quizXp = await awardXP(body.sessionId, "quiz_pass", id, multiplier);
    quizXpAwarded = quizXp.awarded;
    // If quiz is passed, also award lesson completion XP (idempotent)
    const lessonXp = await awardXP(
      body.sessionId,
      "lesson_complete",
      id,
      multiplier
    );
    lessonXpAwarded = lessonXp.awarded;
  }
  if (score === 100) {
    const perfectXp = await awardXP(
      body.sessionId,
      "quiz_perfect",
      id,
      multiplier
    );
    perfectXpAwarded = perfectXp.awarded;
  }
  // Track completion XP (no multiplier — track completion is rare and big already)
  if (percent >= 100) {
    const trackXp = await awardXP(
      body.sessionId,
      "track_complete",
      lesson.trackId
    );
    trackXpAwarded = trackXp.awarded;
  }

  const totalXpAwarded =
    quizXpAwarded + perfectXpAwarded + trackXpAwarded + lessonXpAwarded;

  return NextResponse.json({
    score,
    correctCount,
    total,
    results,
    passed: score >= 60,
    lessonProgress,
    trackPercent: percent,
    xpAwarded: totalXpAwarded,
    xpBreakdown: {
      quizPass: quizXpAwarded,
      quizPerfect: perfectXpAwarded,
      lessonComplete: lessonXpAwarded,
      trackComplete: trackXpAwarded,
    },
    isDailyChallenge,
    multiplier,
  });
}

/**
 * Check if a lesson is today's daily challenge (deterministic by date hash).
 * Same logic as /api/daily-challenge but synchronous check.
 */
async function isTodayDailyChallenge(lessonId: string): Promise<boolean> {
  const totalLessons = await db.lesson.count({ where: { published: true } });
  if (totalLessons === 0) return false;

  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  }

  // Get all published lessons ordered by id to match the daily-challenge API logic
  const lessons = await db.lesson.findMany({
    where: { published: true },
    select: { id: true },
    orderBy: { id: "asc" },
  });
  if (lessons.length === 0) return false;

  const todaysLesson = lessons[hash % lessons.length];
  return todaysLesson.id === lessonId;
}
