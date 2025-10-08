import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, BookOpen, Play } from "lucide-react";
import { FlashcardWithExplanation } from "@/components/flashcards/FlashcardWithExplanation";
import { DeckDeleteButton } from "@/components/decks/DeckDeleteButton";

async function getDeck(deckId: string, userId: string) {
  return await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId,
    },
    include: {
      flashcards: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { flashcards: true },
      },
    },
  });
}

export default async function DeckDetailPage({
  params,
}: {
  params: { deckId: string };
}) {
  const user = await requireAuth();
  const deck = await getDeck(params.deckId, user.id);

  if (!deck) {
    notFound();
  }

  const dueCards = deck.flashcards.filter(
    (card) => new Date(card.nextReview) <= new Date()
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/decks"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to decks
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {deck.color && (
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0"
                style={{ backgroundColor: deck.color }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
              {deck.description && (
                <p className="text-muted-foreground mt-1">{deck.description}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-3">
            {dueCards.length > 0 && (
              <Button asChild>
                <Link href={`/decks/${deck.id}/study`}>
                  <Play className="mr-2 h-4 w-4" />
                  Study ({dueCards.length})
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/generate?deckId=${deck.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Cards with AI
              </Link>
            </Button>
            <DeckDeleteButton deckId={deck.id} deckName={deck.name} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deck._count.flashcards}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueCards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deck.flashcards.filter((card) => card.repetitions >= 3).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flashcards</CardTitle>
              <CardDescription>
                All flashcards in this deck
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {deck.flashcards.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add flashcards to this deck using AI generation
              </p>
              <Button asChild>
                <Link href={`/generate?deckId=${deck.id}`}>
                  Generate Flashcards
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {deck.flashcards.map((card) => (
                <FlashcardWithExplanation
                  key={card.id}
                  card={{
                    id: card.id,
                    front: card.front,
                    back: card.back,
                    explanation: card.explanation,
                    repetitions: card.repetitions,
                    easeFactor: card.easeFactor,
                    nextReview: card.nextReview,
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
