"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface Deck {
  id: string;
  name: string;
  _count: {
    flashcards: number;
  };
}

export default function NewPracticeTestPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<string[]>([
    "multiple-choice",
    "short-answer",
    "true-false",
  ]);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await fetch("/api/decks");
      const data = await response.json();
      setDecks(data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeckToggle = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId)
        ? prev.filter((id) => id !== deckId)
        : [...prev, deckId]
    );
  };

  const handleQuestionTypeToggle = (type: string) => {
    setQuestionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDeckIds.length === 0) {
      alert("Please select at least one deck");
      return;
    }

    if (questionTypes.length === 0) {
      alert("Please select at least one question type");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/generate/practice-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          deckIds: selectedDeckIds,
          questionCount,
          questionTypes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const test = await response.json();
      router.push(`/practice/${test.id}`);
    } catch (error) {
      console.error("Error generating test:", error);
      alert("Failed to generate test. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/practice"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to practice tests
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Practice Test</h1>
        <p className="text-muted-foreground mt-1">
          Generate an AI-powered practice test from your flashcards
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
            <CardDescription>
              Give your practice test a title and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Chapter 5 Review Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of what this test covers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Select Decks */}
        <Card>
          <CardHeader>
            <CardTitle>Select Decks</CardTitle>
            <CardDescription>
              Choose which decks to generate questions from
            </CardDescription>
          </CardHeader>
          <CardContent>
            {decks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No decks available. Create some flashcard decks first.
              </p>
            ) : (
              <div className="space-y-2">
                {decks.map((deck) => (
                  <label
                    key={deck.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDeckIds.includes(deck.id)}
                      onChange={() => handleDeckToggle(deck.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{deck.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {deck._count.flashcards} cards
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Options */}
        <Card>
          <CardHeader>
            <CardTitle>Test Options</CardTitle>
            <CardDescription>
              Configure question types and count
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 10-20 questions
              </p>
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={questionTypes.includes("multiple-choice")}
                    onChange={() => handleQuestionTypeToggle("multiple-choice")}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="font-medium">Multiple Choice</div>
                    <div className="text-sm text-muted-foreground">
                      Choose from 4 options
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={questionTypes.includes("short-answer")}
                    onChange={() => handleQuestionTypeToggle("short-answer")}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="font-medium">Short Answer</div>
                    <div className="text-sm text-muted-foreground">
                      Type in your answer
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={questionTypes.includes("true-false")}
                    onChange={() => handleQuestionTypeToggle("true-false")}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="font-medium">True/False</div>
                    <div className="text-sm text-muted-foreground">
                      Answer true or false
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={generating || selectedDeckIds.length === 0}
            className="flex-1"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Test...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Practice Test
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/practice">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

