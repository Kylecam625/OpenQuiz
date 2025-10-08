"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteSidebar } from "@/components/notes/NoteSidebar";
import { Plus, FileText, Loader2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string | null;
  tags: string[];
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    } else {
      setCurrentNote(null);
    }
  }, [noteId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      const data = await response.json();
      setCurrentNote(data);
    } catch (error) {
      console.error("Error loading note:", error);
    }
  };

  const createNote = async (folder?: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          folder: folder || null,
        }),
      });

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      router.push(`/notes?id=${newNote.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const updatedNote = await response.json();
      
      // Update in list
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      
      // Update current note if it's the one being edited
      if (currentNote?.id === id) {
        setCurrentNote(updatedNote);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      setNotes(notes.filter((n) => n.id !== id));
      
      if (currentNote?.id === id) {
        router.push("/notes");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <Button onClick={() => createNote()} className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        <NoteSidebar
          notes={notes}
          currentNoteId={currentNote?.id}
          onSelectNote={(id) => router.push(`/notes?id=${id}`)}
          onDeleteNote={deleteNote}
          onCreateNote={createNote}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentNote ? (
          <div className="h-full">
            <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
              <Input
                value={currentNote.title}
                onChange={(e) => {
                  setCurrentNote({ ...currentNote, title: e.target.value });
                }}
                onBlur={() => updateNote(currentNote.id, { title: currentNote.title })}
                className="text-2xl font-bold border-none focus-visible:ring-0 px-0"
                placeholder="Untitled"
              />
              {saving && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              )}
            </div>
            <NoteEditor
              note={currentNote}
              onUpdate={(content) => updateNote(currentNote.id, { content })}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No note selected</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Select a note from the sidebar or create a new one
                </p>
                <Button onClick={() => createNote()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
