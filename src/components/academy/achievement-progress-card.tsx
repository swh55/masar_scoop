"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles, TrendingUp } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  earned: boolean;
  earnedAt: string | null;
};

type ProgressData = {
  stats: {
    totalLessonsCompleted: number;
    totalTracksStarted: number;
    totalTracksCompleted: number;
    totalPerfectQuizzes: number;
  };
};

/**
 * Parse an achievement condition like "lessons_completed:5" into
 * { type, target } for progress display.
 */
function parseCondition(condition: string): {
  type: string;
  target: number;
  label: string;
} | null {
  const [type, targetStr] = condition.split(":");
  if (!type || !targetStr) return null;
  const target = parseInt(targetStr, 10);
  if (isNaN(target)) return null;

  const labels: Record<string, string> = {
    lessons_completed: "دروس مكتملة",
    track_completed: "مسارات مكتملة",
    tracks_completed: "مسارات مكتملة",
    tracks_started: "مسارات بدأت",
    perfect_quizzes: "اختبارات بنسبة 100%",
    quizzes_passed: "اختبارات مجتازة",
    xp_total: "نقاط خبرة",
  };

  return {
    type,
    target,
    label: labels[type] ?? type,
  };
}

export function AchievementProgressCard({
  achievement,
  onOpen,
}: {
  achievement: Achievement;
  onOpen?: () => void;
}) {
  const sessionId = useSessionId();
  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["progress", sessionId],
    queryFn: () =>
      fetch(`/api/progress?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  // Also fetch XP for xp_total conditions
  const { data: xpData } = useQuery<{ total: number }>({
    queryKey: ["xp", sessionId],
    queryFn: () =>
      fetch(`/api/xp?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  const parsed = parseCondition(achievement.condition);

  // Compute current value
  let current = 0;
  if (parsed) {
    if (parsed.type === "lessons_completed") {
      current = progress?.stats.totalLessonsCompleted ?? 0;
    } else if (parsed.type === "tracks_started") {
      current = progress?.stats.totalTracksStarted ?? 0;
    } else if (
      parsed.type === "track_completed" ||
      parsed.type === "tracks_completed"
    ) {
      current = progress?.stats.totalTracksCompleted ?? 0;
    } else if (parsed.type === "perfect_quizzes") {
      current = progress?.stats.totalPerfectQuizzes ?? 0;
    } else if (parsed.type === "quizzes_passed") {
      // approximate from lessonsCompleted (not exact but close)
      current = progress?.stats.totalLessonsCompleted ?? 0;
    } else if (parsed.type === "xp_total") {
      current = xpData?.total ?? 0;
    }
  }

  const percent =
    parsed && parsed.target > 0
      ? Math.min(100, Math.round((current / parsed.target) * 100))
      : achievement.earned
      ? 100
      : 0;

  return (
    <button
      onClick={onOpen}
      className="block w-full text-start"
      aria-label={`تفاصيل شارة ${achievement.title}`}
    >
      <Card
        className={cn(
          "p-5 border-border/60 transition-all relative overflow-hidden h-full",
          "hover:border-primary/40 hover:shadow-md cursor-pointer",
          achievement.earned
            ? "bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-950/20 border-amber-500/30"
            : ""
        )}
      >
        {achievement.earned && (
          <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
        )}
        <div className="relative flex items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
              achievement.earned
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20"
                : "bg-muted text-muted-foreground ring-border"
            )}
          >
            {achievement.earned ? (
              <TrackIcon name={achievement.icon} className="h-6 w-6" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold truncate">{achievement.title}</h3>
              {achievement.earned && (
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {achievement.description}
            </p>
            {parsed && !achievement.earned && (
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{parsed.label}</span>
                  <span className="font-medium">
                    {current} / {parsed.target}
                  </span>
                </div>
                <Progress value={percent} className="h-1" />
              </div>
            )}
            {achievement.earned && parsed && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-3 w-3" />
                {parsed.target} {parsed.label}
              </div>
            )}
          </div>
        </div>
      </Card>
    </button>
  );
}
