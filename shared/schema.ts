import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  stylePreferences: jsonb("style_preferences").notNull(),
  colorPreferences: jsonb("color_preferences").notNull(),
});

export const insertClothingItemSchema = createInsertSchema(clothingItems).omit({ id: true });
export const insertOutfitSchema = createInsertSchema(outfits).omit({ id: true, createdAt: true });
export const insertPreferencesSchema = createInsertSchema(preferences).omit({ id: true });

export type ClothingItem = typeof clothingItems.$inferSelect;
export type InsertClothingItem = z.infer<typeof insertClothingItemSchema>;
export type Outfit = typeof outfits.$inferSelect;
export type InsertOutfit = z.infer<typeof insertOutfitSchema>;
export type Preferences = typeof preferences.$inferSelect;
export type InsertPreferences = z.infer<typeof insertPreferencesSchema>;
