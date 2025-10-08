import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { generateExplanation } from "@/lib/ai/explanation-generator";

export async function POST(
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

    // Check if explanation already exists (cached)
    if (flashcard.explanation) {
      return NextResponse.json({ explanation: flashcard.explanation });
    }

    // Generate new explanation with AI
    const explanation = await generateExplanation(
      flashcard.front,
      flashcard.back
    );

    // Cache the explanation
    await prisma.flashcard.update({
      where: { id: params.cardId },
      data: { explanation },
    });

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

