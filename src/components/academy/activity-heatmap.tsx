"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Flame } from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { cn } from "@/lib/utils";

type XPData = {
  dailyActivity: { date: string; count: number }[];
};

/**
 * Generate last N days as YYYY-MM-DD strings.
 */
function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const WEEKDAY_LABELS = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
const MONTH_LABELS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/**
 * GitHub-style activity heatmap.
 * Shows the last ~12 weeks (84 days) as a grid of cells.
 */
export function ActivityHeatmap() {
  const sessionId = useSessionId();
  const { data: xp } = useQuery<XPData>({
    queryKey: ["xp", sessionId],
    queryFn: () =>
      fetch(`/api/xp?sessionId=${encodeURIComponent(sessionId)}`).then((r) =>
        r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  // Build 12 weeks × 7 days grid (84 cells)
  const days = getLastNDays(84);
  const activityMap = new Map<string, number>();
  xp?.dailyActivity?.forEach((d) => activityMap.set(d.date, d.count));

  // Group by week (column)
  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate stats
  const totalEvents = xp?.dailyActivity?.reduce((s, d) => s + d.count, 0) ?? 0;
  const activeDays = xp?.dailyActivity?.filter((d) => d.count > 0).length ?? 0;
  const maxCount = Math.max(1, ...(xp?.dailyActivity?.map((d) => d.count) ?? [1]));

  // Find current month labels for column headers
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = new Date(week[0] + "T00:00:00");
    const month = firstDay.getMonth();
    if (month !== lastMonth && weekIdx > 0) {
      monthLabels.push({ weekIndex: weekIdx, label: MONTH_LABELS[month] });
      lastMonth = month;
    } else if (weekIdx === 0) {
      lastMonth = month;
    }
  });

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-muted-foreground/10 dark:bg-muted-foreground/15";
    const intensity = count / maxCount;
    if (intensity <= 0.25)
      return "bg-emerald-200 dark:bg-emerald-500/30";
    if (intensity <= 0.5)
      return "bg-emerald-400 dark:bg-emerald-500/50";
    if (intensity <= 0.75)
      return "bg-emerald-500 dark:bg-emerald-400/70";
    return "bg-emerald-600 dark:bg-emerald-400";
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-bold">نشاطك التعليمي</h3>
            <p className="text-xs text-muted-foreground">
              آخر 12 أسبوعًا · {activeDays} أيام نشطة
            </p>
          </div>
        </div>
        <div className="text-end">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalEvents}
          </div>
          <div className="text-xs text-muted-foreground">إجمالي الأحداث</div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-2 min-w-max" dir="ltr">
          {/* Month labels row */}
          <div className="flex gap-1 ps-7">
            {weeks.map((_, weekIdx) => {
              const label = monthLabels.find((m) => m.weekIndex === weekIdx);
              return (
                <div
                  key={weekIdx}
                  className="w-3 text-[10px] text-muted-foreground/70 font-medium"
                >
                  {label?.label ?? ""}
                </div>
              );
            })}
          </div>

          {/* Day rows */}
          <div className="flex gap-1">
            {/* Weekday labels column */}
            <div className="flex flex-col gap-1 pe-1">
              {WEEKDAY_LABELS.map((day, i) => (
                <div
                  key={day}
                  className="h-3 text-[10px] text-muted-foreground/60 leading-3 flex items-center"
                >
                  {i % 2 === 0 ? day : ""}
                </div>
              ))}
            </div>
            {/* Week columns */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day) => {
                  const count = activityMap.get(day) ?? 0;
                  const date = new Date(day + "T00:00:00");
                  const isToday = day === new Date().toISOString().slice(0, 10);
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.001 }}
                      whileHover={{ scale: 1.3, zIndex: 10 }}
                      className={cn(
                        "h-3 w-3 rounded-sm transition-colors",
                        getColorClass(count),
                        isToday && "ring-1 ring-emerald-600 ring-offset-1 ring-offset-background"
                      )}
                      title={`${day} · ${count} حدث`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Flame className="h-3 w-3 text-amber-500" />
          تابع التعلّم يوميًا لملء التقويم!
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>أقل</span>
          <div className="h-3 w-3 rounded-sm bg-muted-foreground/10" />
          <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-500/30" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-500/50" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-400/70" />
          <div className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
          <span>أكثر</span>
        </div>
      </div>
    </div>
  );
}
