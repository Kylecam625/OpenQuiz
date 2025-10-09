"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePomodoroContext } from "@/contexts/pomodoro-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

export function PomodoroWidget() {
  const pathname = usePathname();
  const { state, widgetPosition, widgetSize, durations, start, pause, updatePosition, updateSize, formatTime } = usePomodoroContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Hide widget on /pomodoro page
  const shouldShowWidget = pathname !== "/pomodoro" && isVisible;

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - widgetSize.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - widgetSize.height));
        updatePosition({ x: newX, y: newY });
      } else if (isResizing) {
        const newWidth = Math.max(250, Math.min(e.clientX - widgetPosition.x, 500));
        const newHeight = Math.max(150, Math.min(e.clientY - widgetPosition.y, 400));
        updateSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, widgetPosition, widgetSize, updatePosition, updateSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === widgetRef.current || (e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - widgetPosition.x,
        y: e.clientY - widgetPosition.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const getSessionLabel = () => {
    switch (state.sessionType) {
      case "work":
        return "Work";
      case "shortBreak":
        return "Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const getSessionColor = () => {
    switch (state.sessionType) {
      case "work":
        return "border-red-500";
      case "shortBreak":
        return "border-green-500";
      case "longBreak":
        return "border-blue-500";
    }
  };

  if (!shouldShowWidget) return null;

  return (
    <Card
      ref={widgetRef}
      className={`fixed shadow-2xl border-2 ${getSessionColor()} cursor-move select-none overflow-hidden`}
      style={{
        left: `${widgetPosition.x}px`,
        top: `${widgetPosition.y}px`,
        width: `${widgetSize.width}px`,
        height: `${widgetSize.height}px`,
        zIndex: 9999,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="h-full flex flex-col">
        {/* Header - Drag Handle */}
        <div className="drag-handle bg-muted/50 px-4 py-2 flex items-center justify-between border-b cursor-move">
          <span className="text-sm font-medium">{getSessionLabel()}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-4xl font-bold tabular-nums mb-4">
            {formatTime(state.timeRemaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all ${
                state.sessionType === "work"
                  ? "bg-red-500"
                  : state.sessionType === "shortBreak"
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${
                  ((state.timeRemaining / durations[state.sessionType]) * 100)
                }%`,
              }}
            />
          </div>

          {/* Control Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              state.isRunning ? pause() : start();
            }}
            size="sm"
            variant={state.isRunning ? "outline" : "default"}
          >
            {state.isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-muted hover:bg-muted-foreground/20 transition-colors"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </Card>
  );
}

