import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tracks = await db.track.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: { where: { published: true } } } },
    },
  });

  return NextResponse.json(
    tracks.map((t) => ({
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
    }))
  );
}
