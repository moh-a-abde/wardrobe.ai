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
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error('Outfit suggestion error:', error);
    if (error.status === 429) {
      return {
        items: [],
        reasoning: "Unable to generate suggestion at the moment. Please try again later."
      };
    }
    throw new Error(`Failed to generate outfit suggestion: ${error.message}`);
  }
}

export interface RecommendationResponse {
  recommendations: Array<{
    name: string;
    type: string;
    color: string;
    price: string;
    imageUrl: string;
    productUrl: string;
    reason: string;
    category: string;
  }>;
}

export async function generateShoppingRecommendations(
  existingItems: any[],
  preferences: any,
): Promise<RecommendationResponse> {
  try {
    const prompt = `Given these existing clothing items: ${JSON.stringify(existingItems)}
And user preferences: ${JSON.stringify(preferences)}

Suggest clothing items to purchase that would complement the existing wardrobe.
Consider:
1. Fill gaps in the wardrobe
2. Match user's style preferences
3. Seasonal appropriateness

Return a JSON object with this format:
{
  "recommendations": [
    {
      "name": "item name",
      "type": "clothing type",
      "color": "color",
      "price": "29.99",
      "imageUrl": "https://example.com/image.jpg",
      "productUrl": "https://example.com/product",
      "reason": "detailed reason for recommendation",
      "category": "wardrobe_gap" or "style_match" or "trend"
    }
  ]
}`;

    console.log('Sending request to OpenAI for shopping recommendations...');
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    console.log('Received response from OpenAI:', response.choices[0].message.content);
    const result = JSON.parse(response.choices[0].message.content);

    // Ensure all prices are strings
    const recommendations = result.recommendations.map(rec => ({
      ...rec,
      price: typeof rec.price === 'number' ? rec.price.toFixed(2) : rec.price
    }));

    return { recommendations };
  } catch (error: any) {
    console.error('Shopping recommendations error:', error);
    if (error.status === 429) {
      return { recommendations: [] };
    }
    throw new Error(`Failed to generate shopping recommendations: ${error.message}`);
  }
}

export interface TrendResponse {
  trends: Array<{
    title: string;
    description: string;
    category: string;
    season: string;
    imageUrl: string;
    source: string;
    validFrom: string;
    validTo: string;
  }>;
}

export async function generateFashionTrends(): Promise<TrendResponse> {
  try {
    const currentDate = new Date();
    const prompt = `Generate current fashion trends and forecasts for ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}.
Consider:
1. Current season and upcoming seasonal transitions
2. Global fashion week insights
3. Street style trends
4. Color trends
5. Sustainable fashion movements

Return a JSON object with this format:
{
  "trends": [
    {
      "title": "trend title",
      "description": "detailed trend description",
      "category": "color_trend" or "style_trend" or "seasonal",
      "season": "current season",
      "imageUrl": "https://example.com/trend.jpg",
      "source": "trend source or inspiration",
      "validFrom": "2024-02-15",
      "validTo": "2024-05-15"
    }
  ]
}`;

    console.log('Sending request to OpenAI for fashion trends...');
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    console.log('Received response from OpenAI:', response.choices[0].message.content);
    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error('Fashion trends error:', error);
    if (error.status === 429) {
      return { trends: [] };
    }
    throw new Error(`Failed to generate fashion trends: ${error.message}`);
  }
}