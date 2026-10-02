"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/store";
import { useBookmarks } from "./use-bookmarks";
import { useFocusMode } from "./use-focus-mode";

/**
 * Keyboard shortcuts for navigation.
 * - J / H: go home
 * - K / P: go to progress
 * - B: go to bookmarks
 * - T / A: go to achievements (T for Trophy)
 * - F: toggle focus mode (only on lesson view)
 *
 * Only triggers when not typing in an input/textarea.
 */
export function useKeyboardShortcuts() {
  const { goHome, openProgress, openAchievements, openBookmarks, view } = useUI();
  const { bookmarkIds } = useBookmarks();
  const { isFocusMode, toggle: toggleFocus } = useFocusMode();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      // Don't trigger with modifiers (Ctrl, Cmd, Alt) except for F
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // ESC to exit focus mode
      if (e.key === "Escape" && isFocusMode && view.type === "lesson") {
        e.preventDefault();
        toggleFocus();
        return;
      }

      switch (key) {
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
        case "f":
          if (view.type === "lesson") {
            e.preventDefault();
            toggleFocus();
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goHome, openProgress, openAchievements, openBookmarks, view, bookmarkIds, isFocusMode, toggleFocus]);
}

/**
 * Helper to display shortcuts in a tooltip.
 */
export const SHORTCUT_HINTS = [
  { key: "J / H", action: "الصفحة الرئيسية" },
  { key: "K / P", action: "تقدّمي" },
  { key: "B", action: "المحفوظات" },
  { key: "T / A", action: "الإنجازات" },
  { key: "F", action: "وضع التركيز (في الدرس)" },
] as const;
