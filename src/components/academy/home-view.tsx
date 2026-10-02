"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  Trophy,
  Users,
  CheckCircle2,
  Circle,
  TrendingUp,
  Search,
  Filter,
  X,
  PlayCircle,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
import { DailyChallengeCard } from "./daily-challenge-card";
import { RecommendedNextCard } from "./recommended-next-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrackList = {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  level: string;
  order: number;
  duration: number;
  lessonCount: number;
};

type ProgressData = {
  trackProgress: {
    trackId: string;
    trackTitle: string;
    trackSlug: string;
    percent: number;
    lastOpenedAt: string | null;
  }[];
  lessonProgress: Record<string, { completed: boolean; bestScore: number }>;
  stats: {
    totalLessonsCompleted: number;
    totalTracksStarted: number;
    totalTracksCompleted: number;
    totalPerfectQuizzes: number;
  };
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

function useSessionIdLocal() {
  return useSessionId();
}

export function HomeView() {
  const { openTrack } = useUI();
  const sessionId = useSessionIdLocal();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const { data: tracks, isLoading: tracksLoading } = useQuery<TrackList[]>({
    queryKey: ["tracks"],
    queryFn: () => fetch("/api/tracks").then((r) => r.json()),
  });

  const { data: progress } = useQuery<ProgressData>({
    queryKey: ["progress", sessionId],
    queryFn: () =>
      fetch(`/api/progress?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId,
  });

  const totalLessons = tracks?.reduce((s, t) => s + t.lessonCount, 0) ?? 0;
  const completedLessons = progress?.stats.totalLessonsCompleted ?? 0;
  const overallPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Filter tracks based on search query and level
  const filteredTracks = useMemo(() => {
    if (!tracks) return [];
    const q = searchQuery.trim().toLowerCase();
    return tracks.filter((t) => {
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.level.toLowerCase().includes(q);
      const matchesLevel = levelFilter === "all" || t.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [tracks, searchQuery, levelFilter]);

  const hasFilters = searchQuery.trim() !== "" || levelFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Floating decorative blobs */}
        <motion.div
          aria-hidden
          className="absolute top-10 -start-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-32 -end-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="container relative mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium border border-primary/20 bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              تعلّم بأسرع طريقة — من الصفر إلى الاحتراف
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              <span className="block">أتقن فنون تطوير</span>
              <span className="bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                الويب الحديث
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              منصة تعليمية تفاعلية تُعلّمك التقنيات التي يستخدمها المحترفون
              فعليًا — <strong className="text-foreground">TypeScript، React، Next.js، Tailwind، Prisma</strong> و أكثر.
              دروس عملية، أمثلة كود، و اختبارات قصيرة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="gap-2 rounded-full px-7 text-base h-12 shadow-lg shadow-primary/25"
                onClick={() => {
                  const firstTrack = tracks?.[0];
                  if (firstTrack) openTrack(firstTrack.id);
                }}
              >
                ابدأ التعلّم الآن
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-7 text-base h-12"
                onClick={() => {
                  document
                    .getElementById("tracks")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <BookOpen className="h-4 w-4" />
                استكشف المسارات
              </Button>
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { label: "مسارات تعليمية", value: tracks?.length ?? 6, icon: BookOpen },
                { label: "درس تفاعلي", value: totalLessons, icon: Target },
                { label: "اختبار قصير", value: totalLessons, icon: Zap },
                { label: "شارة إنجاز", value: 5, icon: Trophy },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 text-center"
                >
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-extrabold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="relative h-px bg-border" />
      </section>

      {/* Overall progress + Continue learning (only if user has any) */}
      {progress && progress.stats.totalLessonsCompleted > 0 && (() => {
        // Find most recently opened in-progress track
        const inProgress = progress.trackProgress
          .filter((t) => t.percent < 100)
          .sort((a, b) => {
            const da = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
            const db = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
            return db - da;
          })[0];
        const trackMeta = tracks?.find((t) => t.id === inProgress?.trackId);

        return (
          <section className="container mx-auto px-4 sm:px-6 -mt-8 relative z-10">
            <Card className="overflow-hidden border-primary/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-transparent" />
              <div className="relative p-6 sm:p-7">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">رحلة تعلّمك</h3>
                      <p className="text-sm text-muted-foreground">
                        أكملت{" "}
                        <span className="font-bold text-primary">
                          {completedLessons}
                        </span>{" "}
                        من {totalLessons} درس
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-64">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">الإنجاز الكلي</span>
                      <span className="font-bold text-primary text-base">
                        {overallPercent}%
                      </span>
                    </div>
                    <Progress value={overallPercent} className="h-2.5" />
                  </div>
                  {inProgress && trackMeta && (
                    <Button
                      onClick={() => openTrack(trackMeta.id)}
                      size="lg"
                      className="gap-2 w-full lg:w-auto shadow-lg shadow-primary/20"
                    >
                      <PlayCircle className="h-5 w-5" />
                      تابع التعلّم
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {inProgress && trackMeta && (
                  <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3 text-sm">
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-track/10 text-track ring-1 ring-track/20", `track-${trackMeta.color}`)}>
                      <TrackIcon name={trackMeta.icon} className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <span className="text-muted-foreground">آخر مسار: </span>
                      <span className="font-medium">{trackMeta.title}</span>
                      <span className="text-muted-foreground"> — {inProgress.percent}% مكتمل</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </section>
        );
      })()}

      {/* Daily Challenge — always visible */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyChallengeCard />
          <RecommendedNextCard />
        </div>
      </section>

      {/* Tracks grid */}
      <section id="tracks" className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            المسارات التعليمية
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            اختر مسارًا لتبدأ رحلتك. كل مسار يبني على السابق، فابدأ من الأعلى إن
            كنت جديدًا على تطوير الويب.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md mx-auto sm:mx-0 w-full">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مسار... (مثل: React، Prisma، مبتدئ)"
              className="w-full rounded-full border border-border bg-card ps-10 pe-10 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              aria-label="بحث في المسارات"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            {(["all", "beginner", "intermediate", "advanced"] as const).map((lv) => (
              <button
                key={lv}
                onClick={() => setLevelFilter(lv)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                  levelFilter === lv
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {lv === "all" ? "الكل" : LEVEL_LABEL[lv]}
              </button>
            ))}
          </div>
        </div>

        {tracksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">لا نتائج</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {hasFilters
                ? "لم نجد مسارات تطابق بحثك. جرّب تعديل الفلاتر."
                : "لا توجد مسارات متاحة حاليًا."}
            </p>
            {hasFilters && (
              <Button onClick={clearFilters} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                مسح الفلاتر
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTracks.map((track, idx) => {
                const tp = progress?.trackProgress.find(
                  (p) => p.trackId === track.id
                );
                return (
                  <TrackCard
                    key={track.id}
                    track={track}
                    percent={tp?.percent ?? 0}
                    index={idx}
                    onOpen={() => openTrack(track.id)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Why this academy */}
      <section className="bg-muted/30 border-y border-border/60 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              لماذا هذه الأكاديمية؟
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              تعلّم التقنيات التي تُستخدم فعلًا في بناء التطبيقات الحديثة — لا
              نظريات منفصلة عن الواقع.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "محتوى عملي 100%",
                desc: "كل درس يحتوي على مثال كود حقيقي قابل للتشغيل، لا مجرد شروحات نظرية.",
                color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: Zap,
                title: "محرر كود تفاعلي",
                desc: "اكتب وعدّل الكود مباشرة في المتصفح، واضغط 'تشغيل' لترى النتيجة فورًا!",
                color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              },
              {
                icon: Trophy,
                title: "نقاط ومستويات",
                desc: "اربح XP مع كل درس واختبار، وارتقِ في المستويات من مبتدئ إلى أسطورة!",
                color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              },
              {
                icon: TrendingUp,
                title: "تتبّع النشاط",
                desc: "خريطة نشاط بأسلوب GitHub تظهر تقدّمك اليومي — حافظ على سلسلتك!",
                color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
              },
              {
                icon: Users,
                title: "جدول المتصدّرين",
                desc: "نافس متعلّمين آخرين وتابع ترتيبك بينهم — التحفيز الاجتماعي يصنع الفارق.",
                color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              },
              {
                icon: Sparkles,
                title: "تحدّي يومي",
                desc: "درس جديد كل يوم يتجدّد تلقائيًا — تحدٍّ مشترك لكل المتعلّمين.",
                color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Card
                  className="p-6 border-border/60 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all h-full group"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110",
                      feature.color
                    )}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TrackCard({
  track,
  percent,
  index,
  onOpen,
}: {
  track: TrackList;
  percent: number;
  index: number;
  onOpen: () => void;
}) {
  const completed = percent >= 100;
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onOpen}
      className={cn(
        "group relative text-start overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all",
        "hover:border-primary/50 hover:shadow-xl hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        `track-${track.color}`
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-track opacity-10 blur-2xl transition-all group-hover:opacity-20 group-hover:scale-110" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-track/10 text-track ring-1 ring-track/20">
            <TrackIcon name={track.icon} className="h-7 w-7" />
          </div>
          {completed ? (
            <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0">
              <CheckCircle2 className="h-3 w-3" />
              مكتمل
            </Badge>
          ) : percent > 0 ? (
            <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-0">
              <Circle className="h-3 w-3 fill-current" />
              {percent}%
            </Badge>
          ) : (
            <Badge variant="outline" className={cn("border-0", LEVEL_COLOR[track.level])}>
              {LEVEL_LABEL[track.level]}
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-xl mb-2 group-hover:text-track transition-colors">
          {track.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 min-h-[3.75rem]">
          {track.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {track.lessonCount} دروس
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {track.duration} دقيقة
          </span>
        </div>

        {percent > 0 && (
          <div className="mb-3">
            <Progress value={percent} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-sm font-medium text-track opacity-0 group-hover:opacity-100 transition-opacity">
            ابدأ التعلّم
          </span>
          <ArrowLeft className="h-4 w-4 text-track opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
        </div>
      </div>
    </motion.button>
  );
}
