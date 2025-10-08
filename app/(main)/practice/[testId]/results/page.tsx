"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionDisplay } from "@/components/practice/QuestionDisplay";
import { ArrowLeft, Trophy, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface Answer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  question: {
    id: string;
    question: string;
    questionType: "multiple-choice" | "short-answer" | "true-false";
    correctAnswer: string;
    options: string[];
    explanation: string | null;
    order: number;
  };
}

interface TestAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
  completedAt: string;
  answers: Answer[];
  test: {
    title: string;
    description: string | null;
  };
}

export default function TestResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const testId = params.testId as string;
  const attemptId = searchParams.get("attemptId");

  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    loadResults();
  }, [testId, attemptId]);

  const loadResults = async () => {
    try {
      const response = await fetch(`/api/practice/${testId}`);
      const data = await response.json();

      // Find the specific attempt
      const targetAttempt = attemptId
        ? data.attempts.find((a: any) => a.id === attemptId)
        : data.attempts[0];

      if (targetAttempt) {
        // Fetch full attempt details with answers
        const attemptResponse = await fetch(`/api/practice/${testId}/attempt?attemptId=${targetAttempt.id}`);
        
        if (!attemptResponse.ok) {
          // If endpoint doesn't exist, reconstruct from available data
          setAttempt({ ...targetAttempt, test: { title: data.title, description: data.description } });
        } else {
          const attemptData = await attemptResponse.json();
          setAttempt(attemptData);
        }
      }
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent work! 🎉";
    if (score >= 70) return "Good job! 👍";
    if (score >= 50) return "Not bad, keep practicing! 💪";
    return "Keep studying and try again! 📚";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="text-center py-12">
        <p>Results not found</p>
        <Button asChild className="mt-4">
          <Link href="/practice">Back to Practice Tests</Link>
        </Button>
      </div>
    );
  }

  const incorrectAnswers = attempt.answers?.filter((a) => !a.isCorrect) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/practice"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to practice tests
        </Link>
        <h1 className="text-3xl font-bold">Test Results</h1>
        <p className="text-muted-foreground mt-1">{attempt.test.title}</p>
      </div>

      {/* Score Overview */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(attempt.score)}`}>
                  {Math.round(attempt.score)}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">{getScoreMessage(attempt.score)}</CardTitle>
          <CardDescription>
            Completed on {new Date(attempt.completedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-1">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-2xl font-bold">{attempt.correctAnswers}</span>
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-1">
                <XCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {attempt.totalQuestions - attempt.correctAnswers}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Clock className="h-5 w-5" />
                <span className="text-2xl font-bold">{formatDuration(attempt.duration)}</span>
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button asChild className="flex-1">
          <Link href={`/practice/${testId}`}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Test
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href="/practice">View All Tests</Link>
        </Button>
      </div>

      {/* Review Questions */}
      {attempt.answers && attempt.answers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Review Questions</CardTitle>
                <CardDescription>
                  {showAllQuestions
                    ? `Showing all ${attempt.answers.length} questions`
                    : `Showing ${incorrectAnswers.length} incorrect answers`}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllQuestions(!showAllQuestions)}
              >
                {showAllQuestions ? "Show Only Incorrect" : "Show All Questions"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(showAllQuestions ? attempt.answers : incorrectAnswers)
              .sort((a, b) => a.question.order - b.question.order)
              .map((answer, index) => (
                <QuestionDisplay
                  key={answer.questionId}
                  question={answer.question}
                  questionNumber={answer.question.order + 1}
                  totalQuestions={attempt.totalQuestions}
                  userAnswer={answer.userAnswer}
                  onAnswerChange={() => {}}
                  showResults={true}
                  correctAnswer={answer.question.correctAnswer}
                  isCorrect={answer.isCorrect}
                  explanation={answer.question.explanation}
                />
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

