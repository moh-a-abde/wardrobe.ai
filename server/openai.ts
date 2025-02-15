import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error: any) {
    console.error('Outfit suggestion error:', error);
    return {
      items: [],
      reasoning: "Unable to generate suggestion at the moment. Please try again later."
    };
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

    console.log('Sending request to Gemini for shopping recommendations...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Received response from Gemini:', text);
    const parsedResponse = JSON.parse(text);

    return {
      recommendations: parsedResponse.recommendations.map(rec => ({
        ...rec,
        price: typeof rec.price === 'number' ? rec.price.toFixed(2) : rec.price
      }))
    };
  } catch (error: any) {
    console.error('Shopping recommendations error:', error);
    return { recommendations: [] };
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

    console.log('Sending request to Gemini for fashion trends...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Received response from Gemini:', text);
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Fashion trends error:', error);
    return { trends: [] };
  }
}