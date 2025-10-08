"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeckDeleteButtonProps {
  deckId: string;
  deckName: string;
}

export function DeckDeleteButton({ deckId, deckName }: DeckDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = confirm(
      `Delete the deck "${deckName}"? All flashcards inside it will be removed.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete deck");
      }

      router.push("/decks");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete deck");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete Deck"}
      </Button>
      {error && (
        <p className="text-xs text-destructive text-right">{error}</p>
      )}
    </div>
  );
}
