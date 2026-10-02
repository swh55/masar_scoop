"use client";

import { useSyncExternalStore, useCallback } from "react";

const FOCUS_MODE_KEY = "academy-focus-mode";

function getFocusMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(FOCUS_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

function setFocusMode(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.sessionStorage.setItem(FOCUS_MODE_KEY, "true");
    } else {
      window.sessionStorage.removeItem(FOCUS_MODE_KEY);
    }
    // Notify subscribers
    window.dispatchEvent(new CustomEvent("focus-mode-change"));
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("focus-mode-change", callback);
  return () => window.removeEventListener("focus-mode-change", callback);
}

const emptyServerSnapshot = false;

/**
 * Hook to read and toggle the global focus/reading mode.
 * Focus mode hides the header, footer, and TOC to give a distraction-free reading experience.
 * Stored in sessionStorage so it resets on new session.
 */
export function useFocusMode(): {
  isFocusMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
} {
  const isFocusMode = useSyncExternalStore(
    subscribe,
    getFocusMode,
    () => emptyServerSnapshot
  );

  const toggle = useCallback(() => {
    setFocusMode(!getFocusMode());
  }, []);

  const enable = useCallback(() => setFocusMode(true), []);
  const disable = useCallback(() => setFocusMode(false), []);

  return { isFocusMode, toggle, enable, disable };
}
