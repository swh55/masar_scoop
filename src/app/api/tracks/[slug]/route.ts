import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Look up by slug first, then by id (cuid)
  let track = await db.track.findUnique({
    where: { slug },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          order: true,
          duration: true,
        },
      },
    },
  });

  if (!track) {
    track = await db.track.findUnique({
      where: { id: slug },
      include: {
        lessons: {
          where: { published: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            order: true,
            duration: true,
          },
        },
      },
    });
  }

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  return NextResponse.json(track);
}
