import { db } from "@/lib/db";

/**
 * XP (Experience Points) system for the Programming Academy.
 *
 * Points are awarded for:
 *  - Lesson completed: +50 XP (first time only)
 *  - Quiz passed (>=60%): +30 XP (first time only)
 *  - Quiz perfect (100%): +50 XP bonus (first time only)
 *  - Track completed (100%): +200 XP (first time only)
 *  - Achievement earned: +25 XP each
 */

export const XP_RULES = {
  lesson_complete: 50,
  quiz_pass: 30,
  quiz_perfect: 50,
  track_complete: 200,
  badge_earn: 25,
} as const;

export type XPAction = keyof typeof XP_RULES;

/**
 * Award XP for an action. Idempotent — checks XPHistory to avoid
 * awarding the same action twice for the same refId.
 * Optional `multiplier` scales the points (e.g. 2 for daily challenge bonus).
 */
export async function awardXP(
  sessionId: string,
  action: XPAction,
  refId?: string,
  multiplier = 1
): Promise<{ awarded: number; total: number; is_new: boolean }> {
  const basePoints = XP_RULES[action];
  const points = Math.round(basePoints * multiplier);

  // Check if this exact action+refId was already awarded
  const existing = await db.xPHistory.findFirst({
    where: {
      userXP: { sessionId },
      action,
      refId: refId ?? null,
    },
  });

  if (existing) {
    const userXP = await db.userXP.findUnique({ where: { sessionId } });
    return { awarded: 0, total: userXP?.total ?? 0, is_new: false };
  }

  // Upsert UserXP + create history entry in a transaction
  const result = await db.$transaction(async (tx) => {
    const userXP = await tx.userXP.upsert({
      where: { sessionId },
      update: {
        total: { increment: points },
        lessonsCompleted: {
          increment: action === "lesson_complete" ? 1 : 0,
        },
        quizzesPassed: {
          increment: action === "quiz_pass" || action === "quiz_perfect" ? 1 : 0,
        },
        badgesEarned: {
          increment: action === "badge_earn" ? 1 : 0,
        },
      },
      create: {
        sessionId,
        total: points,
        lessonsCompleted: action === "lesson_complete" ? 1 : 0,
        quizzesPassed:
          action === "quiz_pass" || action === "quiz_perfect" ? 1 : 0,
        badgesEarned: action === "badge_earn" ? 1 : 0,
      },
    });

    await tx.xPHistory.create({
      data: {
        userXPId: userXP.id,
        action,
        points,
        refId: refId ?? null,
      },
    });

    // Update daily activity
    const today = new Date().toISOString().slice(0, 10);
    await tx.dailyActivity.upsert({
      where: {
        sessionId_date: { sessionId, date: today },
      },
      update: { count: { increment: 1 } },
      create: { sessionId, date: today, count: 1 },
    });

    return userXP;
  });

  return { awarded: points, total: result.total, is_new: true };
}

/**
 * Level calculation — quadratic curve.
 * Level N requires: totalXP >= 100 * N * (N-1) / 2 + 50 * (N-1)
 * Simplified: each level needs more XP than the previous.
 *
 * Returns: { level, currentLevelXP, nextLevelXP, progress (0-100) }
 */
export function getLevel(totalXP: number): {
  level: number;
  levelTitle: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
} {
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, ...
  // Formula: cumulative XP needed to reach level N = 50 * N * (N - 1)
  // Level 1 = 0, Level 2 = 100, Level 3 = 300, Level 4 = 600, Level 5 = 1000
  let level = 1;
  while (50 * level * (level + 1) <= totalXP) {
    level++;
  }

  const levelStartXP = 50 * (level - 1) * level; // XP at start of current level
  const nextLevelStartXP = 50 * level * (level + 1); // XP at start of next level
  const xpIntoLevel = totalXP - levelStartXP;
  const xpForNextLevel = nextLevelStartXP - levelStartXP;
  const progress = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return {
    level,
    levelTitle: getLevelTitle(level),
    currentLevelXP: levelStartXP,
    nextLevelXP: nextLevelStartXP,
    progress,
    xpIntoLevel,
    xpForNextLevel,
  };
}

const LEVEL_TITLES: { [key: number]: string } = {
  1: "مبتدئ",
  2: "متعلّم",
  3: "متمرّس",
  4: "محرّر",
  5: "محترف",
  6: "خبير",
  7: "معلّم",
  8: "أسطورة",
  9: "إله البرمجة",
  10: "ما وراء الأسطورة",
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] || `مستوى ${level}`;
}

/**
 * Get the user's XP data + recent history + daily activity (for heatmap).
 */
export async function getUserXPData(sessionId: string): Promise<{
  total: number;
  level: number;
  levelTitle: string;
  progress: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  badgesEarned: number;
  history: { action: string; points: number; refId: string | null; earnedAt: Date }[];
  dailyActivity: { date: string; count: number }[];
}> {
  const [userXP, history, dailyActivity] = await Promise.all([
    db.userXP.findUnique({ where: { sessionId } }),
    db.xPHistory.findMany({
      where: { userXP: { sessionId } },
      orderBy: { earnedAt: "desc" },
      take: 20,
    }),
    db.dailyActivity.findMany({
      where: { sessionId },
      orderBy: { date: "asc" },
    }),
  ]);

  const total = userXP?.total ?? 0;
  const levelInfo = getLevel(total);

  return {
    total,
    level: levelInfo.level,
    levelTitle: levelInfo.levelTitle,
    progress: levelInfo.progress,
    xpIntoLevel: levelInfo.xpIntoLevel,
    xpForNextLevel: levelInfo.xpForNextLevel,
    lessonsCompleted: userXP?.lessonsCompleted ?? 0,
    quizzesPassed: userXP?.quizzesPassed ?? 0,
    badgesEarned: userXP?.badgesEarned ?? 0,
    history: history.map((h) => ({
      action: h.action,
      points: h.points,
      refId: h.refId,
      earnedAt: h.earnedAt,
    })),
    dailyActivity: dailyActivity.map((d) => ({ date: d.date, count: d.count })),
  };
}
