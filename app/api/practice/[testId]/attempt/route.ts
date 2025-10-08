import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET - Fetch a specific attempt with answers
export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        test: {
          userId: user.id,
        },
      },
      include: {
        test: {
          select: {
            title: true,
            description: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Error fetching attempt:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempt" },
      { status: 500 }
    );
  }
}

// POST - Start a new test attempt
export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const user = await requireAuth();

    // Verify the test exists and belongs to the user
    const test = await prisma.practiceTest.findFirst({
      where: {
        id: params.testId,
        userId: user.id,
      },
      include: {
        questions: true,
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Practice test not found" },
        { status: 404 }
      );
    }

    // Create a new attempt (without answers yet)
    const attempt = await prisma.testAttempt.create({
      data: {
        testId: params.testId,
        totalQuestions: test.questions.length,
        correctAnswers: 0,
        score: 0,
        duration: 0,
        startedAt: new Date(),
        completedAt: new Date(), // Will be updated when actually completed
      },
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Error starting test attempt:", error);
    return NextResponse.json(
      { error: "Failed to start test attempt" },
      { status: 500 }
    );
  }
}

// PATCH - Submit test attempt with answers
export async function PATCH(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { attemptId, answers, duration } = body;

    // Verify the attempt exists and belongs to the user's test
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        test: {
          userId: user.id,
        },
      },
      include: {
        test: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Test attempt not found" },
        { status: 404 }
      );
    }

    // Grade the answers
    const questionsMap = new Map(
      attempt.test.questions.map((q) => [q.id, q])
    );

    let correctCount = 0;
    const gradedAnswers = answers.map((answer: any) => {
      const question = questionsMap.get(answer.questionId);
      if (!question) {
        return { ...answer, isCorrect: false };
      }

      let isCorrect = false;
      const userAnswerLower = answer.userAnswer.toLowerCase().trim();
      const correctAnswerLower = question.correctAnswer.toLowerCase().trim();

      if (question.questionType === "multiple-choice" || question.questionType === "true-false") {
        // Exact match for MC and T/F
        isCorrect = userAnswerLower === correctAnswerLower;
      } else if (question.questionType === "short-answer") {
        // More lenient matching for short answers
        isCorrect = userAnswerLower.includes(correctAnswerLower) || 
                    correctAnswerLower.includes(userAnswerLower) ||
                    userAnswerLower === correctAnswerLower;
      }

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
      };
    });

    const score = (correctCount / attempt.test.questions.length) * 100;

    // Update attempt with results
    const updatedAttempt = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        correctAnswers: correctCount,
        score,
        duration,
        completedAt: new Date(),
        answers: {
          create: gradedAnswers.map((answer) => ({
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
          })),
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAttempt);
  } catch (error) {
    console.error("Error submitting test attempt:", error);
    return NextResponse.json(
      { error: "Failed to submit test attempt" },
      { status: 500 }
    );
  }
}

