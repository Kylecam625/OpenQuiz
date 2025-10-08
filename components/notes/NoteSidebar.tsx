"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Folder, ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  folder: string | null;
  parentId: string | null;
  children?: Note[];
}

interface NoteSidebarProps {
  notes: Note[];
  currentNoteId?: string;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: (folder?: string) => void;
}

export function NoteSidebar({
  notes,
  currentNoteId,
  onSelectNote,
  onDeleteNote,
  onCreateNote,
}: NoteSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Group notes by folder
  const folders = new Map<string, Note[]>();
  const rootNotes: Note[] = [];

  notes.forEach((note) => {
    if (note.folder) {
      if (!folders.has(note.folder)) {
        folders.set(note.folder, []);
      }
      folders.get(note.folder)!.push(note);
    } else {
      rootNotes.push(note);
    }
  });

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNote = (note: Note) => (
    <div
      key={note.id}
      className={cn(
        "group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
        currentNoteId === note.id
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent"
      )}
      onClick={() => onSelectNote(note.id)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm truncate">{note.title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
          currentNoteId === note.id && "text-primary-foreground hover:text-primary-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onDeleteNote(note.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <div className="py-2">
      {/* Root notes (no folder) */}
      {rootNotes.length > 0 && (
        <div className="px-2 space-y-1">
          {rootNotes.map(renderNote)}
        </div>
      )}

      {/* Folders */}
      {Array.from(folders.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([folder, folderNotes]) => {
          const isExpanded = expandedFolders.has(folder);

          return (
            <div key={folder} className="mb-2">
              <div className="px-2">
                <div
                  className="group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => toggleFolder(folder)}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">{folder}</span>
                    <span className="text-xs text-muted-foreground">
                      ({folderNotes.length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateNote(folder);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {folderNotes
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map(renderNote)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No notes yet. Create your first note!
        </div>
      )}
    </div>
  );
}

