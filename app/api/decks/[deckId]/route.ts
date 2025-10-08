import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { updateDeckSchema } from "@/lib/utils/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  try {
    const user = await requireAuth();
    const deck = await prisma.deck.findFirst({
      where: {
        id: params.deckId,
        userId: user.id,
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

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json(deck);
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = updateDeckSchema.parse(body);

    const deck = await prisma.deck.findFirst({
      where: {
        id: params.deckId,
        userId: user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const updatedDeck = await prisma.deck.update({
      where: { id: params.deckId },
      data: validatedData,
    });

    return NextResponse.json(updatedDeck);
  } catch (error) {
    console.error("Error updating deck:", error);
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
  { params }: { params: { deckId: string } }
) {
  try {
    const user = await requireAuth();

    const deck = await prisma.deck.findFirst({
      where: {
        id: params.deckId,
        userId: user.id,
      },
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await prisma.deck.delete({
      where: { id: params.deckId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

