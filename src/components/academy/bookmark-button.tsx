"use client";

import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  lessonId,
  lessonTitle,
  variant = "icon",
}: {
  lessonId: string;
  lessonTitle?: string;
  variant?: "icon" | "button";
}) {
  const { isBookmarked, toggle, isToggling } = useBookmarks();
  const bookmarked = isBookmarked(lessonId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(lessonId);
    toast.success(
      bookmarked ? "أُزيل من الإشارات المرجعية" : "أُضيف إلى الإشارات المرجعية",
      {
        description: bookmarked
          ? undefined
          : lessonTitle
          ? `"${lessonTitle}" محفوظ للمراجعة`
          : undefined,
      }
    );
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isToggling}
        aria-label={
          bookmarked ? "إزالة من الإشارات المرجعية" : "إضافة إلى الإشارات المرجعية"
        }
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-muted",
          bookmarked && "text-amber-500"
        )}
      >
        <motion.span
          key={bookmarked ? "on" : "off"}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-5 w-5 fill-amber-500/20" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </motion.span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all",
        bookmarked
          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {bookmarked ? "محفوظ" : "احفظ"}
    </button>
  );
}
