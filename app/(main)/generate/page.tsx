"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploader } from "@/components/generate/DocumentUploader";
import { GenerationOptions } from "@/components/generate/GenerationOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

interface GeneratedCard {
  front: string;
  back: string;
  id?: string;
}

interface GenerationRequestOptions {
  cardCount?: number;
  allowExternal: boolean;
  notes?: string;
}

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [documentText, setDocumentText] = useState("");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGenerate = async ({
    cardCount,
    allowExternal,
    notes,
  }: GenerationRequestOptions) => {
    if (!documentText.trim()) {
      setError("Please provide text to generate flashcards from");
      return;
    }

    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const payload: Record<string, unknown> = {
        documentText,
        allowExternal,
      };

      if (typeof cardCount === "number") {
        payload.cardCount = cardCount;
      }

      if (deckId) {
        payload.deckId = deckId;
      }

      if (notes && notes.trim()) {
        payload.notes = notes.trim();
      }

      const response = await fetch("/api/generate/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      setGeneratedCards(data.flashcards);
      setSuccess(true);

      // Redirect to the deck (either the provided one or newly created one)
      if (data.deckId) {
        setTimeout(() => {
          router.push(`/decks/${data.deckId}`);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        {deckId && (
          <Link
            href={`/decks/${deckId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to deck
          </Link>
        )}
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Generate Flashcards with AI
            </h1>
            <p className="text-muted-foreground">
              Upload documents or paste text to create flashcards automatically
            </p>
          </div>
        </div>
      </div>

      {success && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/10">
          <CardContent className="flex items-center gap-2 py-4">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">
              Successfully generated {generatedCards.length} flashcards!
              {" Redirecting to deck..."}
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Content</CardTitle>
              <CardDescription>
                Upload a document or paste your text below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paste" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Your Content</Label>
                    <Textarea
                      id="text"
                      placeholder="Paste your notes, study materials, or any text content here..."
                      rows={12}
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      {documentText.length} / 20,000 characters
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  <DocumentUploader onTextExtracted={setDocumentText} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {generatedCards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Flashcards ({generatedCards.length})</CardTitle>
                <CardDescription>
                  Preview of your AI-generated flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedCards.map((card, index) => (
                  <Card key={index} className="bg-secondary/50">
                    <CardContent className="pt-6 space-y-2">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          FRONT
                        </div>
                        <div className="text-sm">{card.front}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          BACK
                        </div>
                        <div className="text-sm">{card.back}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>
                Configure how flashcards are created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerationOptions
                onGenerate={handleGenerate}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
