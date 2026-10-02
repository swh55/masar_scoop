import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/xp";

// Mock leaderboard users — these are static "ghost" learners to make the
// leaderboard feel alive. The real user is always inserted in the correct
// position based on their XP.
const MOCK_LEARNERS = [
  { name: "أحمد المبرمج", xp: 1850, avatar: "👨‍💻" },
  { name: "سارة المطوّرة", xp: 1620, avatar: "👩‍💻" },
  { name: "محمد البطل", xp: 1340, avatar: "🧑‍💻" },
  { name: "ليلى الخبيرة", xp: 1180, avatar: "👩‍🔬" },
  { name: "خالد المحترف", xp: 940, avatar: "🧑‍🎓" },
  { name: "نور الهاكِرة", xp: 780, avatar: "👩‍🎓" },
  { name: "عمر المتعلّم", xp: 620, avatar: "👨‍🎓" },
  { name: "ريم المبتدئة", xp: 410, avatar: "👩‍🏫" },
  { name: "يوسف الطموح", xp: 290, avatar: "🧑‍🏫" },
  { name: "هند الجديدة", xp: 120, avatar: "👩‍💼" },
];

type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  avatar: string;
  isCurrentUser: boolean;
  isRealUser: boolean;
};

/**
 * GET /api/leaderboard?sessionId=...
 *
 * Returns a leaderboard with mock learners + the current user inserted
 * in their correct position.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  // Get current user's XP
  let userXP = 0;
  let userLessonsCompleted = 0;
  let userBadges = 0;
  if (sessionId && sessionId !== "ssr") {
    const xp = await db.userXP.findUnique({ where: { sessionId } });
    userXP = xp?.total ?? 0;
    userLessonsCompleted = xp?.lessonsCompleted ?? 0;
    userBadges = xp?.badgesEarned ?? 0;
  }

  // Build the leaderboard with mock learners
  const allEntries: {
    name: string;
    xp: number;
    avatar: string;
    isCurrentUser: boolean;
  }[] = MOCK_LEARNERS.map((m) => ({
    name: m.name,
    xp: m.xp,
    avatar: m.avatar,
    isCurrentUser: false,
  }));

  // Add the real user
  allEntries.push({
    name: "أنت",
    xp: userXP,
    avatar: "⭐",
    isCurrentUser: true,
  });

  // Sort by XP desc
  allEntries.sort((a, b) => b.xp - a.xp);

  // Assign ranks + level info
  const leaderboard: LeaderboardEntry[] = allEntries.map((entry, i) => {
    const levelInfo = getLevel(entry.xp);
    return {
      rank: i + 1,
      name: entry.name,
      xp: entry.xp,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      avatar: entry.avatar,
      isCurrentUser: entry.isCurrentUser,
      isRealUser: entry.isCurrentUser,
    };
  });

  // Find the current user's rank
  const currentUserEntry = leaderboard.find((e) => e.isCurrentUser);
  const userRank = currentUserEntry?.rank ?? leaderboard.length;

  // Stats: total learners
  const totalLearners = leaderboard.length;

  // Calculate percentile (top X%)
  const percentile = Math.round(
    ((totalLearners - userRank) / totalLearners) * 100
  );

  return NextResponse.json({
    leaderboard,
    currentUser: currentUserEntry ?? null,
    userRank,
    totalLearners,
    percentile,
    userStats: {
      xp: userXP,
      lessonsCompleted: userLessonsCompleted,
      badges: userBadges,
    },
  });
}
