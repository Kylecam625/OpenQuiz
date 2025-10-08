"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ExplanationPanel } from "./ExplanationPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, Pencil, Trash2 } from "lucide-react";

interface FlashcardWithExplanationProps {
  card: {
    id: string;
    front: string;
    back: string;
    explanation: string | null;
    repetitions: number;
    easeFactor: number;
    nextReview: Date;
  };
}

export function FlashcardWithExplanation({ card }: FlashcardWithExplanationProps) {
  const router = useRouter();

  const [showExplanation, setShowExplanation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
  }, [card.front, card.back]);

  const nextReviewDisplay = useMemo(() => {
    try {
      return new Date(card.nextReview).toLocaleDateString();
    } catch {
      return "—";
    }
  }, [card.nextReview]);

  const handleToggleEdit = () => {
    setError("");
    if (isEditing) {
      setFront(card.front);
      setBack(card.back);
    }
    setIsEditing((prev) => !prev);
    setShowExplanation(false);
  };

  const handleSaveChanges = async () => {
    const trimmedFront = front.trim();
    const trimmedBack = back.trim();

    if (!trimmedFront || !trimmedBack) {
      setError("Both the front and back of the card are required.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`/api/flashcards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: trimmedFront, back: trimmedBack }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update flashcard");
      }

      setFront(trimmedFront);
      setBack(trimmedBack);
      setIsEditing(false);
      setShowExplanation(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update flashcard");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;

    const confirmed = confirm("Delete this flashcard? This action cannot be undone.");
    if (!confirmed) return;

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`/api/flashcards/${card.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete flashcard");
      }

      setIsRemoved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete flashcard");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isRemoved) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="pt-6 space-y-4">
          {/* Flashcard content */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`front-${card.id}`}>Front</Label>
                  <Textarea
                    id={`front-${card.id}`}
                    rows={4}
                    value={front}
                    onChange={(event) => setFront(event.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`back-${card.id}`}>Back</Label>
                  <Textarea
                    id={`back-${card.id}`}
                    rows={4}
                    value={back}
                    onChange={(event) => setBack(event.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    Front
                  </div>
                  <div className="text-base whitespace-pre-wrap">{front}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    Back
                  </div>
                  <div className="text-base whitespace-pre-wrap">{back}</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>Reviews: {card.repetitions}</span>
              <span>Ease: {card.easeFactor.toFixed(2)}</span>
              <span>Next: {nextReviewDisplay}</span>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleEdit}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveChanges}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>

              <Button
                variant={showExplanation ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowExplanation((prev) => !prev)}
                className="gap-2"
                disabled={isProcessing || isEditing}
              >
                <Lightbulb className="h-4 w-4" />
                {showExplanation ? "Hide" : "Explain"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showExplanation && (
        <ExplanationPanel
          cardId={card.id}
          front={front}
          back={back}
          initialExplanation={card.explanation}
        />
      )}
    </div>
  );
}
