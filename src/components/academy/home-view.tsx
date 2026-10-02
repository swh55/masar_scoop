"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useUI } from "@/lib/store";
import { useSessionId } from "@/hooks/use-session-id";
import { TrackIcon } from "./track-icon";
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid opacity-40" />
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

      {/* Overall progress (only if user has any) */}
      {progress && progress.stats.totalLessonsCompleted > 0 && (
        <section className="container mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <Card className="p-6 border-primary/20 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">رحلة تعلّمك</h3>
                  <p className="text-sm text-muted-foreground">
                    أكملت {completedLessons} من {totalLessons} درس
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-64">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">الإنجاز الكلي</span>
                  <span className="font-bold text-primary">{overallPercent}%</span>
                </div>
                <Progress value={overallPercent} className="h-2.5" />
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Tracks grid */}
      <section id="tracks" className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            المسارات التعليمية
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            اختر مسارًا لتبدأ رحلتك. كل مسار يبني على السابق، فابدأ من الأعلى إن
            كنت جديدًا على تطوير الويب.
          </p>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks?.map((track, idx) => {
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
              },
              {
                icon: Zap,
                title: "اختبارات تفاعلية",
                desc: "اختبر فهمك بعد كل درس باختبارات قصيرة، واحصل على تغذية راجعة فورية.",
              },
              {
                icon: Trophy,
                title: "شارات إنجاز",
                desc: "اربح شارات كلما أكملت مسارًا أو درسًا — حفّز نفسك على الاستمرار.",
              },
              {
                icon: TrendingUp,
                title: "تتبّع التقدّم",
                desc: "شاهد إحصائياتك، دروسك المكتملة، ومستواك في كل مسار بوضوح.",
              },
              {
                icon: Sparkles,
                title: "بنية حديثة",
                desc: "تتعلم على مشروع Next.js 16 حقيقي، بنفس الأدوات التي يستخدمها المحترفون.",
              },
              {
                icon: Users,
                title: "للجميع",
                desc: "من المبتدئ إلى المتقدم — المسارات مصمّمة لكل المستويات.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="p-6 border-border/60 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
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
