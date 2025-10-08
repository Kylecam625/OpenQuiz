"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, Calendar, TrendingUp, Play, Loader2 } from "lucide-react";

interface Deck {
  id: string;
  name: string;
  color: string | null;
  _count: {
    flashcards: number;
  };
  flashcards?: Array<{
    id: string;
    nextReview: string;
  }>;
}

interface DueCard {
  id: string;
  front: string;
  back: string;
  nextReview: string;
  deckId: string;
  deck: {
    id: string;
    name: string;
    color: string | null;
  };
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all decks with their flashcards (need nextReview to determine due cards)
      const decksResponse = await fetch("/api/decks?includeCards=true");
      const decksData: Deck[] = await decksResponse.json();
      setDecks(decksData);

      // Calculate total due cards
      const now = new Date();
      let dueCount = 0;
      
      decksData.forEach((deck) => {
        if (deck.flashcards) {
          const deckDueCards = deck.flashcards.filter(
            (card) => new Date(card.nextReview) <= now
          );
          dueCount += deckDueCards.length;
        }
      });
      
      setTotalDue(dueCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeckDueCount = (deck: Deck): number => {
    if (!deck.flashcards) return 0;
    const now = new Date();
    return deck.flashcards.filter(
      (card) => new Date(card.nextReview) <= now
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const decksWithDueCards = decks.filter((deck) => getDeckDueCount(deck) > 0);
  const totalCards = decks.reduce((sum, deck) => sum + (deck.flashcards?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Flashcards</h1>
        <p className="text-muted-foreground">
          Review your flashcards using spaced repetition
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalDue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decks with Due Cards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decksWithDueCards.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Due Cards by Deck */}
      {totalDue === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              You have no cards due for review right now. Come back later or browse your decks to add more cards.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/decks">Browse Decks</Link>
              </Button>
              <Button asChild>
                <Link href="/generate">Generate New Cards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Decks with Due Cards</CardTitle>
            <CardDescription>
              Select a deck to start studying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decksWithDueCards.map((deck) => {
                const dueCount = getDeckDueCount(deck);
                return (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {deck.color && (
                        <div
                          className="w-10 h-10 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: deck.color }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{deck.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dueCount} {dueCount === 1 ? "card" : "cards"} due • {deck.flashcards?.length || 0} total
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/decks/${deck.id}/study`}>
                        <Play className="mr-2 h-4 w-4" />
                        Study Now
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Decks */}
      {decks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Decks</CardTitle>
                <CardDescription>
                  Browse all your flashcard decks
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/decks">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {decks.slice(0, 6).map((deck) => {
                const dueCount = getDeckDueCount(deck);
                return (
                  <Link
                    key={deck.id}
                    href={`/decks/${deck.id}`}
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {deck.color && (
                        <div
                          className="w-8 h-8 rounded flex-shrink-0"
                          style={{ backgroundColor: deck.color }}
                        />
                      )}
                      <h3 className="font-semibold truncate flex-1">{deck.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {deck.flashcards?.length || 0} cards
                      {dueCount > 0 && (
                        <span className="text-primary font-medium ml-1">
                          • {dueCount} due
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {decks.length > 6 && (
              <div className="mt-4 text-center">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/decks">
                    View all {decks.length} decks →
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {decks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Create your first deck and start adding flashcards to begin studying
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/decks/new">Create Deck</Link>
              </Button>
              <Button asChild>
                <Link href="/generate">Generate with AI</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
