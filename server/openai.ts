import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
export async function generateOutfitSuggestion(
  items: any[],
  preferences: any,
  weather: string,
  occasion: string
): Promise<{
  items: number[];
  reasoning: string;
}> {
  try {
    const prompt = `Given these clothing items: ${JSON.stringify(items)}
And user preferences: ${JSON.stringify(preferences)}
Weather: ${weather}
Occasion: ${occasion}

Suggest an outfit combination. Return a JSON object with:
{
  "items": [array of clothing item IDs to use],
  "reasoning": "explanation of why these items work well together"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    // Handle rate limiting and other API errors gracefully
    if (error.status === 429) {
      return {
        items: [],
        reasoning: "Unable to generate suggestion at the moment. Please try again later."
      };
    }

    throw new Error(`Failed to generate outfit suggestion: ${error.message}`);
  }
}