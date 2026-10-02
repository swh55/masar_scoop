"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trophy,
  BookOpen,
  Target,
  Zap,
  Award,
  TrendingUp,
  Clock,
  Flame,
  Medal,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressData = {
  trackProgress: {
    trackId: string;
    trackTitle: string;
    trackSlug: string;
    percent: number;
    lastOpenedAt: string | null;
  }[];
  stats: {
    totalLessonsCompleted: number;
    totalTracksStarted: number;
    totalTracksCompleted: number;
    totalPerfectQuizzes: number;
  };
};

type Track = {
  id: string;
  slug: string;
  title: string;
  color: string;
  icon: string;
  level: string;
  duration: number;
  lessonCount: number;
};

function useSessionIdLocal() {
  return useSessionId();
}

export function ProgressView() {
  const { openTrack, openAchievements, goHome } = useUI();
  const sessionId = useSessionIdLocal();

  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["progress", sessionId],
    queryFn: () =>
      fetch(`/api/progress?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId,
  });

  const { data: tracks } = useQuery<Track[]>({
    queryKey: ["tracks"],
    queryFn: () => fetch("/api/tracks").then((r) => r.json()),
  });

  if (!progress) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  const { stats } = progress;
  const hasActivity = stats.totalLessonsCompleted > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">تقدّمي</h1>
            <p className="text-muted-foreground text-sm">
              تتبّع رحلتك في تعلّم تطوير الويب
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={BookOpen}
          label="دروس مكتملة"
          value={stats.totalLessonsCompleted}
          color="emerald"
        />
        <StatCard
          icon={Target}
          label="مسارات بدأت"
          value={stats.totalTracksStarted}
          color="amber"
        />
        <StatCard
          icon={Trophy}
          label="مسارات مكتملة"
          value={stats.totalTracksCompleted}
          color="rose"
        />
        <StatCard
          icon={Zap}
          label="اختبارات بنسبة 100%"
          value={stats.totalPerfectQuizzes}
          color="violet"
        />
      </div>

      {/* Tracks progress */}
      <Card className="p-6 mb-6">
        <h2 className="font-bold text-lg mb-1">تقدّمي في المسارات</h2>
        <p className="text-sm text-muted-foreground mb-5">
          استأنف من حيث توقفت في كل مسار
        </p>

        {!hasActivity ? (
          <div className="text-center py-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
              <Flame className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">لم تبدأ بعد!</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              ابدأ أول درس لك لتتبّع تقدّمك هنا وربح شارات الإنجاز.
            </p>
            <Button onClick={goHome} className="gap-2">
              <BookOpen className="h-4 w-4" />
              تصفّح المسارات
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks?.map((track) => {
              const tp = progress.trackProgress.find(
                (p) => p.trackId === track.id
              );
              const percent = tp?.percent ?? 0;
              return (
                <button
                  key={track.id}
                  onClick={() => openTrack(track.id)}
                  className={cn(
                    "group flex items-center gap-4 w-full p-4 rounded-xl border border-border/60 text-start transition-all",
                    "hover:border-primary/40 hover:shadow-sm",
                    percent > 0 && percent < 100 && "bg-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
                      `track-${track.color}`,
                      "bg-track/10 text-track ring-track/20"
                    )}
                  >
                    <TrackIcon name={track.icon} className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-bold truncate">{track.title}</h3>
                      <span className="text-sm font-bold text-primary shrink-0">
                        {percent}%
                      </span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                  {percent >= 100 && (
                    <Badge className="shrink-0 gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0">
                      <Medal className="h-3 w-3" />
                      مكتمل
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick links */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">شارات الإنجاز</h3>
            <p className="text-sm text-muted-foreground">
              اعرض كل الشارات التي ربحتها واكتشف ما تبقّى
            </p>
          </div>
          <Button variant="outline" onClick={openAchievements} className="gap-2">
            عرض الكل
          </Button>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  color: "emerald" | "amber" | "rose" | "violet";
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
        <div className="text-3xl font-extrabold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </Card>
    </motion.div>
  );
}
