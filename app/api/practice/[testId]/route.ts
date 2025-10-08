import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET a specific practice test
export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const user = await requireAuth();

    const test = await prisma.practiceTest.findFirst({
      where: {
        id: params.testId,
        userId: user.id,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        attempts: {
          orderBy: { startedAt: "desc" },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Practice test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error fetching practice test:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice test" },
      { status: 500 }
    );
  }
}

// DELETE a practice test
export async function DELETE(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const user = await requireAuth();

    const test = await prisma.practiceTest.findFirst({
      where: {
        id: params.testId,
        userId: user.id,
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Practice test not found" },
        { status: 404 }
      );
    }

    await prisma.practiceTest.delete({
      where: { id: params.testId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting practice test:", error);
    return NextResponse.json(
      { error: "Failed to delete practice test" },
      { status: 500 }
    );
  }
}

