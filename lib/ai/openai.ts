import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to create responses with GPT-5
export async function createResponse(input: string | Array<any>, options?: {
  reasoningEffort?: "minimal" | "low" | "medium" | "high";
  verbosity?: "low" | "medium" | "high";
  tools?: Array<any>;
  textFormat?: any;
}) {
  // Build the text parameter properly - can combine verbosity and format
  let textParam: any = undefined;
  
  if (options?.textFormat || options?.verbosity) {
    textParam = {};
    if (options.verbosity) {
      textParam.verbosity = options.verbosity;
    }
    if (options.textFormat) {
      textParam.format = options.textFormat;
    }
  }

  return await openai.responses.create({
    model: "gpt-5",
    input,
    reasoning: options?.reasoningEffort ? { effort: options.reasoningEffort } : undefined,
    text: textParam,
    tools: options?.tools,
  });
}

