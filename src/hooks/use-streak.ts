"use client";

import { useSyncExternalStore, useCallback } from "react";

const STREAK_KEY = "academy-streak";
const DATES_KEY = "academy-activity-dates";

type StreakData = {
  current: number;
  longest: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  totalActiveDays: number;
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateDiffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function loadData(): StreakData {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastActiveDate: null, totalActiveDays: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) {
      return { current: 0, longest: 0, lastActiveDate: null, totalActiveDays: 0 };
    }
    return JSON.parse(raw) as StreakData;
  } catch {
    return { current: 0, longest: 0, lastActiveDate: null, totalActiveDays: 0 };
  }
}

function saveData(data: StreakData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    // Track active dates set
    const datesRaw = window.localStorage.getItem(DATES_KEY);
    const dates: string[] = datesRaw ? JSON.parse(datesRaw) : [];
    if (data.lastActiveDate && !dates.includes(data.lastActiveDate)) {
      dates.push(data.lastActiveDate);
      // Keep only last 90 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const filtered = dates.filter((d) => new Date(d + "T00:00:00") >= cutoff);
      window.localStorage.setItem(DATES_KEY, JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }
}

/**
 * Records today's activity and updates the streak.
 * Called once on app mount to register the user's visit.
 * - If last active was yesterday → streak++
 * - If last active was today → no change
 * - Otherwise → streak = 1
 */
function registerActivity(): StreakData {
  const data = loadData();
  const today = todayStr();

  if (data.lastActiveDate === today) {
    // Already registered today
    return data;
  }

  let newCurrent: number;
  if (data.lastActiveDate && dateDiffDays(data.lastActiveDate, today) === 1) {
    // Continued streak
    newCurrent = data.current + 1;
  } else if (data.lastActiveDate && dateDiffDays(data.lastActiveDate, today) === 0) {
    // Same day (shouldn't happen due to check above, but safe)
    newCurrent = data.current;
  } else {
    // Streak broken (or first ever)
    newCurrent = 1;
  }

  const updated: StreakData = {
    current: newCurrent,
    longest: Math.max(data.longest, newCurrent),
    lastActiveDate: today,
    totalActiveDays: data.totalActiveDays + 1,
  };
  saveData(updated);
  return updated;
}

const emptySubscribe = () => () => {};

/**
 * Hook that returns the current streak data and a function to bump it
 * (e.g., after completing a lesson or quiz).
 */
export function useStreak(): {
  streak: number;
  longest: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
  bump: () => void;
} {
  // We read once on client; registerActivity is idempotent for same-day calls
  const data = useSyncExternalStore(
    emptySubscribe,
    () => {
      const d = registerActivity();
      return JSON.stringify(d);
    },
    () => JSON.stringify({ current: 0, longest: 0, totalActiveDays: 0, lastActiveDate: null })
  );

  let parsed: StreakData;
  try {
    parsed = JSON.parse(data) as StreakData;
  } catch {
    parsed = { current: 0, longest: 0, totalActiveDays: 0, lastActiveDate: null };
  }

  // Bump: force a re-registration (idempotent for same day — just ensures today is counted)
  const bump = useCallback(() => {
    registerActivity();
  }, []);

  return {
    streak: parsed.current,
    longest: parsed.longest,
    totalActiveDays: parsed.totalActiveDays,
    lastActiveDate: parsed.lastActiveDate,
    bump,
  };
}

/** Get active dates for a calendar heatmap (last 90 days) */
export function getActiveDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DATES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
