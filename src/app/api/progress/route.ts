import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const [trackProgress, lessonProgress, earned] = await Promise.all([
    db.trackProgress.findMany({
      where: { sessionId },
      include: { track: true },
    }),
    db.lessonProgress.findMany({
      where: { sessionId },
      select: {
        lessonId: true,
        completed: true,
        quizAttempts: true,
        bestScore: true,
        updatedAt: true,
      },
    }),
    db.userAchievement.findMany({
      where: { sessionId },
      include: { achievement: true },
    }),
  ]);

  const totalLessonsCompleted = lessonProgress.filter((l) => l.completed).length;
  const totalTracksStarted = trackProgress.length;
  const totalTracksCompleted = trackProgress.filter((t) => t.percent >= 100).length;
  const totalPerfectQuizzes = lessonProgress.filter((l) => l.bestScore === 100).length;

  return NextResponse.json({
    trackProgress: trackProgress.map((t) => ({
      trackId: t.trackId,
      trackTitle: t.track.title,
      trackSlug: t.track.slug,
      percent: t.percent,
      lastOpenedAt: t.lastOpenedAt,
    })),
    lessonProgress: lessonProgress.reduce<
      Record<string, { lessonId: string; completed: boolean; quizAttempts: number; bestScore: number; updatedAt: Date }>
    >((acc, lp) => {
      acc[lp.lessonId] = lp;
      return acc;
    }, {}),
    achievements: earned.map((e) => ({
      slug: e.achievement.slug,
      title: e.achievement.title,
      description: e.achievement.description,
      icon: e.achievement.icon,
      earnedAt: e.earnedAt,
    })),
    stats: {
      totalLessonsCompleted,
      totalTracksStarted,
      totalTracksCompleted,
      totalPerfectQuizzes,
    },
  });
}
