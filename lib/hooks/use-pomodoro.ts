"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SessionType = "work" | "shortBreak" | "longBreak";

export interface PomodoroState {
  sessionType: SessionType;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionCount: number; // tracks work sessions completed
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

const STORAGE_KEY = "pomodoro-state";
const POSITION_KEY = "pomodoro-widget-position";
const SIZE_KEY = "pomodoro-widget-size";
const SETTINGS_KEY = "pomodoro-settings";

// Standard Pomodoro durations (in seconds)
export const DEFAULT_DURATIONS = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export interface PomodoroDurations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_STATE: PomodoroState = {
  sessionType: "work",
  timeRemaining: DEFAULT_DURATIONS.work,
  isRunning: false,
  sessionCount: 0,
};

const getDefaultPosition = (): WidgetPosition => {
  if (typeof window !== "undefined") {
    return {
      x: window.innerWidth - 320,
      y: 20,
    };
  }
  return { x: 0, y: 20 };
};

const DEFAULT_SIZE: WidgetSize = {
  width: 300,
  height: 180,
};

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>(DEFAULT_STATE);
  const [widgetPosition, setWidgetPosition] = useState<WidgetPosition>(getDefaultPosition);
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(DEFAULT_SIZE);
  const [durations, setDurations] = useState<PomodoroDurations>(DEFAULT_DURATIONS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteCallbackRef = useRef<(() => void) | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    const savedPosition = localStorage.getItem(POSITION_KEY);
    const savedSize = localStorage.getItem(SIZE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse saved pomodoro state", e);
      }
    }

    if (savedPosition) {
      try {
        setWidgetPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Failed to parse saved position", e);
      }
    }

    if (savedSize) {
      try {
        setWidgetSize(JSON.parse(savedSize));
      } catch (e) {
        console.error("Failed to parse saved size", e);
      }
    }

    if (savedSettings) {
      try {
        setDurations(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(widgetPosition));
  }, [widgetPosition]);

  // Save size to localStorage
  useEffect(() => {
    localStorage.setItem(SIZE_KEY, JSON.stringify(widgetSize));
  }, [widgetSize]);

  // Save durations to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(durations));
  }, [durations]);

  // Timer interval
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining <= 1) {
            // Session complete
            if (onCompleteCallbackRef.current) {
              onCompleteCallbackRef.current();
            }
            // Pause and wait for user to start next session
            return {
              ...prev,
              timeRemaining: 0,
              isRunning: false,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeRemaining: durations[prev.sessionType],
      isRunning: false,
    }));
  }, [durations]);

  const skip = useCallback(() => {
    setState((prev) => {
      const newCount =
        prev.sessionType === "work" ? prev.sessionCount + 1 : prev.sessionCount;
      
      let nextSessionType: SessionType;
      if (prev.sessionType === "work") {
        // After work, go to break (long break every 4th session)
        nextSessionType = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      } else {
        // After break, go back to work
        nextSessionType = "work";
      }

      return {
        sessionType: nextSessionType,
        timeRemaining: durations[nextSessionType],
        isRunning: false,
        sessionCount: newCount,
      };
    });
  }, [durations]);

  const updatePosition = useCallback((position: WidgetPosition) => {
    setWidgetPosition(position);
  }, []);

  const updateSize = useCallback((size: WidgetSize) => {
    setWidgetSize(size);
  }, []);

  const updateDurations = useCallback((newDurations: PomodoroDurations) => {
    setDurations(newDurations);
    // Reset current session time if timer is not running
    setState((prev) => ({
      ...prev,
      timeRemaining: newDurations[prev.sessionType],
    }));
  }, []);

  const setOnComplete = useCallback((callback: () => void) => {
    onCompleteCallbackRef.current = callback;
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    state,
    widgetPosition,
    widgetSize,
    durations,
    start,
    pause,
    reset,
    skip,
    updatePosition,
    updateSize,
    updateDurations,
    setOnComplete,
    formatTime,
  };
}

