"use client";

import { useState } from "react";
import { usePomodoroContext } from "@/contexts/pomodoro-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, X } from "lucide-react";
import { DEFAULT_DURATIONS } from "@/lib/hooks/use-pomodoro";

export function PomodoroSettings() {
  const { durations, updateDurations, state } = usePomodoroContext();
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(Math.floor(durations.work / 60));
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(durations.shortBreak / 60));
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(durations.longBreak / 60));

  const handleSave = () => {
    const newDurations = {
      work: workMinutes * 60,
      shortBreak: shortBreakMinutes * 60,
      longBreak: longBreakMinutes * 60,
    };
    updateDurations(newDurations);
    setShowSettings(false);
  };

  const handleReset = () => {
    setWorkMinutes(Math.floor(DEFAULT_DURATIONS.work / 60));
    setShortBreakMinutes(Math.floor(DEFAULT_DURATIONS.shortBreak / 60));
    setLongBreakMinutes(Math.floor(DEFAULT_DURATIONS.longBreak / 60));
  };

  if (!showSettings) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pomodoro Settings</CardTitle>
            <CardDescription>
              Customize your timer durations
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="work-duration">Work Duration (minutes)</Label>
            <Input
              id="work-duration"
              type="number"
              min="1"
              max="120"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={state.isRunning}
            />
            <p className="text-sm text-muted-foreground">
              How long you'll focus on work (default: 25 minutes)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short-break-duration">Short Break Duration (minutes)</Label>
            <Input
              id="short-break-duration"
              type="number"
              min="1"
              max="60"
              value={shortBreakMinutes}
              onChange={(e) => setShortBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={state.isRunning}
            />
            <p className="text-sm text-muted-foreground">
              Short break between work sessions (default: 5 minutes)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="long-break-duration">Long Break Duration (minutes)</Label>
            <Input
              id="long-break-duration"
              type="number"
              min="1"
              max="120"
              value={longBreakMinutes}
              onChange={(e) => setLongBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={state.isRunning}
            />
            <p className="text-sm text-muted-foreground">
              Longer break after 4 work sessions (default: 15 minutes)
            </p>
          </div>
        </div>

        {state.isRunning && (
          <div className="text-sm text-amber-600 dark:text-amber-500">
            ⚠️ Settings are disabled while timer is running
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={state.isRunning}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={state.isRunning}>
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

