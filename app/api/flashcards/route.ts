import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { createFlashcardSchema } from "@/lib/utils/validators";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get("deckId");

    const where: any = { userId: user.id };
    if (deckId) {
      where.deckId = deckId;
    }

    const flashcards = await prisma.flashcard.findMany({
      where,
      include: {
        deck: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = createFlashcardSchema.parse(body);

    // Verify deck belongs to user
    const deck = await prisma.deck.findFirst({
      where: {
        id: validatedData.deckId,
        userId: user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error("Error creating flashcard:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

