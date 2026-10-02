import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/xp";

/**
 * GET /api/track-summary?sessionId=...&trackId=...
 *
 * Returns a comprehensive summary of the user's progress in a track,
 * including per-lesson details, scores, time spent, and achievements.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const trackId = searchParams.get("trackId");

  if (!sessionId || sessionId === "ssr" || !trackId) {
    return NextResponse.json({ error: "sessionId and trackId required" }, { status: 400 });
  }

  const track = await db.track.findUnique({
    where: { id: trackId },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          duration: true,
          order: true,
        },
      },
    },
  });

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  // Get progress for each lesson
  const lessonProgress = await db.lessonProgress.findMany({
    where: {
      sessionId,
      lessonId: { in: track.lessons.map((l) => l.id) },
    },
    select: {
      lessonId: true,
      completed: true,
      quizAttempts: true,
      bestScore: true,
      updatedAt: true,
    },
  });

  const progressMap = new Map(lessonProgress.map((lp) => [lp.lessonId, lp]));

  // Build per-lesson summary
  const lessons = track.lessons.map((lesson) => {
    const lp = progressMap.get(lesson.id);
    return {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      duration: lesson.duration,
      order: lesson.order,
      completed: lp?.completed ?? false,
      bestScore: lp?.bestScore ?? 0,
      quizAttempts: lp?.quizAttempts ?? 0,
      lastVisited: lp?.updatedAt ?? null,
    };
  });

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Calculate stats
  const totalDuration = track.lessons.reduce((s, l) => s + l.duration, 0);
  const scores = lessons.filter((l) => l.bestScore > 0).map((l) => l.bestScore);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const perfectScores = scores.filter((s) => s === 100).length;
  const totalAttempts = lessons.reduce((s, l) => s + l.quizAttempts, 0);

  // Get user XP + level
  const userXP = await db.userXP.findUnique({ where: { sessionId } });
  const levelInfo = getLevel(userXP?.total ?? 0);

  // Check for achievements earned in this track
  const trackAchievements = await db.userAchievement.findMany({
    where: { sessionId },
    include: {
      achievement: {
        select: { slug: true, title: true, description: true, icon: true },
      },
    },
    orderBy: { earnedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    track: {
      id: track.id,
      title: track.title,
      description: track.description,
      color: track.color,
      icon: track.icon,
      level: track.level,
      duration: track.duration,
    },
    isComplete: percent >= 100,
    percent,
    stats: {
      completedLessons: completedCount,
      totalLessons,
      totalDuration,
      averageScore,
      perfectScores,
      totalAttempts,
      xpEarned: userXP?.total ?? 0,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
    },
    lessons,
    recentAchievements: trackAchievements.map((ua) => ({
      slug: ua.achievement.slug,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      earnedAt: ua.earnedAt,
    })),
  });
}
