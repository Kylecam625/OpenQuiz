import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET all practice tests for the user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const tests = await prisma.practiceTest.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
        attempts: {
          orderBy: { startedAt: "desc" },
          take: 1, // Get most recent attempt
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching practice tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice tests" },
      { status: 500 }
    );
  }
}

