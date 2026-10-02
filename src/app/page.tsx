"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUI } from "@/lib/store";
import { Header } from "@/components/academy/header";
import { Footer } from "@/components/academy/footer";
import { HomeView } from "@/components/academy/home-view";
import { TrackView } from "@/components/academy/track-view";
import { LessonView } from "@/components/academy/lesson-view";
import { ProgressView } from "@/components/academy/progress-view";
import { AchievementsView } from "@/components/academy/achievements-view";

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
      </main>
      <Footer />
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
