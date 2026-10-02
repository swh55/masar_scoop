"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUI } from "@/lib/store";
import { useLevelUpTracker } from "@/hooks/use-level-up";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Header } from "@/components/academy/header";
import { Footer } from "@/components/academy/footer";
import { HomeView } from "@/components/academy/home-view";
import { TrackView } from "@/components/academy/track-view";
import { LessonView } from "@/components/academy/lesson-view";
import { ProgressView } from "@/components/academy/progress-view";
import { AchievementsView } from "@/components/academy/achievements-view";
import { BookmarksView } from "@/components/academy/bookmarks-view";
import { OnboardingModal } from "@/components/academy/onboarding-modal";
import { LevelUpCelebration } from "@/components/academy/confetti";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AcademyApp() {
  const { view } = useUI();
  const { level, levelTitle, leveledUp, dismissLevelUp } = useLevelUpTracker();
  useKeyboardShortcuts();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view.type === "home" && <HomeView />}
        {view.type === "track" && <TrackView trackId={view.trackId} />}
        {view.type === "lesson" && <LessonView lessonId={view.lessonId} />}
        {view.type === "progress" && <ProgressView />}
        {view.type === "achievements" && <AchievementsView />}
        {view.type === "bookmarks" && <BookmarksView />}
      </main>
      <Footer />
      <OnboardingModal />
      <LevelUpCelebration
        level={level}
        levelTitle={levelTitle}
        trigger={leveledUp}
        onDismiss={dismissLevelUp}
      />
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AcademyApp />
    </QueryClientProvider>
  );
}
