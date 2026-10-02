"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSessionId } from "./use-session-id";

type XPData = {
  total: number;
  level: number;
  levelTitle: string;
};

/**
 * Hook that tracks XP level changes.
 * Returns the current level + a `leveledUp` flag (true for one render cycle
 * after a level increase) + the previous level.
 */
export function useLevelUpTracker(): {
  level: number;
  levelTitle: string;
  total: number;
  leveledUp: boolean;
  prevLevel: number | null;
  dismissLevelUp: () => void;
} {
  const sessionId = useSessionId();
  const prevLevelRef = useRef<number | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);

  const { data } = useQuery<XPData>({
    queryKey: ["xp", sessionId],
    queryFn: () =>
      fetch(`/api/xp?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
    refetchInterval: 5000, // refresh every 5s
  });

  useEffect(() => {
    if (!data) return;
    const currentLevel = data.level;
    if (prevLevelRef.current === null) {
      // first load — set but don't trigger
      prevLevelRef.current = currentLevel;
      return;
    }
    if (currentLevel > prevLevelRef.current) {
      setPrevLevel(prevLevelRef.current);
      prevLevelRef.current = currentLevel;
      setLeveledUp(true);
    } else if (currentLevel < prevLevelRef.current) {
      // shouldn't happen but handle
      prevLevelRef.current = currentLevel;
    }
  }, [data]);

  const dismissLevelUp = () => setLeveledUp(false);

  return {
    level: data?.level ?? 0,
    levelTitle: data?.levelTitle ?? "",
    total: data?.total ?? 0,
    leveledUp,
    prevLevel,
    dismissLevelUp,
  };
}
