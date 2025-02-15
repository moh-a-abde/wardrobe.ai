import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateOutfitSuggestion } from "./openai";
import { 
  insertClothingItemSchema, 
  insertOutfitSchema, 
  insertPreferencesSchema,
  insertScheduledOutfitSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Clothing Items
  app.get("/api/clothing", async (req, res) => {
    const items = await storage.getClothingItems();
    res.json(items);
  });

  app.post("/api/clothing", async (req, res) => {
    const parsed = insertClothingItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid clothing item data" });
    }
    const item = await storage.createClothingItem(parsed.data);
    res.json(item);
  });

  app.delete("/api/clothing/:id", async (req, res) => {
    await storage.deleteClothingItem(Number(req.params.id));
    res.status(204).end();
  });

  // Outfits
  app.get("/api/outfits", async (req, res) => {
    const outfits = await storage.getOutfits();
    res.json(outfits);
  });

  app.post("/api/outfits/suggest", async (req, res) => {
    const { weather, occasion } = req.body;
    const items = await storage.getClothingItems();
    const preferences = await storage.getPreferences();

    const suggestion = await generateOutfitSuggestion(
      items,
      preferences,
      weather,
      occasion
    );

    res.json(suggestion);
  });

  app.post("/api/outfits", async (req, res) => {
    const parsed = insertOutfitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid outfit data" });
    }
    const outfit = await storage.createOutfit(parsed.data);
    res.json(outfit);
  });

  // Scheduled Outfits
  app.get("/api/scheduled-outfits", async (req, res) => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const scheduledOutfits = await storage.getScheduledOutfits(startDate, endDate);
    res.json(scheduledOutfits);
  });

  app.post("/api/scheduled-outfits", async (req, res) => {
    const parsed = insertScheduledOutfitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid scheduled outfit data" });
    }
    const scheduledOutfit = await storage.scheduleOutfit(parsed.data);
    res.json(scheduledOutfit);
  });

  app.delete("/api/scheduled-outfits/:id", async (req, res) => {
    await storage.unscheduleOutfit(Number(req.params.id));
    res.status(204).end();
  });

  // Preferences
  app.get("/api/preferences", async (req, res) => {
    const preferences = await storage.getPreferences();
    res.json(preferences);
  });

  app.post("/api/preferences", async (req, res) => {
    const parsed = insertPreferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid preferences data" });
    }
    const preferences = await storage.updatePreferences(parsed.data);
    res.json(preferences);
  });

  // Add new route group for shopping recommendations
  app.get("/api/recommendations", async (req, res) => {
    const recommendations = await storage.getProductRecommendations();
    res.json(recommendations);
  });

  app.post("/api/recommendations/generate", async (req, res) => {
    const items = await storage.getClothingItems();
    const preferences = await storage.getPreferences();

    const suggestions = await generateShoppingRecommendations(items, preferences);

    // Store the recommendations
    const storedRecommendations = await Promise.all(
      suggestions.recommendations.map(recommendation =>
        storage.createProductRecommendation(recommendation)
      )
    );

    res.json(storedRecommendations);
  });

  app.delete("/api/recommendations/:id", async (req, res) => {
    await storage.deleteProductRecommendation(Number(req.params.id));
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}