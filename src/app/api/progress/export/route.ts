import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/xp";

/**
 * GET /api/progress/export?sessionId=...
 *
 * Exports all user progress data as JSON for backup.
 * Returns: XP, achievements, lesson progress, track progress,
 * bookmarks, ratings, streak — everything tied to the session.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId || sessionId === "ssr") {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const [
    userXP,
    xpHistory,
    dailyActivity,
    trackProgress,
    lessonProgress,
    bookmarks,
    ratings,
    achievements,
  ] = await Promise.all([
    db.userXP.findUnique({ where: { sessionId } }),
    db.xPHistory.findMany({
      where: { userXP: { sessionId } },
      select: { action: true, points: true, refId: true, earnedAt: true },
      orderBy: { earnedAt: "desc" },
    }),
    db.dailyActivity.findMany({
      where: { sessionId },
      select: { date: true, count: true },
      orderBy: { date: "asc" },
    }),
    db.trackProgress.findMany({
      where: { sessionId },
      include: {
        track: {
          select: { id: true, slug: true, title: true },
        },
      },
    }),
    db.lessonProgress.findMany({
      where: { sessionId },
      include: {
        lesson: {
          select: { id: true, slug: true, title: true },
        },
      },
    }),
    db.bookmark.findMany({
      where: { sessionId },
      include: {
        lesson: {
          select: { id: true, slug: true, title: true },
        },
      },
    }),
    db.lessonRating.findMany({
      where: { sessionId },
      include: {
        lesson: {
          select: { id: true, slug: true, title: true },
        },
      },
    }),
    db.userAchievement.findMany({
      where: { sessionId },
      include: {
        achievement: {
          select: { id: true, slug: true, title: true },
        },
      },
    }),
  ]);

  const levelInfo = getLevel(userXP?.total ?? 0);

  const exportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    sessionId,
    stats: {
      totalXP: userXP?.total ?? 0,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      lessonsCompleted: userXP?.lessonsCompleted ?? 0,
      quizzesPassed: userXP?.quizzesPassed ?? 0,
      badgesEarned: userXP?.badgesEarned ?? 0,
    },
    trackProgress: trackProgress.map((tp) => ({
      trackSlug: tp.track.slug,
      trackTitle: tp.track.title,
      percent: tp.percent,
      lastOpenedAt: tp.lastOpenedAt,
    })),
    lessonProgress: lessonProgress.map((lp) => ({
      lessonSlug: lp.lesson.slug,
      lessonTitle: lp.lesson.title,
      completed: lp.completed,
      quizAttempts: lp.quizAttempts,
      bestScore: lp.bestScore,
      updatedAt: lp.updatedAt,
    })),
    bookmarks: bookmarks.map((b) => ({
      lessonSlug: b.lesson.slug,
      lessonTitle: b.lesson.title,
      createdAt: b.createdAt,
    })),
    ratings: ratings.map((r) => ({
      lessonSlug: r.lesson.slug,
      lessonTitle: r.lesson.title,
      rating: r.rating,
      feedback: r.feedback,
      updatedAt: r.updatedAt,
    })),
    achievements: achievements.map((a) => ({
      slug: a.achievement.slug,
      title: a.achievement.title,
      earnedAt: a.earnedAt,
    })),
    xpHistory: xpHistory.map((h) => ({
      action: h.action,
      points: h.points,
      refId: h.refId,
      earnedAt: h.earnedAt,
    })),
    dailyActivity: dailyActivity.map((d) => ({
      date: d.date,
      count: d.count,
    })),
  };

  return NextResponse.json(exportData, {
    headers: {
      "Content-Disposition": `attachment; filename="academy-progress-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
