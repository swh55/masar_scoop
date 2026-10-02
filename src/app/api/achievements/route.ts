import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get all achievements + which ones this session earned
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  const [all, earned] = await Promise.all([
    db.achievement.findMany({ orderBy: { createdAt: "asc" } }),
    sessionId
      ? db.userAchievement.findMany({
          where: { sessionId },
          include: { achievement: true },
        })
      : [],
  ]);

  const earnedSlugs = new Set(earned.map((e) => e.achievement.slug));

  return NextResponse.json(
    all.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      icon: a.icon,
      condition: a.condition,
      earned: earnedSlugs.has(a.slug),
      earnedAt:
        earned.find((e) => e.achievement.slug === a.slug)?.earnedAt ?? null,
    }))
  );
}

type CheckBody = { sessionId: string };

// Check + award achievements based on current progress
export async function POST(request: Request) {
  const body = (await request.json()) as CheckBody;
  const { sessionId } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const [trackProgress, lessonProgress, allAchievements, earnedAlready] =
    await Promise.all([
      db.trackProgress.findMany({
        where: { sessionId },
        include: { track: { select: { lessons: { select: { id: true } } } } },
      }),
      db.lessonProgress.findMany({ where: { sessionId } }),
      db.achievement.findMany(),
      db.userAchievement.findMany({
        where: { sessionId },
        select: { achievementId: true },
      }),
    ]);

  const earnedIds = new Set(earnedAlready.map((e) => e.achievementId));
  const newlyEarned: string[] = [];

  const lessonsCompleted = lessonProgress.filter((l) => l.completed).length;
  const tracksCompleted = trackProgress.filter((t) => t.percent >= 100).length;
  const tracksStarted = trackProgress.length;
  const perfectQuizzes = lessonProgress.filter((l) => l.bestScore === 100).length;

  for (const a of allAchievements) {
    if (earnedIds.has(a.id)) continue;

    let achieved = false;
    if (a.condition === "lessons_completed:1") achieved = lessonsCompleted >= 1;
    if (a.condition === "lessons_completed:10") achieved = lessonsCompleted >= 10;
    if (a.condition === "track_completed:1") achieved = tracksCompleted >= 1;
    if (a.condition === "tracks_started:3") achieved = tracksStarted >= 3;
    if (a.condition === "perfect_quizzes:3") achieved = perfectQuizzes >= 3;

    if (achieved) {
      await db.userAchievement.create({
        data: { sessionId, achievementId: a.id },
      });
      newlyEarned.push(a.slug);
    }
  }

  return NextResponse.json({
    newlyEarned,
    stats: { lessonsCompleted, tracksCompleted, tracksStarted, perfectQuizzes },
  });
}
