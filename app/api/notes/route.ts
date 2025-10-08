import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET all notes for the user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      include: {
        children: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { folder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST create a new note
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    const { title, content = "", folder, tags = [], parentId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: user.id,
        title,
        content,
        folder,
        tags,
        parentId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

