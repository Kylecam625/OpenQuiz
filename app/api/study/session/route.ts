import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { deckId, studyMode } = body;

    // Verify deck belongs to user
    if (deckId) {
      const deck = await prisma.deck.findFirst({
        where: {
          id: deckId,
          userId: user.id,
        },
      });

      if (!deck) {
        return NextResponse.json({ error: "Deck not found" }, { status: 404 });
      }
    }

    // Create study session
    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        deckId: deckId || null,
        studyMode: studyMode || "flip",
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json(
      { error: "Failed to create study session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { sessionId, cardsStudied, duration } = body;

    // Verify session belongs to user
    const session = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update session
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        cardsStudied,
        duration,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating study session:", error);
    return NextResponse.json(
      { error: "Failed to update study session" },
      { status: 500 }
    );
  }
}

