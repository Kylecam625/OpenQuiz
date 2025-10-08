"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DailyPerformance {
  date: string;
  reviews: number;
  correct: number;
  accuracy: number;
}

interface PerformanceChartProps {
  data: DailyPerformance[];
  type?: "line" | "bar";
}

export function PerformanceChart({ data, type = "bar" }: PerformanceChartProps) {
  if (data.length === 0 || data.every((d) => d.reviews === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Your study performance over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
            No study data yet. Complete some study sessions to see your performance trends!
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600 dark:text-blue-400">
              Reviews: {payload[0].value}
            </p>
            <p className="text-green-600 dark:text-green-400">
              Correct: {payload[1]?.value || 0}
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              Accuracy: {payload[0].payload.accuracy}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Your study performance over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="reviews"
                fill="hsl(var(--primary))"
                name="Total Reviews"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="correct"
                fill="hsl(142 76% 36%)"
                name="Correct"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="reviews"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Total Reviews"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                type="monotone"
                dataKey="correct"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                name="Correct"
                dot={{ fill: "hsl(142 76% 36%)" }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(262 83% 58%)"
                strokeWidth={2}
                name="Accuracy %"
                dot={{ fill: "hsl(262 83% 58%)" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

