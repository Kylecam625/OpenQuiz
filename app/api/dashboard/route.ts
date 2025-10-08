import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Basic stats
    const [totalDecks, totalCards, cardsDueToday, reviews] = await Promise.all([
      prisma.deck.count({ where: { userId: user.id } }),
      prisma.flashcard.count({ where: { userId: user.id } }),
      prisma.flashcard.count({
        where: {
          userId: user.id,
          nextReview: { lte: new Date() },
        },
      }),
      prisma.review.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 100, // Last 100 reviews for stats
        include: {
          flashcard: {
            select: {
              id: true,
              front: true,
            },
          },
          session: {
            select: {
              id: true,
              studyMode: true,
            },
          },
        },
      }),
    ]);

    // Calculate study streak
    const studyStreak = calculateStudyStreak(reviews);

    // Get recent activity (last 10 study sessions)
    const recentSessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
      include: {
        deck: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Performance data for charts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReviews = reviews.filter(
      (r) => new Date(r.createdAt) >= sevenDaysAgo
    );

    const dailyPerformance = calculateDailyPerformance(recentReviews);

    // Calculate mastery stats
    const masteredCards = await prisma.flashcard.count({
      where: {
        userId: user.id,
        repetitions: { gte: 3 },
        easeFactor: { gte: 2.5 },
      },
    });

    return NextResponse.json({
      stats: {
        totalDecks,
        totalCards,
        cardsDueToday,
        masteredCards,
        studyStreak,
      },
      recentActivity: recentSessions.map((session) => ({
        id: session.id,
        deckName: session.deck?.name || "Unknown Deck",
        deckId: session.deck?.id,
        cardsStudied: session.cardsStudied,
        duration: session.duration,
        studyMode: session.studyMode,
        completedAt: session.completedAt,
      })),
      dailyPerformance,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

function calculateStudyStreak(reviews: any[]): number {
  if (reviews.length === 0) return 0;

  // Group reviews by date
  const reviewsByDate = new Map<string, number>();
  
  reviews.forEach((review) => {
    const date = new Date(review.createdAt).toDateString();
    reviewsByDate.set(date, (reviewsByDate.get(date) || 0) + 1);
  });

  // Calculate streak from today backwards
  let streak = 0;
  let currentDate = new Date();
  
  while (true) {
    const dateStr = currentDate.toDateString();
    if (reviewsByDate.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Allow one day gap for today if no reviews yet
      if (streak === 0 && currentDate.toDateString() === new Date().toDateString()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
    
    // Prevent infinite loop
    if (streak > 365) break;
  }

  return streak;
}

function calculateDailyPerformance(reviews: any[]): Array<{
  date: string;
  reviews: number;
  correct: number;
  accuracy: number;
}> {
  const dailyData = new Map<string, { total: number; correct: number }>();

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dailyData.set(dateStr, { total: 0, correct: 0 });
  }

  // Count reviews
  reviews.forEach((review) => {
    const dateStr = new Date(review.createdAt).toISOString().split("T")[0];
    const data = dailyData.get(dateStr);
    if (data) {
      data.total++;
      if (review.rating >= 3) {
        // Rating 3 (Good) or 4 (Easy) counts as correct
        data.correct++;
      }
    }
  });

  // Convert to array
  return Array.from(dailyData.entries()).map(([date, data]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    reviews: data.total,
    correct: data.correct,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));
}

