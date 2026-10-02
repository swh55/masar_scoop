import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/ratings?lessonId=...
 * Returns the user's rating for a lesson + aggregate stats.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  const sessionId = searchParams.get("sessionId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Get aggregate stats
  const ratings = await db.lessonRating.findMany({
    where: { lessonId },
    select: { rating: true, sessionId: true },
  });

  const count = ratings.length;
  const sum = ratings.reduce((s, r) => s + r.rating, 0);
  const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

  // Distribution: how many 1-star, 2-star, etc.
  const distribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));

  // Get the current user's rating
  let userRating = null;
  if (sessionId && sessionId !== "ssr") {
    const existing = await db.lessonRating.findUnique({
      where: {
        sessionId_lessonId: { sessionId, lessonId },
      },
      select: { rating: true, feedback: true, updatedAt: true },
    });
    if (existing) {
      userRating = existing;
    }
  }

  return NextResponse.json({
    average,
    count,
    distribution,
    userRating,
  });
}

type Body = {
  sessionId: string;
  lessonId: string;
  rating: number;
  feedback?: string;
};

/**
 * POST /api/ratings
 * Creates or updates the user's rating for a lesson.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.sessionId || !body.lessonId || !body.rating) {
    return NextResponse.json(
      { error: "sessionId, lessonId, and rating required" },
      { status: 400 }
    );
  }

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: "rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const result = await db.lessonRating.upsert({
    where: {
      sessionId_lessonId: {
        sessionId: body.sessionId,
        lessonId: body.lessonId,
      },
    },
    update: {
      rating: body.rating,
      feedback: body.feedback ?? null,
    },
    create: {
      sessionId: body.sessionId,
      lessonId: body.lessonId,
      rating: body.rating,
      feedback: body.feedback ?? null,
    },
  });

  return NextResponse.json({
    success: true,
    rating: result.rating,
    feedback: result.feedback,
  });
}
