"use client";

import React, { createContext, useContext, useEffect } from "react";
import { usePomodoro, PomodoroState, WidgetPosition, WidgetSize, SessionType, PomodoroDurations } from "@/lib/hooks/use-pomodoro";

interface PomodoroContextType {
  state: PomodoroState;
  widgetPosition: WidgetPosition;
  widgetSize: WidgetSize;
  durations: PomodoroDurations;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  updatePosition: (position: WidgetPosition) => void;
  updateSize: (size: WidgetSize) => void;
  updateDurations: (durations: PomodoroDurations) => void;
  formatTime: (seconds: number) => string;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const pomodoroHook = usePomodoro();

  // Request notification permission and handle session completion
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    pomodoroHook.setOnComplete(() => {
      // Show notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const sessionName = getSessionName(pomodoroHook.state.sessionType);
        new Notification("Pomodoro Timer", {
          body: `${sessionName} session complete! Time for a break.`,
          icon: "/favicon.ico",
        });
      }

      // Play sound (optional - you can add an audio file)
      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {
          // Ignore errors if audio file doesn't exist
        });
      } catch (e) {
        // Ignore audio errors
      }
    });
  }, [pomodoroHook]);

  return (
    <PomodoroContext.Provider value={pomodoroHook}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider");
  }
  return context;
}

function getSessionName(sessionType: SessionType): string {
  switch (sessionType) {
    case "work":
      return "Work";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
  }
}

