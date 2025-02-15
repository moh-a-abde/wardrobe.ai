import { pgTable, text, serial, integer, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clothingItems = pgTable("clothing_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // shirt, pants, shoes, etc.
  color: text("color").notNull(),
  season: text("season").notNull(), // summer, winter, etc.
  occasion: text("occasion").notNull(), // casual, formal, etc.
  imageUrl: text("image_url").notNull(),
});

export const outfits = pgTable("outfits", {
  id: serial("id").primaryKey(),
  items: integer("items").array().notNull(), // array of clothing item IDs
  occasion: text("occasion").notNull(),
  weather: text("weather").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// New table for scheduled outfits
export const scheduledOutfits = pgTable("scheduled_outfits", {
  id: serial("id").primaryKey(),
  outfitId: integer("outfit_id").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  stylePreferences: jsonb("style_preferences").notNull(),
  colorPreferences: jsonb("color_preferences").notNull(),
});

// New table for product recommendations
export const productRecommendations = pgTable("product_recommendations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  color: text("color").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  productUrl: text("product_url").notNull(),
  reason: text("reason").notNull(),
  category: text("category").notNull(), // e.g., "wardrobe_gap", "style_match", "trend"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClothingItemSchema = createInsertSchema(clothingItems).omit({ id: true });
export const insertOutfitSchema = createInsertSchema(outfits).omit({ id: true, createdAt: true });
export const insertScheduledOutfitSchema = createInsertSchema(scheduledOutfits).omit({ id: true, createdAt: true });
export const insertPreferencesSchema = createInsertSchema(preferences).omit({ id: true });
export const insertProductRecommendationSchema = createInsertSchema(productRecommendations).omit({ 
  id: true,
  createdAt: true 
});

export type ClothingItem = typeof clothingItems.$inferSelect;
export type InsertClothingItem = z.infer<typeof insertClothingItemSchema>;
export type Outfit = typeof outfits.$inferSelect;
export type InsertOutfit = z.infer<typeof insertOutfitSchema>;
export type ScheduledOutfit = typeof scheduledOutfits.$inferSelect;
export type InsertScheduledOutfit = z.infer<typeof insertScheduledOutfitSchema>;
export type Preferences = typeof preferences.$inferSelect;
export type InsertPreferences = z.infer<typeof insertPreferencesSchema>;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type InsertProductRecommendation = z.infer<typeof insertProductRecommendationSchema>;