"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Recommendation = {
  type: "first_ever" | "continue_track" | "start_track" | "new_track" | "any_uncompleted" | "all_done";
  label: string;
  track: {
    id: string;
    slug: string;
    title: string;
    color: string;
    icon: string;
    level: string;
  } | null;
  lesson: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    duration: number;
    order: number;
  } | null;
};

const TYPE_LABELS: Record<Recommendation["type"], { text: string; emoji: string; color: string }> = {
  first_ever: { text: "ابدأ رحلتك التعليمية", emoji: "🚀", color: "from-emerald-400 to-teal-500" },
  continue_track: { text: "أكمل ما بدأته", emoji: "📚", color: "from-sky-400 to-blue-500" },
  start_track: { text: "ابدأ مسارًا جديدًا", emoji: "✨", color: "from-amber-400 to-orange-500" },
  new_track: { text: "مسار جديد بانتظارك", emoji: "🎯", color: "from-violet-400 to-fuchsia-500" },
  any_uncompleted: { text: "أكمل بقية الدروس", emoji: "📝", color: "from-rose-400 to-pink-500" },
  all_done: { text: "أكملت كل شيء!", emoji: "🏆", color: "from-amber-400 to-yellow-500" },
};

export function RecommendedNextCard() {
  const { openLesson } = useUI();
  const sessionId = useSessionId();

  const { data: rec, isLoading } = useQuery<Recommendation>({
    queryKey: ["recommend-next", sessionId],
    queryFn: () =>
      fetch(`/api/recommend-next?sessionId=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data: { recommendation: Recommendation }) => data.recommendation),
    enabled: !!sessionId,
  });

  if (isLoading || !rec) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 h-32 animate-pulse" />
    );
  }

  const meta = TYPE_LABELS[rec.type] ?? TYPE_LABELS.first_ever;

  // All done state
  if (rec.type === "all_done" || !rec.lesson || !rec.track) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-transparent dark:from-amber-950/30 dark:via-orange-950/20 p-6 shadow-lg"
      >
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-0.5">
              {meta.emoji} {meta.text}
            </div>
            <h3 className="font-bold text-lg">مبروك! أكملت كل الدروس</h3>
            <p className="text-sm text-muted-foreground">
              أنت محترف حقيقي! راجع الدروس أو انتظر دروسًا جديدة قريبًا.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-transparent" />
      <div className="relative p-5">
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white text-xs shadow-sm",
              meta.color
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            {meta.emoji} {meta.text}
          </span>
        </div>

        {/* Lesson preview */}
        <button
          onClick={() => openLesson(rec.lesson!.id)}
          className={cn(
            "group block w-full text-start rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all p-4 -m-1",
            `track-${rec.track!.color}`
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
                "bg-track/10 text-track ring-track/20 transition-transform group-hover:scale-105"
              )}
            >
              <TrackIcon name={rec.track!.icon} className="h-5.5 w-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                <span className="font-medium">{rec.track!.title}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {rec.lesson!.duration} د
                </span>
              </div>
              <h4 className="font-bold text-base leading-tight mb-1 group-hover:text-track transition-colors">
                {rec.lesson!.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {rec.lesson!.summary}
              </p>
            </div>
            <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-track group-hover:-translate-x-1 transition-all" />
          </div>
        </button>

        {/* CTA */}
        <Button
          onClick={() => openLesson(rec.lesson!.id)}
          size="sm"
          className="w-full mt-3 gap-1.5 shadow-sm"
        >
          {rec.label}
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
