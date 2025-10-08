import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { generateFlashcardsSchema } from "@/lib/utils/validators";
import { generateFlashcards } from "@/lib/ai/flashcard-generator";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = generateFlashcardsSchema.parse(body);

    // Verify deck belongs to user if deckId provided
    if (validatedData.deckId) {
      const deck = await prisma.deck.findFirst({
        where: {
          id: validatedData.deckId,
          userId: user.id,
        },
      });

      if (!deck) {
        return NextResponse.json({ error: "Deck not found" }, { status: 404 });
      }
    }

    // Generate flashcards with AI
    const generatedCards = await generateFlashcards(
      validatedData.documentText,
      {
        cardCount: validatedData.cardCount,
        allowExternal: validatedData.allowExternal ?? false,
        notes: validatedData.notes,
      }
    );

    // Determine the deck to use
    let targetDeckId = validatedData.deckId;
    
    // If no deckId provided, create a new deck
    if (!targetDeckId) {
      const now = new Date();
      const deckName = `Generated Deck - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      
      const newDeck = await prisma.deck.create({
        data: {
          name: deckName,
          description: "AI-generated flashcards",
          userId: user.id,
        },
      });
      
      targetDeckId = newDeck.id;
    }

    // Save flashcards to the deck
    const createdCards = await Promise.all(
      generatedCards.map((card) =>
        prisma.flashcard.create({
          data: {
            front: card.front,
            back: card.back,
            userId: user.id,
            deckId: targetDeckId!,
          },
        })
      )
    );

    return NextResponse.json({
      flashcards: createdCards,
      deckId: targetDeckId,
      message: `Successfully generated ${createdCards.length} flashcards`,
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
