"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GenerationOptionsProps {
  onGenerate: (options: {
    cardCount?: number;
    allowExternal: boolean;
    notes?: string;
  }) => Promise<void> | void;
  loading?: boolean;
}

export function GenerationOptions({
  onGenerate,
  loading = false,
}: GenerationOptionsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCount, setSelectedCount] = useState("10");
  const [allowExternal, setAllowExternal] = useState(false);
  const [notes, setNotes] = useState("");

  const cardOptions = useMemo(
    () => Array.from({ length: 101 }, (_, index) => index),
    []
  );

  const handleSubmit = async () => {
    const parsedCount = parseInt(selectedCount, 10);
    const cardCount = Number.isNaN(parsedCount) || parsedCount === 0 ? undefined : parsedCount;

    await onGenerate({
      cardCount,
      allowExternal,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    setShowDialog(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </Button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => !loading && setShowDialog(false)}
        >
          <div
            className="w-full max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <Card>
              <CardHeader>
                <CardTitle>Customize Generation</CardTitle>
                <CardDescription>
                  Tell the AI how you want these flashcards crafted
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-count">Number of Cards</Label>
                  <select
                    id="card-count"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedCount}
                    onChange={(event) => setSelectedCount(event.target.value)}
                    disabled={loading}
                  >
                    {cardOptions.map((value) => (
                      <option key={value} value={value}>
                        {value === 0 ? "Let the AI decide" : `${value} cards`}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Choose 0 to let the model determine how many cards you need.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>External Knowledge</Label>
                  <p className="text-xs text-muted-foreground">
                    Control whether the model can bring in outside information.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={allowExternal ? "outline" : "default"}
                      onClick={() => setAllowExternal(false)}
                      disabled={loading}
                      className="flex-1"
                    >
                      Use provided text only
                    </Button>
                    <Button
                      type="button"
                      variant={allowExternal ? "default" : "outline"}
                      onClick={() => setAllowExternal(true)}
                      disabled={loading}
                      className="flex-1"
                    >
                      Allow external help
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generation-notes">Extra Notes</Label>
                  <Textarea
                    id="generation-notes"
                    placeholder="Add any focus areas, formatting tips, or reminders for the AI..."
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. These notes are sent with your request to guide the flashcards.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Start Generation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
