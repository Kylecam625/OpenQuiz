import { createResponse } from "./openai";

export async function generateExplanation(
  front: string,
  back: string
): Promise<string> {
  const response = await createResponse(
    [
      {
        role: "developer",
        content: `You are a helpful tutor providing detailed explanations for flashcard concepts. 
        
Your explanation should:
1. Clarify the concept in simple terms
2. Provide context and examples
3. Explain why it's important
4. Connect to related concepts if relevant
5. Be concise but thorough (2-4 paragraphs)`,
      },
      {
        role: "user",
        content: `Provide a detailed explanation for this flashcard:

Question: ${front}

Answer: ${back}`,
      },
    ],
    {
      reasoningEffort: "low",
      verbosity: "medium",
    }
  );

  return response.output_text;
}

