import { createResponse } from "./openai";
import { Flashcard } from "@prisma/client";

interface GeneratedQuestion {
  question: string;
  questionType: "multiple-choice" | "short-answer" | "true-false";
  correctAnswer: string;
  options?: string[];
  explanation?: string;
}

export async function generatePracticeTest(
  flashcards: Flashcard[],
  questionCount: number,
  questionTypes: Array<"multiple-choice" | "short-answer" | "true-false"> = [
    "multiple-choice",
    "short-answer",
    "true-false",
  ]
): Promise<GeneratedQuestion[]> {
  // Prepare flashcard content for the AI
  const flashcardContent = flashcards
    .map((card, idx) => `${idx + 1}. Q: ${card.front}\n   A: ${card.back}`)
    .join("\n\n");

  const response = await createResponse(
    [
      {
        role: "developer",
        content: `You are an expert test creator. Generate ${questionCount} high-quality test questions based on the provided flashcard content.

Question types to use: ${questionTypes.join(", ")}

Rules:
1. Distribute question types evenly
2. For multiple-choice: provide 4 options with one correct answer
3. For short-answer: expect a brief, specific answer
4. For true-false: make statements clear and unambiguous
5. Test understanding, not just memorization
6. Include explanations for the correct answers`,
      },
      {
        role: "user",
        content: `Create ${questionCount} test questions from these flashcards:\n\n${flashcardContent}`,
      },
    ],
    {
      reasoningEffort: "medium",
      textFormat: {
        type: "json_schema",
        name: "practice_test",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                    description: "The test question",
                  },
                  questionType: {
                    type: "string",
                    enum: ["multiple-choice", "short-answer", "true-false"],
                  },
                  correctAnswer: {
                    type: "string",
                    description: "The correct answer",
                  },
                  options: {
                    type: ["array", "null"],
                    items: {
                      type: "string",
                    },
                    description:
                      "Options for multiple-choice (null for other types)",
                  },
                  explanation: {
                    type: ["string", "null"],
                    description: "Explanation of the correct answer",
                  },
                },
                required: [
                  "question",
                  "questionType",
                  "correctAnswer",
                  "options",
                  "explanation",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    }
  );

  const parsed = JSON.parse(response.output_text);
  return parsed.questions;
}

