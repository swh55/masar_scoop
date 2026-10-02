"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trophy,
  Lock,
  Sparkles,
  Award,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TrackDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  level: string;
  duration: number;
  lessons: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    order: number;
    duration: number;
  }[];
};

type ProgressData = {
  trackProgress: { trackId: string; percent: number }[];
  lessonProgress: Record<
    string,
    { completed: boolean; bestScore: number; quizAttempts: number }
  >;
  stats: {
    totalLessonsCompleted: number;
    totalTracksStarted: number;
    totalTracksCompleted: number;
    totalPerfectQuizzes: number;
  };
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

function useSessionIdLocal() {
  return useSessionId();
}

export function TrackView({ trackId }: { trackId: string }) {
  const { goHome, openLesson, openCertificate } = useUI();
  const sessionId = useSessionIdLocal();

  const { data: track, isLoading } = useQuery<TrackDetail>({
    queryKey: ["track", trackId],
    queryFn: () =>
      fetch(`/api/tracks/${trackId}`).then((r) => {
        if (!r.ok) throw new Error("Track not found");
        return r.json();
      }),
  });

  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["progress", sessionId],
    queryFn: () =>
      fetch(`/api/progress?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground">المسار غير موجود.</p>
        <Button onClick={goHome} className="mt-4">
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  const trackProgress = progress?.trackProgress.find((p) => p.trackId === track.id);
  const percent = trackProgress?.percent ?? 0;
  const completedLessons = track.lessons.filter(
    (l) => progress?.lessonProgress[l.id]?.completed
  ).length;
  const isComplete = percent >= 100;

  return (
    <div>
      {/* Track hero */}
      <section className={cn("relative overflow-hidden bg-hero border-b border-border/60")}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className={cn(
            "absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-15 blur-3xl",
            `track-${track.color}`
          )}
          style={{ background: "var(--track-color)" }}
        />
        <div className="container relative mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={goHome}
            className="mb-6 -ms-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            كل المسارات
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div
              className={cn(
                "flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl ring-1",
                `track-${track.color}`,
                "bg-track/10 text-track ring-track/20"
              )}
            >
              <TrackIcon name={track.icon} className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="border-0 bg-secondary text-secondary-foreground">
                  {LEVEL_LABEL[track.level]}
                </Badge>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  {track.lessons.length} دروس
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {track.duration} دقيقة
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                {track.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {track.description}
              </p>

              {percent > 0 && (
                <div className="mt-5 max-w-md">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {completedLessons} من {track.lessons.length} دروس مكتملة
                    </span>
                    <span className="font-bold text-primary">{percent}%</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              )}

              {isComplete && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <Trophy className="h-4 w-4" />
                    مكتمل! أحسنت
                  </div>
                  <button
                    onClick={() => openCertificate(track.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/15 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/25 transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    عرض الشهادة
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lessons list */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            دروس المسار
          </h2>
          <span className="text-sm text-muted-foreground">
            {completedLessons}/{track.lessons.length} مكتمل
          </span>
        </div>

        <div className="space-y-3">
          {track.lessons.map((lesson, idx) => {
            const lp = progress?.lessonProgress[lesson.id];
            const completed = lp?.completed ?? false;
            const score = lp?.bestScore ?? 0;
            const isFirst = idx === 0;
            const prevCompleted = idx === 0 || progress?.lessonProgress[track.lessons[idx - 1].id]?.completed;
            const locked = !isFirst && !prevCompleted;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card
                  className={cn(
                    "group p-0 overflow-hidden border-border/60 transition-all",
                    !locked && "hover:border-primary/40 hover:shadow-md cursor-pointer",
                    locked && "opacity-60",
                    completed && "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10"
                  )}
                >
                  <button
                    onClick={() => !locked && openLesson(lesson.id)}
                    disabled={locked}
                    className="flex items-center gap-4 p-5 w-full text-start disabled:cursor-not-allowed"
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                        completed
                          ? "bg-emerald-500 text-white"
                          : locked
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      )}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-bold truncate">{lesson.title}</h3>
                        {score > 0 && (
                          <Badge
                            variant="outline"
                            className="ms-auto shrink-0 gap-1 text-xs border-0 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                          >
                            <Trophy className="h-3 w-3" />
                            {score}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {lesson.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} دقيقة
                        </span>
                        {completed && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            مكتمل
                          </span>
                        )}
                      </div>
                    </div>

                    {!locked && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0" />
                    )}
                  </button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
