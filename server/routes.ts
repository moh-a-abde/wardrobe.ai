import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { generateOutfitSuggestion } from "./openai";
import { insertClothingItemSchema, insertOutfitSchema, insertPreferencesSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
