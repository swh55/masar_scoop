import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/xp";

/**
 * GET /api/certificate?sessionId=...&trackId=...
 *
 * Returns certificate data for a completed track.
 * If trackId is omitted, returns all completed tracks' certificates.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const trackId = searchParams.get("trackId");

  if (!sessionId || sessionId === "ssr") {
    return NextResponse.json({ certificates: [] });
  }

  // If a specific track is requested
  if (trackId) {
    const track = await db.track.findUnique({
      where: { id: trackId },
      include: {
        lessons: {
          where: { published: true },
          orderBy: { order: "asc" },
          select: { id: true, title: true, duration: true },
        },
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    // Check completion
    const trackProgress = await db.trackProgress.findUnique({
      where: {
        sessionId_trackId: { sessionId, trackId },
      },
    });

    if (!trackProgress || trackProgress.percent < 100) {
      return NextResponse.json({
        eligible: false,
        message: "لم تكمل هذا المسار بعد",
      });
    }

    // Get user's XP for the certificate
    const userXP = await db.userXP.findUnique({ where: { sessionId } });
    const levelInfo = getLevel(userXP?.total ?? 0);

    // Calculate completion stats
    const lessonProgress = await db.lessonProgress.findMany({
      where: {
        sessionId,
        lessonId: { in: track.lessons.map((l) => l.id) },
        completed: true,
      },
    });

    const avgScore =
      lessonProgress.length > 0
        ? Math.round(
            lessonProgress.reduce((s, lp) => s + lp.bestScore, 0) /
              lessonProgress.length
          )
        : 0;

    return NextResponse.json({
      eligible: true,
      certificate: {
        trackId: track.id,
        trackTitle: track.title,
        trackLevel: track.level,
        trackColor: track.color,
        trackIcon: track.icon,
        completedAt: trackProgress.updatedAt,
        lessonsCompleted: lessonProgress.length,
        totalLessons: track.lessons.length,
        totalDuration: track.lessons.reduce((s, l) => s + l.duration, 0),
        averageScore: avgScore,
        studentLevel: levelInfo.level,
        studentLevelTitle: levelInfo.levelTitle,
        studentTotalXP: userXP?.total ?? 0,
        certificateId: `CERT-${track.slug.toUpperCase()}-${sessionId.slice(-8).toUpperCase()}`,
      },
    });
  }

  // Return all completed tracks
  const completedTracks = await db.trackProgress.findMany({
    where: {
      sessionId,
      percent: { gte: 100 },
    },
    include: {
      track: {
        select: {
          id: true,
          slug: true,
          title: true,
          color: true,
          icon: true,
          level: true,
          description: true,
          duration: true,
          lessons: {
            where: { published: true },
            select: { id: true, title: true, duration: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const userXP = await db.userXP.findUnique({ where: { sessionId } });
  const levelInfo = getLevel(userXP?.total ?? 0);

  const certificates = await Promise.all(
    completedTracks.map(async (tp) => {
      const lessonProgress = await db.lessonProgress.findMany({
        where: {
          sessionId,
          lessonId: { in: tp.track.lessons.map((l) => l.id) },
          completed: true,
        },
      });

      const avgScore =
        lessonProgress.length > 0
          ? Math.round(
              lessonProgress.reduce((s, lp) => s + lp.bestScore, 0) /
                lessonProgress.length
            )
          : 0;

      return {
        trackId: tp.track.id,
        trackTitle: tp.track.title,
        trackLevel: tp.track.level,
        trackColor: tp.track.color,
        trackIcon: tp.track.icon,
        trackDescription: tp.track.description,
        completedAt: tp.updatedAt,
        lessonsCompleted: lessonProgress.length,
        totalLessons: tp.track.lessons.length,
        totalDuration: tp.track.duration,
        averageScore: avgScore,
        studentLevel: levelInfo.level,
        studentLevelTitle: levelInfo.levelTitle,
        studentTotalXP: userXP?.total ?? 0,
        certificateId: `CERT-${tp.track.slug.toUpperCase()}-${sessionId.slice(-8).toUpperCase()}`,
      };
    })
  );

  return NextResponse.json({
    certificates,
    totalEarned: certificates.length,
  });
}
