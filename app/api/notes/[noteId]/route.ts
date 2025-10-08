import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET a specific note
export async function GET(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const user = await requireAuth();

    const note = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        userId: user.id,
      },
      include: {
        children: true,
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PATCH update a note
export async function PATCH(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { title, content, folder, tags, parentId } = body;

    // Verify note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        userId: user.id,
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    const note = await prisma.note.update({
      where: { id: params.noteId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(folder !== undefined && { folder }),
        ...(tags !== undefined && { tags }),
        ...(parentId !== undefined && { parentId }),
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const user = await requireAuth();

    const note = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        userId: user.id,
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    await prisma.note.delete({
      where: { id: params.noteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

