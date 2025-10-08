"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlashcardDisplay } from "@/components/flashcards/FlashcardDisplay";
import { ReviewButtons } from "@/components/study/ReviewButtons";
import { StudyProgress } from "@/components/study/StudyProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
}

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [studyComplete, setStudyComplete] = useState(false);

  useEffect(() => {
    loadStudySession();
  }, []);

  const loadStudySession = async () => {
    try {
      // Fetch due cards for this deck
      const cardsResponse = await fetch(`/api/flashcards?deckId=${deckId}`);
      const allCards = await cardsResponse.json();

      // Filter for due cards
      const dueCards = allCards.filter(
        (card: Flashcard) => new Date(card.nextReview) <= new Date()
      );

      if (dueCards.length === 0) {
        setStudyComplete(true);
        setLoading(false);
        return;
      }

      setCards(dueCards);

      // Create study session
      const sessionResponse = await fetch("/api/study/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId, studyMode: "flip" }),
      });

      const session = await sessionResponse.json();
      setSessionId(session.id);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error loading study session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: 1 | 2 | 3 | 4) => {
    if (!sessionId) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      await fetch("/api/study/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flashcardId: cards[currentIndex].id,
          sessionId,
          rating,
          timeSpent,
        }),
      });

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setStartTime(Date.now());
      } else {
        // Session complete
        await fetch("/api/study/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            cardsStudied: cards.length,
            duration: Math.floor((Date.now() - startTime) / 1000),
          }),
        });

        setStudyComplete(true);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading study session...</p>
      </div>
    );
  }

  if (studyComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href={`/decks/${deckId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to deck
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Study Session Complete!</h2>
            <p className="text-muted-foreground mb-6">
              {cards.length > 0
                ? `You reviewed ${cards.length} cards`
                : "No cards due for review"}
            </p>
            <Button asChild>
              <Link href={`/decks/${deckId}`}>Back to Deck</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href={`/decks/${deckId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to deck
      </Link>

      <StudyProgress current={currentIndex + 1} total={cards.length} />

      <FlashcardDisplay
        front={currentCard.front}
        back={currentCard.back}
        cardId={currentCard.id}
        showExplanation={isFlipped}
        onFlip={(showing) => setIsFlipped(showing)}
      />

      {isFlipped && (
        <ReviewButtons onRate={handleRate} />
      )}

      {!isFlipped && (
        <div className="text-center text-sm text-muted-foreground">
          Click the card to reveal the answer, then rate your recall
        </div>
      )}
    </div>
  );
}

