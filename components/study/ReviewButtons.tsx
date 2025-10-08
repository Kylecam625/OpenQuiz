"use client";

import { Button } from "@/components/ui/button";
import { XCircle, AlertCircle, CheckCircle, Star } from "lucide-react";

interface ReviewButtonsProps {
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  disabled?: boolean;
}

export function ReviewButtons({ onRate, disabled }: ReviewButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 w-full max-w-2xl mx-auto mt-6">
      <Button
        variant="outline"
        className="flex flex-col gap-2 h-auto py-4 hover:bg-destructive/10 hover:border-destructive"
        onClick={() => onRate(1)}
        disabled={disabled}
      >
        <XCircle className="h-5 w-5 text-destructive" />
        <span className="text-xs font-medium">Again</span>
        <span className="text-xs text-muted-foreground">&lt; 1 min</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col gap-2 h-auto py-4 hover:bg-orange-500/10 hover:border-orange-500"
        onClick={() => onRate(2)}
        disabled={disabled}
      >
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <span className="text-xs font-medium">Hard</span>
        <span className="text-xs text-muted-foreground">&lt; 6 min</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col gap-2 h-auto py-4 hover:bg-green-500/10 hover:border-green-500"
        onClick={() => onRate(3)}
        disabled={disabled}
      >
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-xs font-medium">Good</span>
        <span className="text-xs text-muted-foreground">&lt; 10 min</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col gap-2 h-auto py-4 hover:bg-blue-500/10 hover:border-blue-500"
        onClick={() => onRate(4)}
        disabled={disabled}
      >
        <Star className="h-5 w-5 text-blue-500" />
        <span className="text-xs font-medium">Easy</span>
        <span className="text-xs text-muted-foreground">4 days</span>
      </Button>
    </div>
  );
}

