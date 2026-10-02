"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Trophy,
  Zap,
  Award,
  Target,
  TrendingUp,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type LessonItem = {
  id: string;
  title: string;
  summary: string;
  duration: number;
  order: number;
  completed: boolean;
  bestScore: number;
  quizAttempts: number;
  lastVisited: string | null;
};

type TrackSummary = {
  track: {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    level: string;
    duration: number;
  };
  isComplete: boolean;
  percent: number;
  stats: {
    completedLessons: number;
    totalLessons: number;
    totalDuration: number;
    averageScore: number;
    perfectScores: number;
    totalAttempts: number;
    xpEarned: number;
    level: number;
    levelTitle: string;
  };
  lessons: LessonItem[];
  recentAchievements: {
    slug: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export function TrackSummaryView({ trackId }: { trackId: string }) {
  const { goHome, openTrack, openLesson, openCertificate } = useUI();
  const sessionId = useSessionId();

  const { data: summary, isLoading } = useQuery<TrackSummary>({
    queryKey: ["track-summary", sessionId, trackId],
    queryFn: () =>
      fetch(
        `/api/track-summary?sessionId=${encodeURIComponent(
          sessionId
        )}&trackId=${trackId}`
      ).then((r) => r.json()),
    enabled: !!sessionId && sessionId !== "ssr" && !!trackId,
  });

  if (isLoading || !summary) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  const { track, isComplete, percent, stats, lessons, recentAchievements } = summary;

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-hero border-b border-border/60">
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
            onClick={() => openTrack(track.id)}
            className="mb-5 -ms-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمسار
          </Button>

          <div className="flex items-start gap-5">
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
              <Badge
                variant="outline"
                className="mb-3 border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                ملخص المسار
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                {track.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {track.description}
              </p>

              {/* Progress bar */}
              <div className="mt-5 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {stats.completedLessons} من {stats.totalLessons} دروس مكتملة
                  </span>
                  <span className="font-bold text-primary text-base">
                    {percent}%
                  </span>
                </div>
                <Progress value={percent} className="h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={CheckCircle2}
            label="دروس مكتملة"
            value={`${stats.completedLessons}/${stats.totalLessons}`}
            color="emerald"
          />
          <StatCard
            icon={Star}
            label="متوسط النتائج"
            value={`${stats.averageScore}%`}
            color="amber"
          />
          <StatCard
            icon={Target}
            label="نتائج كاملة"
            value={stats.perfectScores}
            color="violet"
          />
          <StatCard
            icon={Clock}
            label="المدة الإجمالية"
            value={`${stats.totalDuration}د`}
            color="sky"
          />
        </div>

        {/* Completion banner with certificate CTA */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-transparent dark:from-amber-950/30 dark:via-orange-950/20 p-6 mb-8 shadow-lg"
          >
            <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-start">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-md animate-pulse" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                    <Trophy className="h-7 w-7" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🎉 مبروك! أكملت المسار</h3>
                  <p className="text-sm text-muted-foreground">
                    أحسنت! يمكنك الآن استلام شهادة إتمام هذا المسار
                  </p>
                </div>
              </div>
              <Button
                onClick={() => openCertificate(track.id)}
                size="lg"
                className="gap-2 shadow-lg shadow-amber-500/20 shrink-0"
              >
                <Award className="h-5 w-5" />
                عرض الشهادة
              </Button>
            </div>
          </motion.div>
        )}

        {/* Lessons review */}
        <Card className="overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border bg-muted/40">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              مراجعة الدروس
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              تفاصيل تقدّمك في كل درس من المسار
            </p>
          </div>
          <div className="divide-y divide-border/40">
            {lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors",
                  "hover:bg-muted/30"
                )}
              >
                {/* Status icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    lesson.completed
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {lesson.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-bold text-sm truncate">{lesson.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}د
                    </span>
                    {lesson.quizAttempts > 0 && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {lesson.quizAttempts} محاولة
                      </span>
                    )}
                    {lesson.bestScore > 0 && (
                      <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {lesson.bestScore}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openLesson(lesson.id)}
                  className="gap-1.5 shrink-0 text-xs"
                >
                  مراجعة
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* XP & Level section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">نقاط الخبرة المربوحة</div>
                <div className="text-2xl font-extrabold">{stats.xpEarned} XP</div>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">مستواك الحالي</div>
                <div className="text-2xl font-extrabold">
                  LV{stats.level} · {stats.levelTitle}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent achievements */}
        {recentAchievements.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/40">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                الإنجازات الأخيرة
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {recentAchievements.map((ach) => (
                <div
                  key={ach.slug}
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <TrackIcon name={ach.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{ach.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {ach.description}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(ach.earnedAt).toLocaleDateString("ar-EG", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => openTrack(track.id)}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمسار
          </Button>
          <Button
            variant="ghost"
            onClick={goHome}
            className="gap-2 w-full sm:w-auto"
          >
            الصفحة الرئيسية
          </Button>
          {isComplete && (
            <Button
              onClick={() => openCertificate(track.id)}
              className="gap-2 w-full sm:w-auto sm:ms-auto shadow-lg shadow-amber-500/20"
            >
              <Award className="h-4 w-4" />
              عرض الشهادة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "emerald" | "amber" | "violet" | "sky";
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 border-border/60">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl mb-3",
            colorClasses[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-2xl font-extrabold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </Card>
    </motion.div>
  );
}
