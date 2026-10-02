"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, CheckCircle2, Clock, Flame } from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DailyChallenge = {
  challengeDay: number;
  lesson: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    duration: number;
    order: number;
    track: {
      id: string;
      slug: string;
      title: string;
      color: string;
      icon: string;
      level: string;
    };
  };
  completed: boolean;
  bestScore: number;
};

export function DailyChallengeCard() {
  const { openLesson } = useUI();
  const sessionId = useSessionId();

  const { data: challenge, isLoading } = useQuery<DailyChallenge>({
    queryKey: ["daily-challenge", sessionId],
    queryFn: () =>
      fetch(
        `/api/daily-challenge?sessionId=${encodeURIComponent(sessionId)}`
      ).then((r) => r.json()),
    enabled: !!sessionId,
  });

  if (isLoading || !challenge) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 h-48 animate-pulse" />
    );
  }

  const { lesson, completed, bestScore, challengeDay } = challenge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-border/60 shadow-xl"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        aria-hidden
        className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-amber-500/30 blur-md animate-pulse" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight">
                  تحدي اليوم
                </h3>
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500/30" />
              </div>
              <p className="text-xs text-muted-foreground">
                تحدّي #{challengeDay} · يتجدّد كل يوم
              </p>
            </div>
          </div>
          {completed && (
            <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0">
              <CheckCircle2 className="h-3 w-3" />
              مكتمل
            </Badge>
          )}
        </div>

        {/* Lesson preview */}
        <button
          onClick={() => openLesson(lesson.id)}
          className={cn(
            "group block w-full text-start rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all",
            "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
            `track-${lesson.track.color}`
          )}
        >
          <div className="flex items-start gap-4">
            {/* Track icon */}
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
                "bg-track/10 text-track ring-track/20 transition-transform group-hover:scale-105"
              )}
            >
              <TrackIcon name={lesson.track.icon} className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  {lesson.track.title}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} د
                </span>
                {bestScore > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {bestScore}%
                    </span>
                  </>
                )}
              </div>
              <h4 className="font-bold text-base leading-tight mb-1.5 group-hover:text-track transition-colors">
                {lesson.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {lesson.summary}
              </p>
            </div>

            <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-track group-hover:-translate-x-1 transition-all" />
          </div>
        </button>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            {completed
              ? "أحسنت! عد غدًا لتحدي جديد"
              : "أكمل التحدّي اليومي لربح نقاط مضاعفة"}
          </p>
          <Button
            size="sm"
            variant={completed ? "outline" : "default"}
            onClick={() => openLesson(lesson.id)}
            className={cn("gap-1.5", !completed && "shadow-lg shadow-primary/20")}
          >
            {completed ? (
              <>مراجعة</>
            ) : (
              <>
                ابدأ التحدّي
                <ArrowLeft className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
