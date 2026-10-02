"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bookmark,
  Clock,
  ArrowLeft,
  Search,
  Trash2,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookmarkItem = {
  id: string;
  lessonId: string;
  createdAt: string;
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
    };
  };
};

export function BookmarksView() {
  const { openLesson, goHome } = useUI();
  const sessionId = useSessionId();
  const { toggle, isToggling } = useBookmarks();

  const { data, isLoading } = useQuery<{ ids: string[]; bookmarks: BookmarkItem[] }>({
    queryKey: ["bookmarks", sessionId],
    queryFn: () =>
      fetch(`/api/bookmarks?sessionId=${encodeURIComponent(sessionId)}`).then(
        (r) => r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  const bookmarks = data?.bookmarks ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Bookmark className="h-6 w-6 fill-amber-500/20" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">الإشارات المرجعية</h1>
            <p className="text-muted-foreground text-sm">
              الدروس التي حفظتها للمراجعة لاحقًا ({bookmarks.length} درس)
            </p>
          </div>
        </div>
      </motion.div>

      {bookmarks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <Bookmark className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1">لا إشارات مرجعية بعد</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
            احفظ الدروس المهمة بالضغط على أيقونة الإشارة المرجعية في صفحة الدرس
            للرجوع إليها بسهولة.
          </p>
          <Button onClick={goHome} className="gap-2">
            <Search className="h-4 w-4" />
            تصفّح الدروس
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card
                className={cn(
                  "p-0 overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-md transition-all group",
                  `track-${b.lesson.track.color}`
                )}
              >
                <div className="flex items-stretch">
                  {/* Left color strip */}
                  <div className="w-1.5 bg-track shrink-0" />

                  <button
                    onClick={() => openLesson(b.lessonId)}
                    className="flex items-center gap-4 p-5 flex-1 text-start min-w-0"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
                        "bg-track/10 text-track ring-track/20 transition-transform group-hover:scale-105"
                      )}
                    >
                      <TrackIcon name={b.lesson.track.icon} className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                        <span className="font-medium">{b.lesson.track.title}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {b.lesson.duration} د
                        </span>
                      </div>
                      <h3 className="font-bold text-base truncate group-hover:text-track transition-colors">
                        {b.lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {b.lesson.summary}
                      </p>
                    </div>

                    <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-track group-hover:-translate-x-1 transition-all" />
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(b.lessonId);
                    }}
                    disabled={isToggling}
                    className="flex items-center px-4 border-s border-border/60 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    aria-label="إزالة"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
