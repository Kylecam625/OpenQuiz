"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionDisplay } from "@/components/practice/QuestionDisplay";
import { ArrowLeft, Clock, Loader2, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  questionType: "multiple-choice" | "short-answer" | "true-false";
  options: string[];
  order: number;
}

interface PracticeTest {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
}

export default function TakeTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<PracticeTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadTest();
  }, [testId]);

  // Timer
  useEffect(() => {
    if (!test) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [test, startTime]);

  const loadTest = async () => {
    try {
      const response = await fetch(`/api/practice/${testId}`);
      const data = await response.json();
      setTest(data);

      // Start attempt
      const attemptResponse = await fetch(`/api/practice/${testId}/attempt`, {
        method: "POST",
      });
      const attempt = await attemptResponse.json();
      setAttemptId(attempt.id);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error loading test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!attemptId || !test) return;

    const unansweredCount = test.questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === ""
    ).length;

    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const formattedAnswers = test.questions.map((q) => ({
        questionId: q.id,
        userAnswer: answers[q.id] || "",
      }));

      await fetch(`/api/practice/${testId}/attempt`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          answers: formattedAnswers,
          duration,
        }),
      });

      router.push(`/practice/${testId}/results?attemptId=${attemptId}`);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p>Test not found</p>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] && answers[key].trim() !== ""
  ).length;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{test.title}</h1>
            {test.description && (
              <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progress: {answeredCount} / {test.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((answeredCount / test.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${(answeredCount / test.questions.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <QuestionDisplay
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={test.questions.length}
        userAnswer={answers[currentQuestion.id] || ""}
        onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2 flex-wrap justify-center">
          {test.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-all ${
                index === currentQuestionIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[test.questions[index].id]
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "border-muted-foreground/30 hover:border-primary"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < test.questions.length - 1 ? (
          <Button variant="outline" onClick={goToNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Test
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

