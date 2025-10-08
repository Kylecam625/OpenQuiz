import { createResponse } from "./openai";
import { GeneratedFlashcard } from "@/lib/types";

interface FlashcardGenerationOptions {
  cardCount?: number;
  allowExternal?: boolean;
  notes?: string;
}

export async function generateFlashcards(
  documentText: string,
  options: FlashcardGenerationOptions = {}
): Promise<GeneratedFlashcard[]> {
  const { cardCount, allowExternal = false, notes } = options;

  const countInstructions = cardCount
    ? `Generate exactly ${cardCount} flashcards from the provided document.`
    : "Analyze the document and generate an appropriate number of flashcards to cover the key concepts (typically 10-30 cards depending on content).";

  const knowledgeScope = allowExternal
    ? "You may incorporate reliable external knowledge to clarify or complete answers, but always align with the user's intent and avoid speculation."
    : "Base every flashcard strictly on the provided document. Do not introduce facts that are not supported by the supplied content.";

  const developerContent = [
    "You are an expert educator creating high-quality flashcards for effective studying.",
    countInstructions,
    knowledgeScope,
    `Rules for flashcard creation:
1. Create clear, focused questions on the front
2. Provide complete, accurate answers on the back
3. Break complex topics into multiple cards
4. Use active recall principles
5. Make cards specific and unambiguous
6. Cover key concepts, definitions, processes, and relationships
7. Avoid yes/no questions
8. Each card should test one concept`,
    "Return ONLY valid JSON matching the schema provided.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const userSections = [
    `Create flashcards from this document:\n\n${documentText}`,
  ];

  if (notes?.trim()) {
    userSections.push(`Additional context from the user:\n${notes.trim()}`);
  }

  const response = await createResponse(
    [
      {
        role: "developer",
        content: developerContent,
      },
      {
        role: "user",
        content: userSections.join("\n\n"),
      },
    ],
    {
      reasoningEffort: "medium",
      textFormat: {
        type: "json_schema",
        name: "flashcards",
        strict: true,
        schema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  front: {
                    type: "string",
                    description: "The question or prompt for the flashcard",
                  },
                  back: {
                    type: "string",
                    description: "The answer or information for the flashcard",
                  },
                },
                required: ["front", "back"],
                additionalProperties: false,
              },
            },
          },
          required: ["flashcards"],
          additionalProperties: false,
        },
      },
    }
  );

  const outputText = response.output_text;
  const parsed = JSON.parse(outputText);
  return parsed.flashcards;
}
