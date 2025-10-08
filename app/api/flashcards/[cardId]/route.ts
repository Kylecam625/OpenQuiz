import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { updateFlashcardSchema } from "@/lib/utils/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const user = await requireAuth();
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.cardId,
        userId: user.id,
      },
      include: {
        deck: true,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(flashcard);
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = updateFlashcardSchema.parse(body);

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.cardId,
        userId: user.id,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    // If deckId is being changed, verify new deck belongs to user
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

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: params.cardId },
      data: validatedData,
    });

    return NextResponse.json(updatedFlashcard);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const user = await requireAuth();

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.cardId,
        userId: user.id,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    await prisma.flashcard.delete({
      where: { id: params.cardId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

