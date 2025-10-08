"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplanationPanelProps {
  cardId: string;
  front: string;
  back: string;
  initialExplanation?: string | null;
  className?: string;
}

export function ExplanationPanel({
  cardId,
  front,
  back,
  initialExplanation,
  className,
}: ExplanationPanelProps) {
  const [explanation, setExplanation] = useState<string | null>(
    initialExplanation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCached, setIsCached] = useState(!!initialExplanation);

  const fetchExplanation = async () => {
    if (explanation && !isExpanded) {
      setIsExpanded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/flashcards/${cardId}/explanation`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch explanation");
      }

      const data = await response.json();
      setExplanation(data.explanation);
      setIsExpanded(true);
      
      // If we just fetched it, it wasn't cached initially
      if (!isCached) {
        setIsCached(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded && !explanation) {
    return (
      <div className={cn("flex justify-center", className)}>
        <Button
          onClick={fetchExplanation}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating explanation...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              Get AI Explanation
            </>
          )}
        </Button>
      </div>
    );
  }

  if (isExpanded && explanation) {
    return (
      <Card className={cn("border-blue-200 dark:border-blue-900", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            AI Explanation
            {isCached && (
              <span className="ml-auto text-xs font-normal text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Cached
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-sm text-muted-foreground mb-2">
              <strong>Question:</strong> {front}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              <strong>Answer:</strong> {back}
            </div>
            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="w-full"
          >
            Collapse
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Failed to load explanation: {error}</p>
          </div>
          <Button
            onClick={fetchExplanation}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}

