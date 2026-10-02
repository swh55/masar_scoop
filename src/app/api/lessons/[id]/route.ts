import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: {
      track: true,
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              choices: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Don't leak correct answers to the client; map to safe shape
  const safe = {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    content: lesson.content,
    codeExample: lesson.codeExample,
    codeLanguage: lesson.codeLanguage,
    order: lesson.order,
    duration: lesson.duration,
    trackId: lesson.trackId,
    track: {
      id: lesson.track.id,
      slug: lesson.track.slug,
      title: lesson.track.title,
      color: lesson.track.color,
      icon: lesson.track.icon,
    },
    quiz: lesson.quiz
      ? {
          id: lesson.quiz.id,
          title: lesson.quiz.title,
          questions: lesson.quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            explanation: q.explanation,
            choices: q.choices.map((c) => ({ id: c.id, text: c.text })),
          })),
        }
      : null,
  };

  return NextResponse.json(safe);
}
