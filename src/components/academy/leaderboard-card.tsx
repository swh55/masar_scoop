"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy, TrendingUp, Users } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { cn } from "@/lib/utils";

type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  avatar: string;
  isCurrentUser: boolean;
};

type LeaderboardData = {
  leaderboard: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
  userRank: number;
  totalLearners: number;
  percentile: number;
};

const RANK_STYLES: Record<number, { bg: string; ring: string; icon: typeof Crown }> = {
  1: { bg: "bg-gradient-to-br from-amber-400 to-yellow-500", ring: "ring-amber-400/40", icon: Crown },
  2: { bg: "bg-gradient-to-br from-slate-300 to-slate-400", ring: "ring-slate-400/40", icon: Medal },
  3: { bg: "bg-gradient-to-br from-orange-400 to-amber-600", ring: "ring-orange-400/40", icon: Trophy },
};

export function LeaderboardCard() {
  const sessionId = useSessionId();
  const { data, isLoading } = useQuery<LeaderboardData>({
    queryKey: ["leaderboard", sessionId],
    queryFn: () =>
      fetch(
        `/api/leaderboard?sessionId=${encodeURIComponent(sessionId)}`
      ).then((r) => r.json()),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  if (isLoading || !data) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 h-96 animate-pulse" />
    );
  }

  const { leaderboard, currentUser, userRank, totalLearners, percentile } = data;
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-l from-amber-500/10 via-transparent to-transparent p-6">
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">المتصدّرون</h3>
              <p className="text-xs text-muted-foreground">
                ترتيبك بين {totalLearners} متعلّم
              </p>
            </div>
          </div>
          {currentUser && (
            <div className="text-end">
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                #{userRank}
              </div>
              <div className="text-xs text-muted-foreground">مرتبتك</div>
            </div>
          )}
        </div>

        {/* Percentile banner */}
        {currentUser && percentile > 0 && (
          <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <TrendingUp className="h-3 w-3" />
            ضمن أعلى {100 - percentile}% من المتعلّمين
          </div>
        )}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 p-5 bg-muted/20">
        {/* Reorder: 2nd, 1st, 3rd */}
        {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry, displayIdx) => {
          if (!entry) return null;
          const isFirst = displayIdx === 1;
          const isFirstPlace = entry.rank === 1;
          const style = RANK_STYLES[entry.rank] ?? null;
          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: displayIdx * 0.1 }}
              className={cn(
                "flex flex-col items-center text-center",
                isFirst && "-mt-4"
              )}
            >
              <div className="relative mb-2">
                {isFirstPlace && (
                  <motion.div
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
                  >
                    <Crown className="h-5 w-5 text-amber-500 fill-amber-400" />
                  </motion.div>
                )}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-2xl text-white shadow-lg ring-2",
                    isFirst ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl",
                    style?.bg ?? "bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/50",
                    style?.ring ?? "ring-border"
                  )}
                >
                  <span>{entry.avatar}</span>
                </div>
              </div>
              <div className="text-xs font-bold truncate w-full" title={entry.name}>
                {entry.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {entry.xp} XP
              </div>
              <div
                className={cn(
                  "mt-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                  entry.isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                #{entry.rank}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the leaderboard */}
      <div className="divide-y divide-border/40">
        {rest.map((entry, idx) => {
          const style = RANK_STYLES[entry.rank];
          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 transition-colors",
                entry.isCurrentUser
                  ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                  : "hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  entry.isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {entry.rank}
              </div>
              <span className="text-lg shrink-0">{entry.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm truncate",
                      entry.isCurrentUser ? "font-bold text-primary" : "font-medium"
                    )}
                  >
                    {entry.name}
                  </span>
                  {entry.isCurrentUser && (
                    <span className="text-[10px] rounded-full bg-primary/10 text-primary px-1.5 py-0.5">
                      أنت
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {entry.levelTitle} · المستوى {entry.level}
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className="text-sm font-bold tabular-nums">
                  {entry.xp.toLocaleString("ar-EG")}
                </div>
                <div className="text-[10px] text-muted-foreground">XP</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
