import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLevel } from "@/lib/xp";

// Mock leaderboard users — these are static "ghost" learners to make the
// leaderboard feel alive even with few real users. Real DB users are merged
// in, and the current requesting user is always included.
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
 * Returns a leaderboard combining:
 *  - Real DB-backed learners (from UserXP table, anonymized)
 *  - Mock "ghost" learners to fill out the board
 *  - The current requesting user, always included
 * The current user is always visible, ranked by their XP.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  // Fetch ALL real users from DB (anonymized)
  const realUsers = await db.userXP.findMany({
    select: { sessionId: true, total: true, lessonsCompleted: true, badgesEarned: true },
    orderBy: { total: "desc" },
  });

  // Get current user's data
  let userXP = 0;
  let userLessonsCompleted = 0;
  let userBadges = 0;
  if (sessionId && sessionId !== "ssr") {
    const xp = await db.userXP.findUnique({ where: { sessionId } });
    userXP = xp?.total ?? 0;
    userLessonsCompleted = xp?.lessonsCompleted ?? 0;
    userBadges = xp?.badgesEarned ?? 0;
  }

  // Build entries: real DB users (excluding current), mock users, then current user
  const allEntries: {
    name: string;
    xp: number;
    avatar: string;
    isCurrentUser: boolean;
    isRealDbUser: boolean;
  }[] = [];

  // Add real DB users (anonymized, excluding the current session)
  const avatarPool = ["🧑‍💻", "👨‍🎓", "👩‍🔬", "🧑‍🏫", "👨‍💼", "👩‍💻", "🧑‍🔬", "👩‍🎓"];
  realUsers
    .filter((u) => u.sessionId !== sessionId)
    .forEach((u, i) => {
      // Generate a friendly name from the sessionId hash
      const hash = u.sessionId
        .split("")
        .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
      const num = (hash % 900) + 100;
      allEntries.push({
        name: `متعلّم #${num}`,
        xp: u.total,
        avatar: avatarPool[i % avatarPool.length]!,
        isCurrentUser: false,
        isRealDbUser: true,
      });
    });

  // Add mock learners
  MOCK_LEARNERS.forEach((m) => {
    allEntries.push({
      name: m.name,
      xp: m.xp,
      avatar: m.avatar,
      isCurrentUser: false,
      isRealDbUser: false,
    });
  });

  // Add the current user (always, even if no XP yet)
  allEntries.push({
    name: "أنت",
    xp: userXP,
    avatar: "⭐",
    isCurrentUser: true,
    isRealDbUser: false,
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
  const realDbLearners = realUsers.length;

  // Calculate percentile (top X%)
  const percentile = Math.round(
    ((totalLearners - userRank) / totalLearners) * 100
  );

  return NextResponse.json({
    leaderboard,
    currentUser: currentUserEntry ?? null,
    userRank,
    totalLearners,
    realDbLearners,
    percentile,
    userStats: {
      xp: userXP,
      lessonsCompleted: userLessonsCompleted,
      badges: userBadges,
    },
  });
}
