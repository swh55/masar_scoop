"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowLeft,
  Clock,
  BookOpen,
  Loader2,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { TrackIcon } from "./track-icon";
import { cn } from "@/lib/utils";

type SearchResult = {
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
    level: string;
  };
  score: number;
};

type TrackResult = {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  level: string;
  lessonCount: number;
};

type SearchData = {
  query: string;
  lessons: SearchResult[];
  tracks: TrackResult[];
};

const emptySubscribe = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Global search command palette.
 * Triggered by:
 *  - Clicking the search icon in the header
 *  - Pressing Ctrl+K / Cmd+K
 *  - Pressing / (when not in an input)
 */
export function GlobalSearch() {
  const mounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openLesson, openTrack } = useUI();

  // Listen for keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        // reset state via the same path as handleClose
        setIsOpen(false);
        setQuery("");
        setActiveIndex(0);
      }
      // "/" to open search (when not typing)
      if (e.key === "/" && !isOpen) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close handler that resets state
  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  // Expose open function globally so header button can trigger it
  useEffect(() => {
    (window as unknown as { __openSearch?: () => void }).__openSearch = () =>
      setIsOpen(true);
  }, []);

  const { data, isFetching } = useQuery<SearchData>({
    queryKey: ["search", query],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(query)}&limit=15`).then((r) =>
        r.json()
      ),
    enabled: query.trim().length >= 2,
  });

  const results = data?.lessons ?? [];
  const trackResults = data?.tracks ?? [];
  const totalResults = results.length + trackResults.length;
  const flatResults: Array<
    | { type: "lesson"; data: SearchResult }
    | { type: "track"; data: TrackResult }
  > = [
    ...trackResults.map((d) => ({ type: "track" as const, data: d })),
    ...results.map((d) => ({ type: "lesson" as const, data: d })),
  ];

  // Reset active index when query changes (handled in onChange, not effect)

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[activeIndex]) {
      e.preventDefault();
      const r = flatResults[activeIndex];
      if (r.type === "lesson") openLesson(r.data.id);
      else openTrack(r.data.id);
      handleClose();
    }
  };

  const handleResultClick = (
    r: { type: "lesson"; data: SearchResult } | { type: "track"; data: TrackResult }
  ) => {
    if (r.type === "lesson") openLesson(r.data.id);
    else openTrack(r.data.id);
    handleClose();
  };

  const hasQuery = query.trim().length >= 2;

  return (
    <AnimatePresence>
      {isOpen && mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="بحث"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="ابحث في كل الدروس والمسارات... (مثل: useState، hooks، Prisma)"
                className="flex-1 bg-transparent text-base placeholder:text-muted-foreground/70 focus:outline-none"
                aria-label="بحث"
              />
              {isFetching && (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
              )}
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted text-muted-foreground shrink-0">
                ESC
              </kbd>
              <button
                onClick={handleClose}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!hasQuery ? (
                <div className="p-8 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Search className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    ابحث في كل الدروس والمسارات التعليمية
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>جرّب:</span>
                    {["useState", "Prisma", "Tailwind", "Generics", "hooks"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full bg-muted px-2.5 py-1 hover:bg-muted/70 transition-colors"
                          dir="ltr"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : totalResults === 0 && !isFetching ? (
                <div className="p-8 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Hash className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="font-bold mb-1">لا نتائج لـ &ldquo;{query}&rdquo;</p>
                  <p className="text-sm text-muted-foreground">
                    جرّب كلمة أخرى أو تحقق من الإملاء
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Tracks */}
                  {trackResults.length > 0 && (
                    <div className="px-2 mb-1">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
                        مسارات ({trackResults.length})
                      </div>
                      {trackResults.map((t, idx) => {
                        const flatIdx = idx;
                        const isActive = flatIdx === activeIndex;
                        return (
                          <button
                            key={t.id}
                            onClick={() =>
                              handleResultClick({ type: "track", data: t })
                            }
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={cn(
                              "flex items-center gap-3 w-full px-2 py-2 rounded-lg text-start transition-colors",
                              isActive ? "bg-primary/10" : "hover:bg-muted/60"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
                                `track-${t.color}`,
                                "bg-track/10 text-track ring-track/20"
                              )}
                            >
                              <TrackIcon name={t.icon} className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {t.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {t.lessonCount} دروس · {t.description}
                              </div>
                            </div>
                            {isActive && (
                              <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Lessons */}
                  {results.length > 0 && (
                    <div className="px-2">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
                        دروس ({results.length})
                      </div>
                      {results.map((l, idx) => {
                        const flatIdx = trackResults.length + idx;
                        const isActive = flatIdx === activeIndex;
                        return (
                          <button
                            key={l.id}
                            onClick={() =>
                              handleResultClick({ type: "lesson", data: l })
                            }
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={cn(
                              "flex items-center gap-3 w-full px-2 py-2 rounded-lg text-start transition-colors",
                              isActive ? "bg-primary/10" : "hover:bg-muted/60"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
                                `track-${l.track.color}`,
                                "bg-track/10 text-track ring-track/20"
                              )}
                            >
                              <BookOpen className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {l.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {l.track.title} · {l.summary}
                              </div>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                              <Clock className="h-3 w-3" />
                              {l.duration}د
                            </span>
                            {isActive && (
                              <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 font-mono rounded border border-border bg-card">↑↓</kbd>
                  تنقّل
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 font-mono rounded border border-border bg-card">↵</kbd>
                  اختيار
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 font-mono rounded border border-border bg-card">ESC</kbd>
                  إغلاق
                </span>
              </div>
              <span>{totalResults > 0 && `${totalResults} نتيجة`}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Search trigger button for the header.
 */
export function SearchTriggerButton() {
  const mounted = useMounted();

  const handleClick = () => {
    const open = (window as unknown as { __openSearch?: () => void }).__openSearch;
    open?.();
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 transition-colors"
        aria-label="بحث"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">بحث</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors group"
      aria-label="بحث (Ctrl+K)"
    >
      <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
      <span className="hidden lg:inline">بحث في الدروس</span>
      <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">
        Ctrl K
      </kbd>
    </button>
  );
}
