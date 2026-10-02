"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/store";
import { useBookmarks } from "./use-bookmarks";

/**
 * Keyboard shortcuts for navigation.
 * - J / ArrowLeft: go home
 * - K / ArrowRight: go to progress
 * - B: go to bookmarks
 * - T: go to achievements (T for Trophy)
 * - ?: focus search (on home page)
 *
 * Only triggers when not typing in an input/textarea.
 */
export function useKeyboardShortcuts() {
  const { goHome, openProgress, openAchievements, openBookmarks, view } = useUI();
  const { bookmarkIds } = useBookmarks();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      // Don't trigger with modifiers (Ctrl, Cmd, Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "j":
        case "h":
          e.preventDefault();
          goHome();
          break;
        case "k":
        case "p":
          e.preventDefault();
          openProgress();
          break;
        case "b":
          e.preventDefault();
          openBookmarks();
          break;
        case "t":
        case "a":
          e.preventDefault();
          openAchievements();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goHome, openProgress, openAchievements, openBookmarks, view, bookmarkIds]);
}

/**
 * Helper to display shortcuts in a tooltip.
 */
export const SHORTCUT_HINTS = [
  { key: "J / H", action: "الصفحة الرئيسية" },
  { key: "K / P", action: "تقدّمي" },
  { key: "B", action: "المحفوظات" },
  { key: "T / A", action: "الإنجازات" },
] as const;
