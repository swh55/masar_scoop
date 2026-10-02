import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/recommend-next?sessionId=...
 *
 * Smart "next lesson" recommendation based on user's progress.
 *
 * Logic:
 * 1. If user has any in-progress track (started but not 100%),
 *    recommend the next uncompleted lesson in that track.
 * 2. If user has completed tracks, find the next track they haven't started
 *    and recommend its first lesson.
 * 3. If user is brand new, recommend the first lesson of the first track
 *    (TypeScript by order).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId || sessionId === "ssr") {
    // Brand new user — return first lesson of first track
    const firstTrack = await db.track.findFirst({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          where: { published: true },
          orderBy: { order: "asc" },
          take: 1,
          select: { id: true, slug: true, title: true, summary: true, duration: true, order: true },
        },
      },
    });
    const firstLesson = firstTrack?.lessons[0];
    if (!firstTrack || !firstLesson) {
      return NextResponse.json({ recommendation: null });
    }
    return NextResponse.json({
      recommendation: {
        type: "first_ever",
        label: "ابدأ هنا",
        track: {
          id: firstTrack.id,
          slug: firstTrack.slug,
          title: firstTrack.title,
          color: firstTrack.color,
          icon: firstTrack.icon,
          level: firstTrack.level,
        },
        lesson: firstLesson,
      },
    });
  }

  // 1. Find in-progress tracks (started but not 100%)
  const inProgressTracks = await db.trackProgress.findMany({
    where: {
      sessionId,
      percent: { lt: 100, gt: 0 },
    },
    orderBy: { lastOpenedAt: "desc" },
    include: {
      track: {
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
      },
    },
    take: 1,
  });

  if (inProgressTracks.length > 0) {
    const tp = inProgressTracks[0]!;
    // Find the first lesson in this track that the user hasn't completed
    const completedLessonIds = new Set(
      (
        await db.lessonProgress.findMany({
          where: {
            sessionId,
            lessonId: { in: tp.track.lessons.map((l) => l.id) },
            completed: true,
          },
          select: { lessonId: true },
        })
      ).map((p) => p.lessonId)
    );

    const nextLesson = tp.track.lessons.find(
      (l) => !completedLessonIds.has(l.id)
    );

    if (nextLesson) {
      return NextResponse.json({
        recommendation: {
          type: "continue_track",
          label: "تابع التعلّم",
          track: {
            id: tp.track.id,
            slug: tp.track.slug,
            title: tp.track.title,
            color: tp.track.color,
            icon: tp.track.icon,
            level: tp.track.level,
          },
          lesson: nextLesson,
        },
      });
    }
  }

  // 2. Find started track with 0% (just opened but no lessons completed)
  const startedTrack = await db.trackProgress.findFirst({
    where: {
      sessionId,
      percent: 0,
    },
    orderBy: { lastOpenedAt: "desc" },
    include: {
      track: {
        include: {
          lessons: {
            where: { published: true },
            orderBy: { order: "asc" },
            take: 1,
            select: { id: true, slug: true, title: true, summary: true, duration: true, order: true },
          },
        },
      },
    },
  });

  if (startedTrack && startedTrack.track.lessons[0]) {
    return NextResponse.json({
      recommendation: {
        type: "start_track",
        label: "ابدأ هذا المسار",
        track: {
          id: startedTrack.track.id,
          slug: startedTrack.track.slug,
          title: startedTrack.track.title,
          color: startedTrack.track.color,
          icon: startedTrack.track.icon,
          level: startedTrack.track.level,
        },
        lesson: startedTrack.track.lessons[0],
      },
    });
  }

  // 3. Find the next unstarted track (by order)
  const allTracks = await db.track.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: "asc" },
        take: 1,
        select: { id: true, slug: true, title: true, summary: true, duration: true, order: true },
      },
    },
  });

  // Get the set of track IDs the user has started
  const startedTrackIds = new Set(
    (await db.trackProgress.findMany({
      where: { sessionId },
      select: { trackId: true },
    })).map((tp) => tp.trackId)
  );

  const unstartedTrack = allTracks.find(
    (t) => !startedTrackIds.has(t.id) && t.lessons[0]
  );

  if (unstartedTrack && unstartedTrack.lessons[0]) {
    return NextResponse.json({
      recommendation: {
        type: "new_track",
        label: "مسار جديد",
        track: {
          id: unstartedTrack.id,
          slug: unstartedTrack.slug,
          title: unstartedTrack.title,
          color: unstartedTrack.color,
          icon: unstartedTrack.icon,
          level: unstartedTrack.level,
        },
        lesson: unstartedTrack.lessons[0],
      },
    });
  }

  // 4. All tracks started — find any uncompleted lesson
  const allLessons = await db.lesson.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
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
          level: true,
        },
      },
    },
  });

  const completedLessonIds = new Set(
    (
      await db.lessonProgress.findMany({
        where: { sessionId, completed: true },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId)
  );

  const nextUncompleted = allLessons.find((l) => !completedLessonIds.has(l.id));

  if (nextUncompleted) {
    return NextResponse.json({
      recommendation: {
        type: "any_uncompleted",
        label: "درس غير مكتمل",
        track: nextUncompleted.track,
        lesson: {
          id: nextUncompleted.id,
          slug: nextUncompleted.slug,
          title: nextUncompleted.title,
          summary: nextUncompleted.summary,
          duration: nextUncompleted.duration,
          order: nextUncompleted.order,
        },
      },
    });
  }

  // 5. Everything completed!
  return NextResponse.json({
    recommendation: {
      type: "all_done",
      label: "أكملت كل شيء! 🎉",
      track: null,
      lesson: null,
    },
  });
}
