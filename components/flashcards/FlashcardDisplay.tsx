"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExplanationPanel } from "./ExplanationPanel";

interface FlashcardDisplayProps {
  front: string;
  back: string;
  cardId?: string;
  explanation?: string | null;
  showExplanation?: boolean;
  onFlip?: (isShowingBack: boolean) => void;
}

export function FlashcardDisplay({ 
  front, 
  back, 
  cardId,
  explanation,
  showExplanation = false,
  onFlip 
}: FlashcardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="w-full" style={{ perspective: "1000px" }}>
        <div
          className={cn("relative w-full h-96 cursor-pointer")}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={handleFlip}
        >
          {/* Front */}
          <Card
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "border-2 hover:border-primary transition-colors"
            )}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <CardContent className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="text-sm text-muted-foreground mb-4">QUESTION</div>
              <div className="text-2xl text-center">{front}</div>
              <div className="text-sm text-muted-foreground mt-8">
                Click to reveal answer
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "border-2 border-primary"
            )}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="text-sm text-muted-foreground mb-4">ANSWER</div>
              <div className="text-2xl text-center">{back}</div>
              <div className="text-sm text-muted-foreground mt-8">
                Click to see question
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Explanation Panel - only show if cardId is provided and showExplanation is true */}
      {showExplanation && cardId && (
        <ExplanationPanel
          cardId={cardId}
          front={front}
          back={back}
          initialExplanation={explanation}
        />
      )}
    </div>
  );
}
