import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { createDeckSchema } from "@/lib/utils/validators";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const includeCards = searchParams.get("includeCards") === "true";

    const decks = await prisma.deck.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { flashcards: true },
        },
        ...(includeCards && {
          flashcards: {
            select: {
              id: true,
              nextReview: true,
            },
          },
        }),
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(decks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = createDeckSchema.parse(body);

    const deck = await prisma.deck.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    console.error("Error creating deck:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

