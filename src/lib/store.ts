"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type View =
  | { type: "home" }
  | { type: "track"; trackId: string }
  | { type: "lesson"; lessonId: string }
  | { type: "progress" }
  | { type: "achievements" }
  | { type: "bookmarks" };

type UIState = {
  view: View;
  goHome: () => void;
  openTrack: (trackId: string) => void;
  openLesson: (lessonId: string) => void;
  openProgress: () => void;
  openAchievements: () => void;
  openBookmarks: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  certificateTrackId: string | null;
  openCertificate: (trackId: string) => void;
  closeCertificate: () => void;
};

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      view: { type: "home" },
      goHome: () => set({ view: { type: "home" }, sidebarOpen: false }),
      openTrack: (trackId) =>
        set({ view: { type: "track", trackId }, sidebarOpen: false }),
      openLesson: (lessonId) =>
        set({ view: { type: "lesson", lessonId }, sidebarOpen: false }),
      openProgress: () => set({ view: { type: "progress" }, sidebarOpen: false }),
      openAchievements: () =>
        set({ view: { type: "achievements" }, sidebarOpen: false }),
      openBookmarks: () =>
        set({ view: { type: "bookmarks" }, sidebarOpen: false }),
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      certificateTrackId: null,
      openCertificate: (trackId) => set({ certificateTrackId: trackId }),
      closeCertificate: () => set({ certificateTrackId: null }),
    }),
    {
      name: "academy-ui",
      partialize: (s) => ({ view: s.view }),
    }
  )
);

// sessionId — one per browser
type SessionState = {
  sessionId: string;
};

const SESSION_KEY = "academy-session";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "fallback";
  }
}

export function useSessionId(): string {
  // simple hook — read once on client
  if (typeof window === "undefined") return "ssr";
  return getOrCreateSessionId();
}

export const sessionIdGetter = getOrCreateSessionId;
