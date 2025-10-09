import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { PomodoroSettings } from "@/components/pomodoro/PomodoroSettings";

export default function PomodoroPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
          <p className="text-muted-foreground mt-2">
            Stay focused with the Pomodoro Technique
          </p>
        </div>
        <PomodoroSettings />
      </div>

      <PomodoroTimer />

      {/* Information Section */}
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-4">How it works</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Work for 25 minutes with full focus</li>
          <li>Take a 5-minute break to recharge</li>
          <li>Repeat this cycle 4 times</li>
          <li>After the 4th work session, take a longer 15-minute break</li>
          <li>Start the cycle again!</li>
        </ol>
      </div>
    </div>
  );
}

