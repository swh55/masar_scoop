import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/search?q=...
 *
 * Full-text search across all lessons (title, summary, content) and tracks.
 * Returns matching lessons + tracks, ranked by relevance.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!q || q.length < 2) {
    return NextResponse.json({ lessons: [], tracks: [], query: q });
  }

  // Search lessons by title, summary, or content (case-insensitive contains)
  // SQLite doesn't support full-text search natively with Prisma, so we use
  // contains mode insensitive.
  const [lessons, tracks] = await Promise.all([
    db.lesson.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true, // for ranking only, not returned
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
      take: limit,
      orderBy: { order: "asc" },
    }),
    db.track.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        color: true,
        icon: true,
        level: true,
        order: true,
        duration: true,
        _count: { select: { lessons: { where: { published: true } } } },
      },
      take: 10,
      orderBy: { order: "asc" },
    }),
  ]);

  // Rank lessons: title match > summary match > content match
  const rankedLessons = lessons
    .map((l) => {
      let score = 0;
      if (l.title.toLowerCase().includes(q)) score += 100;
      if (l.summary.toLowerCase().includes(q)) score += 50;
      if (l.content.toLowerCase().includes(q)) score += 10;
      return { ...l, score };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    query: q,
    lessons: rankedLessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      summary: l.summary,
      duration: l.duration,
      order: l.order,
      trackId: l.trackId,
      track: l.track,
      score: l.score,
    })),
    tracks: tracks.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      color: t.color,
      icon: t.icon,
      level: t.level,
      order: t.order,
      duration: t.duration,
      lessonCount: t._count.lessons,
    })),
  });
}
