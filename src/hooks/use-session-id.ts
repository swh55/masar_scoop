"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "academy-session";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

const emptySubscribe = () => () => {};

/**
 * Returns a stable per-browser session ID, persisted in localStorage.
 * Returns "ssr" on the server to avoid hydration mismatch.
 */
export function useSessionId(): string {
  return useSyncExternalStore(
    emptySubscribe,
    getSessionId,
    () => "ssr"
  );
}
