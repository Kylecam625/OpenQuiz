import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";

async function getDecks(userId: string) {
  return await prisma.deck.findMany({
    where: { userId },
    include: {
      _count: {
        select: { flashcards: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export default async function DecksPage() {
  const user = await requireAuth();
  const decks = await getDecks(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decks</h1>
          <p className="text-muted-foreground">
            Organize your flashcards into decks
          </p>
        </div>
        <Button asChild>
          <Link href="/decks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Deck
          </Link>
        </Button>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first deck to start organizing flashcards
            </p>
            <Button asChild>
              <Link href="/decks/new">Create Deck</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/decks/${deck.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{deck.name}</CardTitle>
                    {deck.color && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: deck.color }}
                      />
                    )}
                  </div>
                  {deck.description && (
                    <CardDescription>{deck.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{deck._count.flashcards} cards</span>
                  </div>
                  {deck.tags && deck.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {deck.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-secondary rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

