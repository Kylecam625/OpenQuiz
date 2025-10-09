"use client";

import { usePomodoroContext } from "@/contexts/pomodoro-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PomodoroTimer() {
  const { state, durations, start, pause, reset, skip, formatTime } = usePomodoroContext();

  const getSessionLabel = () => {
    switch (state.sessionType) {
      case "work":
        return "Work Session";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const getProgressPercentage = () => {
    const totalTime = durations[state.sessionType];
    return ((totalTime - state.timeRemaining) / totalTime) * 100;
  };

  const getSessionColor = () => {
    switch (state.sessionType) {
      case "work":
        return "text-red-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-8">
        {/* Session Type */}
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${getSessionColor()}`}>
            {getSessionLabel()}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Session {state.sessionCount % 4 || 4}/4
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="text-8xl font-bold tabular-nums tracking-tight">
            {formatTime(state.timeRemaining)}
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={getProgressPercentage()} className="h-3" />

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {state.isRunning ? (
            <Button onClick={pause} size="lg" variant="outline" className="w-32">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          ) : (
            <Button onClick={start} size="lg" className="w-32">
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          )}
          
          <Button onClick={reset} size="lg" variant="outline">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>

          <Button onClick={skip} size="lg" variant="outline">
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-center text-sm text-muted-foreground">
          {state.sessionType === "work" && (
            <p>Focus time! Work for 25 minutes.</p>
          )}
          {state.sessionType === "shortBreak" && (
            <p>Take a short 5-minute break.</p>
          )}
          {state.sessionType === "longBreak" && (
            <p>Great job! Take a longer 15-minute break.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

