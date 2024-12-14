import OpenAI from 'openai';
import * as dotenv from "dotenv";

dotenv.config();

const systemPrompt = `You are an expert in code improvement. You will receive a code and you will need to return:
- A natural-language explanation of what the code does.
- A refactored version of the code.
- A step-by-step reasoning of how the explanation was derived.

Rules:
- You cannot change the functionality of the code, unless explicitly requested.
- You cannot change the structure of the code, unless explicitly requested.
- You cannot change the language of the code, unless explicitly requested.
- You cannot change the logic of the code.
- Always return the response in JSON format. Only return the JSON, no other text or comments outside the JSON.
- The JSON should have the following keys: explanation, refactored_code, reasoning.
- If the code is not valid, return only the error message in the JSON in the key "error". Only return the JSON, no other text or comments outside the JSON
`;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("API key not found in .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export async function enhanceCode(code: string): Promise<string> {
  const userPrompt = `Here is the code, I need you to return the improved code:\n\n${code}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || "No response generated.";
  } catch (error: any) {
    console.error("Error enhancing code:", error.message);
    throw new Error("Failed to process code with OpenAI API");
  }
}
