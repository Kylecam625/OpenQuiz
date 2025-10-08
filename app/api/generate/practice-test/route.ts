import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { generatePracticeTest } from "@/lib/ai/test-generator";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    const { 
      deckIds, 
      title, 
      description, 
      questionCount = 10,
      questionTypes 
    } = body;

    // Validate inputs
    if (!deckIds || !Array.isArray(deckIds) || deckIds.length === 0) {
      return NextResponse.json(
        { error: "At least one deck ID is required" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Fetch flashcards from the selected decks
    const flashcards = await prisma.flashcard.findMany({
      where: {
        deckId: { in: deckIds },
        userId: user.id,
      },
    });

    if (flashcards.length === 0) {
      return NextResponse.json(
        { error: "No flashcards found in the selected decks" },
        { status: 400 }
      );
    }

    // Limit question count to available flashcards
    const actualQuestionCount = Math.min(questionCount, flashcards.length * 2);

    // Generate test questions with AI
    const generatedQuestions = await generatePracticeTest(
      flashcards,
      actualQuestionCount,
      questionTypes
    );

    // Create the practice test in the database
    const practiceTest = await prisma.practiceTest.create({
      data: {
        userId: user.id,
        title,
        description,
        deckIds,
        questions: {
          create: generatedQuestions.map((q, index) => ({
            question: q.question,
            questionType: q.questionType,
            correctAnswer: q.correctAnswer,
            options: q.options || [],
            explanation: q.explanation,
            order: index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(practiceTest);
  } catch (error) {
    console.error("Error generating practice test:", error);
    return NextResponse.json(
      { error: "Failed to generate practice test" },
      { status: 500 }
    );
  }
}

