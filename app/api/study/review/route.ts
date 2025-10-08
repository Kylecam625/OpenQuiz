import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { reviewSchema } from "@/lib/utils/validators";
import { calculateNextReview } from "@/lib/spaced-repetition/algorithm";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validatedData = reviewSchema.parse(body);

    // Verify flashcard belongs to user
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: validatedData.flashcardId,
        userId: user.id,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    // Calculate next review using spaced repetition algorithm
    const nextReviewData = calculateNextReview(
      validatedData.rating as 1 | 2 | 3 | 4,
      {
        easeFactor: flashcard.easeFactor,
        interval: flashcard.interval,
        repetitions: flashcard.repetitions,
      }
    );

    // Update flashcard with new spaced repetition data
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: validatedData.flashcardId },
      data: {
        easeFactor: nextReviewData.easeFactor,
        interval: nextReviewData.interval,
        repetitions: nextReviewData.repetitions,
        nextReview: nextReviewData.nextReview,
      },
    });

    // Create review record
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        flashcardId: validatedData.flashcardId,
        sessionId: validatedData.sessionId,
        rating: validatedData.rating,
        timeSpent: validatedData.timeSpent,
      },
    });

    return NextResponse.json({
      review,
      flashcard: updatedFlashcard,
      nextReview: nextReviewData,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

