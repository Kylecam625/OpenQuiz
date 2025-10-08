"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "./ActivityTimeline";
import { PerformanceChart } from "./PerformanceChart";
import { BookOpen, Layers, Calendar, TrendingUp, Trophy, Loader2 } from "lucide-react";

interface DashboardData {
  stats: {
    totalDecks: number;
    totalCards: number;
    cardsDueToday: number;
    masteredCards: number;
    studyStreak: number;
  };
  recentActivity: Array<{
    id: string;
    deckName: string;
    deckId: string | null;
    cardsStudied: number;
    duration: number;
    studyMode: string;
    completedAt: string;
  }>;
  dailyPerformance: Array<{
    date: string;
    reviews: number;
    correct: number;
    accuracy: number;
  }>;
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your learning overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalDecks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalCards}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.stats.masteredCards} mastered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.cardsDueToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cards ready to review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{data.stats.studyStreak}</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.stats.studyStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <PerformanceChart data={data.dailyPerformance} type="bar" />

      {/* Quick Actions and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your study session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/generate"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-semibold">✨ Generate Flashcards</div>
              <div className="text-sm text-muted-foreground">
                Upload a document and create cards with AI
              </div>
            </Link>
            <Link
              href="/practice/new"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-semibold">📝 Create Practice Test</div>
              <div className="text-sm text-muted-foreground">
                Generate an AI-powered test from your decks
              </div>
            </Link>
            <Link
              href="/decks"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-semibold">📚 Browse Decks</div>
              <div className="text-sm text-muted-foreground">
                View and manage your flashcard decks
              </div>
            </Link>
            {data.stats.cardsDueToday > 0 && (
              <Link
                href="/flashcards"
                className="block p-4 rounded-lg border border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="font-semibold text-primary">
                  🎯 Study Due Cards
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.stats.cardsDueToday} cards waiting for review
                </div>
              </Link>
            )}
          </CardContent>
        </Card>

        <ActivityTimeline activities={data.recentActivity} />
      </div>

      {/* Mastery Progress */}
      {data.stats.totalCards > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Mastery Progress
            </CardTitle>
            <CardDescription>
              Track your progress towards mastering all cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {data.stats.masteredCards} / {data.stats.totalCards} cards mastered
                </span>
                <span className="text-muted-foreground">
                  {Math.round((data.stats.masteredCards / data.stats.totalCards) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-yellow-500 rounded-full h-3 transition-all"
                  style={{
                    width: `${(data.stats.masteredCards / data.stats.totalCards) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Cards with 3+ reviews and ease factor ≥ 2.5 are considered mastered
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

