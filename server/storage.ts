import { 
  ClothingItem, InsertClothingItem,
  Outfit, InsertOutfit,
  Preferences, InsertPreferences,
  clothingItems, outfits, preferences
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Clothing Items
  getClothingItems(): Promise<ClothingItem[]>;
  getClothingItem(id: number): Promise<ClothingItem | undefined>;
  createClothingItem(item: InsertClothingItem): Promise<ClothingItem>;
  deleteClothingItem(id: number): Promise<void>;

  // Outfits
  getOutfits(): Promise<Outfit[]>;
  createOutfit(outfit: InsertOutfit): Promise<Outfit>;

  // Preferences
  getPreferences(): Promise<Preferences | undefined>;
  updatePreferences(prefs: InsertPreferences): Promise<Preferences>;
}

export class DatabaseStorage implements IStorage {
  async getClothingItems(): Promise<ClothingItem[]> {
    return await db.select().from(clothingItems);
  }

  async getClothingItem(id: number): Promise<ClothingItem | undefined> {
    const [item] = await db.select().from(clothingItems).where(eq(clothingItems.id, id));
    return item;
  }

  async createClothingItem(item: InsertClothingItem): Promise<ClothingItem> {
    const [newItem] = await db.insert(clothingItems).values(item).returning();
    return newItem;
  }

  async deleteClothingItem(id: number): Promise<void> {
    await db.delete(clothingItems).where(eq(clothingItems.id, id));
  }

  async getOutfits(): Promise<Outfit[]> {
    return await db.select().from(outfits);
  }

  async createOutfit(outfit: InsertOutfit): Promise<Outfit> {
    const [newOutfit] = await db.insert(outfits).values(outfit).returning();
    return newOutfit;
  }

  async getPreferences(): Promise<Preferences | undefined> {
    const [pref] = await db.select().from(preferences);
    return pref;
  }

  async updatePreferences(prefs: InsertPreferences): Promise<Preferences> {
    await db.delete(preferences); // Clear existing preferences since we only want one
    const [newPrefs] = await db.insert(preferences).values(prefs).returning();
    return newPrefs;
  }
}

export const storage = new DatabaseStorage();