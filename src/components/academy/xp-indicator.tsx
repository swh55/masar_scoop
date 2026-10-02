"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { cn } from "@/lib/utils";

type XPData = {
  total: number;
  level: number;
  levelTitle: string;
  progress: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  badgesEarned: number;
};

/**
 * Compact XP level indicator for the header.
 * Shows: a lightning bolt + total XP. Tooltip shows level info.
 */
export function HeaderXPIndicator() {
  const sessionId = useSessionId();
  const { data: xp } = useQuery<XPData>({
    queryKey: ["xp", sessionId],
    queryFn: () =>
      fetch(`/api/xp?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
    refetchInterval: 30000, // refresh every 30s
  });

  if (!xp || xp.total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 me-1 bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 cursor-default group relative"
      title={`المستوى ${xp.level} — ${xp.levelTitle} (${xp.total} نقطة)`}
    >
      <Zap className="h-3.5 w-3.5 fill-violet-500 dark:fill-violet-400 text-violet-500 dark:text-violet-400" />
      <span className="text-xs font-bold tabular-nums">{xp.total}</span>
      <span className="text-xs text-violet-600/70 dark:text-violet-400/70">
        LV{xp.level}
      </span>

      {/* Tooltip on hover */}
      <div className="absolute top-full mt-2 end-0 hidden group-hover:block z-50 w-56 p-3 rounded-xl border border-border bg-popover shadow-xl text-popover-foreground">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-violet-500 fill-violet-500" />
            المستوى {xp.level}
          </span>
          <span className="text-xs text-muted-foreground">{xp.levelTitle}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          {xp.xpIntoLevel} / {xp.xpForNextLevel} نقطة للمستوى التالي
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-violet-500 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${xp.progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Full XP & Level card for the Progress page.
 */
export function XPCard() {
  const sessionId = useSessionId();
  const { data: xp } = useQuery<XPData>({
    queryKey: ["xp", sessionId],
    queryFn: () =>
      fetch(`/api/xp?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  if (!xp) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 animate-pulse h-40" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-50/80 via-fuchsia-50/40 to-transparent dark:from-violet-950/30 dark:via-fuchsia-950/20 p-6 shadow-lg"
    >
      {/* Decorative blob */}
      <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute -bottom-12 -end-12 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Level badge */}
        <div className="relative shrink-0">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
          >
            <Zap className="absolute h-10 w-10 opacity-30" />
            <div className="relative flex flex-col items-center">
              <span className="text-[10px] font-medium opacity-80">LV</span>
              <span className="text-2xl font-extrabold leading-none">
                {xp.level}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Level info + progress */}
        <div className="flex-1 w-full">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div>
              <span className="text-xl font-extrabold text-violet-700 dark:text-violet-400">
                {xp.levelTitle}
              </span>
              <span className="text-sm text-muted-foreground ms-2">
                · المستوى {xp.level}
              </span>
            </div>
            <span className="text-sm font-bold tabular-nums text-violet-600 dark:text-violet-400">
              {xp.total} XP
            </span>
          </div>

          <div className="mb-2 text-xs text-muted-foreground">
            {xp.xpForNextLevel - xp.xpIntoLevel} نقطة للمستوى التالي
          </div>

          {/* Progress bar */}
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="absolute inset-y-0 start-0 bg-gradient-to-l from-violet-500 via-fuchsia-500 to-violet-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xp.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>

          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>المستوى {xp.level}</span>
            <span>المستوى {xp.level + 1}</span>
          </div>

          {/* Mini-stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-violet-500/15 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {xp.lessonsCompleted}
              </span>
              <span className="text-muted-foreground">درس</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {xp.quizzesPassed}
              </span>
              <span className="text-muted-foreground">اختبار</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {xp.badgesEarned}
              </span>
              <span className="text-muted-foreground">شارة</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * XP earned toast popup (animated +50 XP)
 */
export function XPEarnedPopup({
  points,
  reason,
  show,
}: {
  points: number;
  reason?: string;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && points > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          className="fixed top-20 start-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-gradient-to-l from-violet-500 to-fuchsia-500 px-5 py-2.5 text-white shadow-2xl shadow-violet-500/40"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span className="font-bold">+{points} XP</span>
          {reason && <span className="text-xs opacity-90">· {reason}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
