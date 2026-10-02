"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  BookOpen,
  Lightbulb,
  PartyPopper,
  Flame,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { Markdown } from "./markdown";
import { CodePlayground } from "./code-playground";
import { ReadingProgress } from "./reading-progress";
import { BookmarkButton } from "./bookmark-button";
import { LessonTableOfContents } from "./lesson-toc";
import { TrackIcon } from "./track-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  codeExample: string | null;
  codeLanguage: string | null;
  order: number;
  duration: number;
  trackId: string;
  track: {
    id: string;
    slug: string;
    title: string;
    color: string;
    icon: string;
  };
  quiz: {
    id: string;
    title: string;
    questions: {
      id: string;
      text: string;
      explanation: string | null;
      choices: { id: string; text: string }[];
    }[];
  } | null;
};

type ProgressData = {
  lessonProgress: Record<
    string,
    { completed: boolean; bestScore: number; quizAttempts: number }
  >;
};

function useSessionIdLocal() {
  return useSessionId();
}

export function LessonView({ lessonId }: { lessonId: string }) {
  const { goHome, openTrack, openLesson } = useUI();
  const sessionId = useSessionIdLocal();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ["lesson", lessonId],
    queryFn: () =>
      fetch(`/api/lessons/${lessonId}`).then((r) => {
        if (!r.ok) throw new Error("Lesson not found");
        return r.json();
      }),
  });

  // Check if this lesson is today's daily challenge
  const { data: dailyChallenge } = useQuery<{
    lesson: { id: string };
    challengeDay: number;
  }>({
    queryKey: ["daily-challenge", sessionId],
    queryFn: () =>
      fetch(
        `/api/daily-challenge?sessionId=${encodeURIComponent(sessionId)}`
      ).then((r) => r.json()),
    enabled: !!sessionId && sessionId !== "ssr",
  });
  const isDailyChallenge = dailyChallenge?.lesson?.id === lessonId;

  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["progress", sessionId],
    queryFn: () =>
      fetch(`/api/progress?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId,
  });

  const markComplete = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lessonId,
          completed: true,
        }),
      });
      return res.json();
    },
    onSuccess: (data: { xpAwarded?: number }) => {
      queryClient.invalidateQueries({ queryKey: ["progress", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["xp", sessionId] });

      // Show XP earned toast
      if (data.xpAwarded && data.xpAwarded > 0) {
        toast.success(`⚡ +${data.xpAwarded} نقطة خبرة!`, {
          description: "إكمال درس",
        });
      }

      // Check for achievements
      fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((achData: { newlyEarned: string[] }) => {
          if (achData.newlyEarned?.length) {
            queryClient.invalidateQueries({ queryKey: ["xp", sessionId] });
            achData.newlyEarned.forEach((slug) => {
              toast.success("🎉 ربحت شارة جديدة!", {
                description: `شارة: ${slug}`,
              });
            });
            queryClient.invalidateQueries({ queryKey: ["achievements"] });
          }
        });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="h-32 rounded-2xl bg-muted/50 animate-pulse mb-6" />
        <div className="h-96 rounded-2xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground">الدرس غير موجود.</p>
        <Button onClick={goHome} className="mt-4">
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  const lp = progress?.lessonProgress[lesson.id];
  const isCompleted = lp?.completed ?? false;

  return (
    <div>
      <ReadingProgress />
      {/* Lesson hero */}
      <section className={cn("relative overflow-hidden bg-hero border-b border-border/60")}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 mb-5 text-sm text-muted-foreground"
            aria-label="مسار التنقل"
          >
            <button
              onClick={goHome}
              className="hover:text-foreground transition-colors"
            >
              الرئيسية
            </button>
            <ChevronLeft className="h-3.5 w-3.5 opacity-50" />
            <button
              onClick={() => openTrack(lesson.track.id)}
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  `track-${lesson.track.color}`,
                  "bg-track"
                )}
              />
              {lesson.track.title}
            </button>
            <ChevronLeft className="h-3.5 w-3.5 opacity-50" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {lesson.title}
            </span>
          </nav>

          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1",
                `track-${lesson.track.color}`,
                "bg-track/10 text-track ring-track/20"
              )}
            >
              <TrackIcon name={lesson.track.icon} className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span className="font-medium">{lesson.track.title}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} دقيقة
                </span>
                {isCompleted && (
                  <>
                    <span>•</span>
                    <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0">
                      <CheckCircle2 className="h-3 w-3" />
                      مكتمل
                    </Badge>
                  </>
                )}
                {isDailyChallenge && (
                  <>
                    <span>•</span>
                    <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-0 animate-pulse">
                      <Flame className="h-3 w-3" />
                      تحدّي اليوم · XP ×2
                    </Badge>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-2">{lesson.summary}</p>
            </div>

            {/* Bookmark button */}
            <div className="shrink-0 ms-auto">
              <BookmarkButton lessonId={lesson.id} lessonTitle={lesson.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Lesson content */}
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        {/* Table of contents (desktop floating + mobile collapsible) */}
        <LessonTableOfContents content={lesson.content} />

        <Card className="p-6 sm:p-8 mb-6">
          <Markdown content={lesson.content} />
        </Card>

        {/* Code example */}
        {lesson.codeExample && (
          <Card className="overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">مثال الكود</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs" dir="ltr">
                {lesson.codeLanguage ?? "code"}
              </Badge>
            </div>
            <div className="bg-[#1e1e2e] p-5 overflow-x-auto" dir="ltr">
              <pre className="text-sm leading-relaxed text-white/90 font-mono">
                <code>{lesson.codeExample}</code>
              </pre>
            </div>
          </Card>
        )}

        {/* Interactive code playground — only for runnable languages */}
        {lesson.codeExample &&
          ["ts", "tsx", "js", "jsx"].includes(lesson.codeLanguage ?? "") && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>عدّل الكود وجرّبه مباشرة في المتصفح:</span>
              </div>
              <CodePlayground
                initialCode={lesson.codeExample}
                language={lesson.codeLanguage ?? "ts"}
                title="محرر تفاعلي"
              />
            </div>
          )}

        {/* Quiz */}
        {lesson.quiz && (
          <Quiz
            quiz={lesson.quiz}
            sessionId={sessionId}
            lessonId={lesson.id}
            bestScore={lp?.bestScore ?? 0}
          />
        )}

        {/* Mark complete + navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-border">
          {!isCompleted && (
            <Button
              onClick={() => {
                markComplete.mutate();
                toast.success("أحسنت! تم تسجيل إكمال الدرس", {
                  description: "يمكنك المتابعة للدرس التالي",
                });
              }}
              disabled={markComplete.isPending}
              className="gap-2 w-full sm:w-auto"
              variant="default"
            >
              <CheckCircle2 className="h-4 w-4" />
              وضع علامة كمكتمل
            </Button>
          )}
          <div className="flex items-center gap-2 ms-auto w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => openTrack(lesson.track.id)}
              className="gap-2 flex-1 sm:flex-none"
            >
              <ArrowRight className="h-4 w-4" />
              المسار
            </Button>
            <NextLessonButton currentLessonId={lesson.id} trackId={lesson.track.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NextLessonButton({
  currentLessonId,
  trackId,
}: {
  currentLessonId: string;
  trackId: string;
}) {
  const { openLesson, openTrack } = useUI();
  const { data: track } = useQuery<{
    lessons: { id: string; title: string }[];
  }>({
    queryKey: ["track", trackId],
    queryFn: () => fetch(`/api/tracks/${trackId}`).then((r) => r.json()),
  });

  const lessons = track?.lessons ?? [];
  const currentIdx = lessons.findIndex((l) => l.id === currentLessonId);
  const nextLesson = currentIdx >= 0 ? lessons[currentIdx + 1] : undefined;

  if (!nextLesson) {
    return (
      <Button onClick={() => openTrack(trackId)} className="gap-2 flex-1 sm:flex-none">
        <Trophy className="h-4 w-4" />
        إنهاء المسار
      </Button>
    );
  }

  return (
    <Button onClick={() => openLesson(nextLesson.id)} className="gap-2 flex-1 sm:flex-none">
      الدرس التالي
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}

function Quiz({
  quiz,
  sessionId,
  lessonId,
  bestScore,
}: {
  quiz: NonNullable<Lesson["quiz"]>;
  sessionId: string;
  lessonId: string;
  bestScore: number;
}) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    total: number;
    results: { questionId: string; chosenChoiceId: string | null; correctChoiceId: string; isCorrect: boolean }[];
    passed: boolean;
    isDailyChallenge?: boolean;
    multiplier?: number;
    xpAwarded?: number;
    xpBreakdown?: {
      quizPass: number;
      quizPerfect: number;
      lessonComplete: number;
      trackComplete: number;
    };
  } | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/lessons/${lessonId}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          answers: Object.entries(answers).map(([questionId, choiceId]) => ({
            questionId,
            choiceId,
          })),
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setShowExplanations(true);
      queryClient.invalidateQueries({ queryKey: ["progress", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["xp", sessionId] });

      // Show XP earned toast if any
      if (data.xpAwarded && data.xpAwarded > 0) {
        const breakdown = data.xpBreakdown as {
          quizPass: number;
          quizPerfect: number;
          lessonComplete: number;
          trackComplete: number;
        } | undefined;
        const reasons: string[] = [];
        if (breakdown?.lessonComplete) reasons.push("إكمال درس");
        if (breakdown?.quizPass) reasons.push("اجتياز اختبار");
        if (breakdown?.quizPerfect) reasons.push("نتيجة كاملة");
        if (breakdown?.trackComplete) reasons.push("إكمال مسار");
        if (data.isDailyChallenge) reasons.push(`🔥 مكافأة التحدّي ×${data.multiplier ?? 2}`);
        toast.success(`⚡ +${data.xpAwarded} نقطة خبرة!`, {
          description: reasons.join(" · "),
        });
      }

      // Check for newly earned achievements after quiz submission
      fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((ach: { newlyEarned: string[] }) => {
          if (ach.newlyEarned?.length) {
            queryClient.invalidateQueries({ queryKey: ["xp", sessionId] });
            ach.newlyEarned.forEach(() => {
              toast.success("🎉 ربحت شارة جديدة!", {
                description: "تحقّق من صفحة الإنجازات",
              });
            });
          }
        })
        .finally(() => {
          queryClient.invalidateQueries({ queryKey: ["achievements"] });
        });
      if (data.passed) {
        toast.success("🎉 نجحت في الاختبار!", {
          description: `حصلت على ${data.score}%`,
        });
      } else {
        toast.error("تحتاج إلى 60% على الأقل للنجاح", {
          description: `نتيجتك: ${data.score}%`,
        });
      }
    },
  });

  const allAnswered = quiz.questions.every((q) => answers[q.id]);
  const canRetry = result !== null;

  const reset = () => {
    setAnswers({});
    setResult(null);
    setShowExplanations(false);
  };

  return (
    <Card className="overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-border bg-gradient-to-l from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-lg">{quiz.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {quiz.questions.length} أسئلة — تحتاج 60% للنجاح
        </p>
        {bestScore > 0 && (
          <Badge className="mt-2 gap-1 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-0">
            <Trophy className="h-3 w-3" />
            أفضل نتيجة: {bestScore}%
          </Badge>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {quiz.questions.map((q, qIdx) => {
          const r = result?.results.find((x) => x.questionId === q.id);
          const chosenId = answers[q.id];
          return (
            <div key={q.id}>
              <div className="flex items-start gap-3 mb-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                  {qIdx + 1}
                </span>
                <p className="font-medium leading-relaxed pt-0.5">{q.text}</p>
              </div>

              <div className="grid gap-2 ms-10">
                {q.choices.map((c) => {
                  const isSelected = chosenId === c.id;
                  const isCorrectAnswer = r?.correctChoiceId === c.id;
                  const showCorrect = showExplanations && isCorrectAnswer;
                  const showWrong =
                    showExplanations && isSelected && !isCorrectAnswer;

                  return (
                    <button
                      key={c.id}
                      disabled={showExplanations}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-start transition-all",
                        "disabled:cursor-default",
                        !showExplanations && isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                        showCorrect &&
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500",
                        showWrong &&
                          "border-rose-500 bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-500"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          !showExplanations && isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40",
                          showCorrect && "border-emerald-500 bg-emerald-500",
                          showWrong && "border-rose-500 bg-rose-500"
                        )}
                      >
                        {showCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
                        {showWrong && <XCircle className="h-4 w-4 text-white" />}
                      </span>
                      <span className="text-sm">{c.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanations && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ms-10 mt-3"
                  >
                    <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-sm">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Actions / Result */}
      <div className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30">
        {result ? (
          <div className="space-y-4">
            <div
              className={cn(
                "flex items-center gap-4 rounded-xl p-4",
                result.passed
                  ? "bg-emerald-50 dark:bg-emerald-950/30"
                  : "bg-rose-50 dark:bg-rose-950/30"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-white",
                  result.passed ? "bg-emerald-500" : "bg-rose-500"
                )}
              >
                {result.passed ? (
                  <PartyPopper className="h-6 w-6" />
                ) : (
                  <RotateCcw className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">
                  {result.passed ? "أحسنت! نجحت" : "حاول مرة أخرى"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.correctCount} من {result.total} إجابات صحيحة
                </div>
              </div>
              <div
                className={cn(
                  "text-3xl font-extrabold",
                  result.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}
              >
                {result.score}%
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="gap-2 flex-1">
                <RotateCcw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Progress
              value={(Object.keys(answers).length / quiz.questions.length) * 100}
              className="h-1.5"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {Object.keys(answers).length} من {quiz.questions.length} مُجاب
              </span>
              <Button
                onClick={() => submit.mutate()}
                disabled={!allAnswered || submit.isPending}
                className="gap-2"
              >
                {submit.isPending ? "جارٍ التصحيح..." : "تسليم الإجابات"}
                {!submit.isPending && <CheckCircle2 className="h-4 w-4" />}
              </Button>
            </div>
            {!allAnswered && (
              <p className="text-xs text-muted-foreground">
                أجب عن جميع الأسئلة لتتمكن من التسليم.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
