"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  questionType: "multiple-choice" | "short-answer" | "true-false";
  options: string[];
  order: number;
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  showResults?: boolean;
  correctAnswer?: string;
  isCorrect?: boolean;
  explanation?: string | null;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  showResults = false,
  correctAnswer,
  isCorrect,
  explanation,
}: QuestionDisplayProps) {
  return (
    <Card className={cn(
      showResults && isCorrect !== undefined && (
        isCorrect ? "border-green-500" : "border-red-500"
      )
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          {showResults && isCorrect !== undefined && (
            <span
              className={cn(
                "text-sm font-semibold px-3 py-1 rounded-full",
                isCorrect
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div className="text-lg font-medium">{question.question}</div>

        {/* Answer Input based on question type */}
        {question.questionType === "multiple-choice" && (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = userAnswer === option;
              const isCorrectOption = showResults && option === correctAnswer;
              const showAsWrong = showResults && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !showResults && onAnswerChange(option)}
                  disabled={showResults}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    "hover:border-primary disabled:cursor-not-allowed",
                    isSelected && !showResults && "border-primary bg-primary/5",
                    isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    showAsWrong && "border-red-500 bg-red-50 dark:bg-red-900/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm",
                        isSelected && !showResults && "border-primary text-primary",
                        isCorrectOption && "border-green-500 text-green-700 dark:text-green-400",
                        showAsWrong && "border-red-500 text-red-700 dark:text-red-400"
                      )}
                    >
                      {optionLetter}
                    </div>
                    <div className="flex-1">{option}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {question.questionType === "short-answer" && (
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Your Answer</Label>
            <Input
              id={`question-${question.id}`}
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              disabled={showResults}
              className={cn(
                showResults && isCorrect !== undefined && (
                  isCorrect ? "border-green-500" : "border-red-500"
                )
              )}
            />
          </div>
        )}

        {question.questionType === "true-false" && (
          <div className="flex gap-4">
            <Button
              type="button"
              variant={userAnswer === "true" ? "default" : "outline"}
              onClick={() => !showResults && onAnswerChange("true")}
              disabled={showResults}
              className={cn(
                "flex-1",
                showResults && correctAnswer === "true" && "border-green-500",
                showResults && userAnswer === "true" && !isCorrect && "border-red-500"
              )}
            >
              True
            </Button>
            <Button
              type="button"
              variant={userAnswer === "false" ? "default" : "outline"}
              onClick={() => !showResults && onAnswerChange("false")}
              disabled={showResults}
              className={cn(
                "flex-1",
                showResults && correctAnswer === "false" && "border-green-500",
                showResults && userAnswer === "false" && !isCorrect && "border-red-500"
              )}
            >
              False
            </Button>
          </div>
        )}

        {/* Show correct answer and explanation in results mode */}
        {showResults && (
          <div className="pt-4 border-t space-y-3">
            {!isCorrect && (
              <div className="text-sm">
                <span className="font-semibold">Correct Answer: </span>
                <span className="text-green-700 dark:text-green-400">{correctAnswer}</span>
              </div>
            )}
            {explanation && (
              <div className="text-sm bg-muted/50 p-3 rounded-lg">
                <span className="font-semibold">Explanation: </span>
                {explanation}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

