"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSessionId } from "./use-session-id";

/**
 * Hook for bookmarking/unbookmarking lessons.
 * Returns the list of bookmarked IDs + a toggle function.
 */
export function useBookmarks() {
  const sessionId = useSessionId();
  const queryClient = useQueryClient();

  const { data } = useQuery<{ ids: string[]; bookmarks: unknown[] }>({
    queryKey: ["bookmarks", sessionId],
    queryFn: () =>
      fetch(`/api/bookmarks?sessionId=${encodeURIComponent(sessionId)}`).then(
        (r) => r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  const toggleMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, lessonId }),
      });
      return res.json() as Promise<{ bookmarked: boolean }>;
    },
    onMutate: async (lessonId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["bookmarks", sessionId] });
      const prev = queryClient.getQueryData<{ ids: string[]; bookmarks: unknown[] }>([
        "bookmarks",
        sessionId,
      ]);
      if (prev) {
        const isBookmarked = prev.ids.includes(lessonId);
        queryClient.setQueryData(["bookmarks", sessionId], {
          ...prev,
          ids: isBookmarked
            ? prev.ids.filter((id) => id !== lessonId)
            : [...prev.ids, lessonId],
        });
      }
      return { prev };
    },
    onError: (_err, _lessonId, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["bookmarks", sessionId], ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", sessionId] });
    },
  });

  const ids = data?.ids ?? [];
  const isBookmarked = (lessonId: string) => ids.includes(lessonId);
  const toggle = (lessonId: string) => toggleMutation.mutate(lessonId);

  return {
    bookmarkIds: ids,
    isBookmarked,
    toggle,
    isToggling: toggleMutation.isPending,
  };
}
