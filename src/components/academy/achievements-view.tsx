"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Sparkles, Footprints, GraduationCap, Languages, Award, X } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AchievementProgressCard } from "./achievement-progress-card";
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

const ICON_MAP: Record<string, typeof Trophy> = {
  Trophy,
  Award,
  GraduationCap,
  Footprints,
  Languages,
};

function useSessionIdLocal() {
  return useSessionId();
}

export function AchievementsView() {
  const sessionId = useSessionIdLocal();
  const [selected, setSelected] = useState<Achievement | null>(null);

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: () =>
      fetch(
        `/api/achievements?sessionId=${encodeURIComponent(sessionId)}`
      ).then((r) => r.json()),
    enabled: !!sessionId,
  });

  const earned = achievements?.filter((a) => a.earned) ?? [];
  const locked = achievements?.filter((a) => !a.earned) ?? [];
  const earnedPercent =
    achievements && achievements.length > 0
      ? Math.round((earned.length / achievements.length) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">شارات الإنجاز</h1>
            <p className="text-muted-foreground text-sm">
              اربح الشارات بإكمال الدروس و المسارات و الاختبارات
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <Card className="p-6 mb-8 overflow-hidden relative">
        <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="relative">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted/40"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={`${(earnedPercent / 100) * 264} 264`}
                strokeLinecap="round"
                className="text-amber-500 transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold">{earnedPercent}%</span>
              <span className="text-[10px] text-muted-foreground">مكتمل</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">تقدّمك الكلي</div>
            <div className="text-2xl font-bold">
              {earned.length} / {achievements?.length ?? 0} شارات
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {earned.length === 0
                ? "ابدأ أول درس لتربح أول شارة!"
                : earned.length === achievements?.length
                ? "🏆 مبروك! حصلت على كل الشارات"
                : `بقي ${locked.length} شارة لتربحها`}
            </p>
          </div>
        </div>
      </Card>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((a, idx) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <AchievementProgressCard
              achievement={a}
              onOpen={() => setSelected(a)}
            />
          </motion.div>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <AchievementDetailModal
            achievement={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AchievementDetailModal({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div
          className={cn(
            "relative h-32 overflow-hidden flex items-center justify-center",
            achievement.earned
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/50"
          )}
        >
          <div className="absolute inset-0 bg-grid opacity-20" />
          <motion.div
            aria-hidden
            className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/20 blur-2xl"
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="text-6xl"
          >
            {achievement.earned ? "🏆" : "🔒"}
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-extrabold">{achievement.title}</h2>
            {achievement.earned && (
              <Sparkles className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5">
            {achievement.description}
          </p>

          <AchievementProgressCard achievement={achievement} />

          {achievement.earned && achievement.earnedAt && (
            <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-400 text-center">
              🎉 مكسوبة في{" "}
              {new Date(achievement.earnedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {!achievement.earned && (
            <p className="mt-4 text-xs text-muted-foreground text-center">
              استمر في التعلّم — كل درس واختبار يقربك من هذه الشارة!
            </p>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-5"
          >
            إغلاق
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
