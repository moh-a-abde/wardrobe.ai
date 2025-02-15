import { 
  ClothingItem, InsertClothingItem,
  Outfit, InsertOutfit,
  ScheduledOutfit, InsertScheduledOutfit,
  Preferences, InsertPreferences,
  ProductRecommendation, InsertProductRecommendation,
  FashionTrend, InsertFashionTrend,
  clothingItems, outfits, scheduledOutfits, preferences,
  productRecommendations, fashionTrends
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Clothing Items
  getClothingItems(): Promise<ClothingItem[]>;
  getClothingItem(id: number): Promise<ClothingItem | undefined>;
  createClothingItem(item: InsertClothingItem): Promise<ClothingItem>;
  deleteClothingItem(id: number): Promise<void>;

  // Outfits
  getOutfits(): Promise<Outfit[]>;
  createOutfit(outfit: InsertOutfit): Promise<Outfit>;

  // Scheduled Outfits
  getScheduledOutfits(startDate: Date, endDate: Date): Promise<ScheduledOutfit[]>;
  scheduleOutfit(scheduledOutfit: InsertScheduledOutfit): Promise<ScheduledOutfit>;
  unscheduleOutfit(id: number): Promise<void>;

  // Preferences
  getPreferences(): Promise<Preferences | undefined>;
  updatePreferences(prefs: InsertPreferences): Promise<Preferences>;

  // Product Recommendations
  getProductRecommendations(): Promise<ProductRecommendation[]>;
  createProductRecommendation(recommendation: InsertProductRecommendation): Promise<ProductRecommendation>;
  deleteProductRecommendation(id: number): Promise<void>;

  // Fashion Trends
  getFashionTrends(): Promise<FashionTrend[]>;
  createFashionTrend(trend: InsertFashionTrend): Promise<FashionTrend>;
  deleteFashionTrend(id: number): Promise<void>;
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

  async getScheduledOutfits(startDate: Date, endDate: Date): Promise<ScheduledOutfit[]> {
    return await db
      .select()
      .from(scheduledOutfits)
      .where(
        and(
          gte(scheduledOutfits.date, startDate),
          lte(scheduledOutfits.date, endDate)
        )
      );
  }

  async scheduleOutfit(scheduledOutfit: InsertScheduledOutfit): Promise<ScheduledOutfit> {
    const [newScheduledOutfit] = await db
      .insert(scheduledOutfits)
      .values(scheduledOutfit)
      .returning();
    return newScheduledOutfit;
  }

  async unscheduleOutfit(id: number): Promise<void> {
    await db.delete(scheduledOutfits).where(eq(scheduledOutfits.id, id));
  }

  async getPreferences(): Promise<Preferences | undefined> {
    const [pref] = await db.select().from(preferences);
    return pref;
  }

  async updatePreferences(prefs: InsertPreferences): Promise<Preferences> {
    await db.delete(preferences); 
    const [newPrefs] = await db.insert(preferences).values(prefs).returning();
    return newPrefs;
  }

  // Product Recommendations
  async getProductRecommendations(): Promise<ProductRecommendation[]> {
    return await db.select().from(productRecommendations);
  }

  async createProductRecommendation(recommendation: InsertProductRecommendation): Promise<ProductRecommendation> {
    const [newRecommendation] = await db
      .insert(productRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async deleteProductRecommendation(id: number): Promise<void> {
    await db.delete(productRecommendations).where(eq(productRecommendations.id, id));
  }

  // Fashion Trends
  async getFashionTrends(): Promise<FashionTrend[]> {
    return await db
      .select()
      .from(fashionTrends)
      .where(
        and(
          lte(fashionTrends.validFrom, new Date()),
          gte(fashionTrends.validTo, new Date())
        )
      );
  }

  async createFashionTrend(trend: InsertFashionTrend): Promise<FashionTrend> {
    const [newTrend] = await db
      .insert(fashionTrends)
      .values(trend)
      .returning();
    return newTrend;
  }

  async deleteFashionTrend(id: number): Promise<void> {
    await db.delete(fashionTrends).where(eq(fashionTrends.id, id));
  }
}

export const storage = new DatabaseStorage();