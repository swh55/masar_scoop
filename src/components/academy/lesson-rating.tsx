"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, X, Send } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RatingData = {
  average: number;
  count: number;
  distribution: { star: number; count: number }[];
  userRating: { rating: number; feedback: string | null; updatedAt: string } | null;
};

export function LessonRating({ lessonId }: { lessonId: string }) {
  const sessionId = useSessionId();
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { data, isLoading } = useQuery<RatingData>({
    queryKey: ["rating", lessonId, sessionId],
    queryFn: () =>
      fetch(
        `/api/ratings?lessonId=${lessonId}&sessionId=${encodeURIComponent(
          sessionId
        )}`
      ).then((r) => r.json()),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  const submitMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lessonId,
          rating,
          feedback: feedback.trim() || undefined,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rating", lessonId, sessionId],
      });
      toast.success("شكرًا لتقييمك! 🌟");
      setShowFeedback(false);
    },
  });

  const handleStarClick = (rating: number) => {
    submitMutation.mutate(rating);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-pulse h-24" />
    );
  }

  const average = data?.average ?? 0;
  const count = data?.count ?? 0;
  const userRating = data?.userRating?.rating ?? 0;
  const distribution = data?.distribution ?? [];

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-l from-amber-500/10 via-transparent to-transparent p-5">
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">قيّم هذا الدرس</h3>
              <p className="text-xs text-muted-foreground">
                رأيك يساعدنا في تحسين المحتوى
              </p>
            </div>
          </div>
          {count > 0 && (
            <div className="text-end">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {average.toFixed(1)}
                </span>
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <div className="text-[10px] text-muted-foreground">
                {count} تقييم
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Star rating */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hoverRating || userRating) >= star;
            return (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="group relative"
                aria-label={`${star} نجوم`}
                disabled={submitMutation.isPending}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      isActive
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/40 group-hover:text-amber-300"
                    )}
                  />
                </motion.div>
              </button>
            );
          })}
        </div>

        {/* User's rating indicator */}
        {userRating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-muted-foreground mb-3"
          >
            تقييمك:{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {userRating} / 5
            </span>{" "}
            نجوم
          </motion.div>
        )}

        {/* Feedback toggle */}
        <AnimatePresence>
          {userRating > 0 && !showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <button
                onClick={() => {
                  setFeedback(data?.userRating?.feedback ?? "");
                  setShowFeedback(true);
                }}
                className="flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {data?.userRating?.feedback ? "تعديل التعليق" : "أضف تعليقًا"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback textarea */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="ما الذي أعجبك؟ ما الذي يمكن تحسينه؟"
                  className="resize-none min-h-[80px] text-sm"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">
                    {feedback.length}/500
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowFeedback(false)}
                      className="h-7 text-xs gap-1"
                    >
                      <X className="h-3 w-3" />
                      إلغاء
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => submitMutation.mutate(userRating)}
                      disabled={submitMutation.isPending}
                      className="h-7 text-xs gap-1"
                    >
                      <Send className="h-3 w-3" />
                      إرسال
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Distribution */}
        {count > 0 && (
          <div className="mt-4 pt-4 border-t border-border/60 space-y-1.5">
            {distribution
              .slice()
              .reverse()
              .map((d) => {
                const pct = count > 0 ? (d.count / count) * 100 : 0;
                return (
                  <div key={d.star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-muted-foreground flex items-center gap-0.5">
                      {d.star}
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <span className="w-6 text-end text-muted-foreground tabular-nums">
                      {d.count}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
