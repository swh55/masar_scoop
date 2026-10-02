"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Lock, Sparkles, Footprints, GraduationCap, Languages, Award } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        {achievements?.map((a, idx) => {
          const Icon = ICON_MAP[a.icon] ?? Trophy;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <Card
                className={cn(
                  "p-6 h-full border-border/60 transition-all relative overflow-hidden",
                  a.earned
                    ? "border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20"
                    : "opacity-70"
                )}
              >
                {a.earned && (
                  <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
                )}
                <div className="relative">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ring-1",
                      a.earned
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20"
                        : "bg-muted text-muted-foreground ring-border"
                    )}
                  >
                    {a.earned ? (
                      <Icon className="h-7 w-7" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {a.description}
                  </p>

                  {a.earned ? (
                    <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-0">
                      <Sparkles className="h-3 w-3" />
                      مكسوبة
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      مقفلة
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
