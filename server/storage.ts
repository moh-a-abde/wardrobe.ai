import { 
  ClothingItem, InsertClothingItem,
  Outfit, InsertOutfit,
  Preferences, InsertPreferences 
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private clothingItems: Map<number, ClothingItem>;
  private outfits: Map<number, Outfit>;
  private preferences: Preferences | undefined;
  private currentItemId: number;
  private currentOutfitId: number;
  private currentPrefId: number;

  constructor() {
    this.clothingItems = new Map();
    this.outfits = new Map();
    this.currentItemId = 1;
    this.currentOutfitId = 1;
    this.currentPrefId = 1;
  }

  async getClothingItems(): Promise<ClothingItem[]> {
    return Array.from(this.clothingItems.values());
  }

  async getClothingItem(id: number): Promise<ClothingItem | undefined> {
    return this.clothingItems.get(id);
  }

  async createClothingItem(item: InsertClothingItem): Promise<ClothingItem> {
    const id = this.currentItemId++;
    const newItem = { ...item, id };
    this.clothingItems.set(id, newItem);
    return newItem;
  }

  async deleteClothingItem(id: number): Promise<void> {
    this.clothingItems.delete(id);
  }

  async getOutfits(): Promise<Outfit[]> {
    return Array.from(this.outfits.values());
  }

  async createOutfit(outfit: InsertOutfit): Promise<Outfit> {
    const id = this.currentOutfitId++;
    const newOutfit = { 
      ...outfit, 
      id,
      createdAt: new Date()
    };
    this.outfits.set(id, newOutfit);
    return newOutfit;
  }

  async getPreferences(): Promise<Preferences | undefined> {
    return this.preferences;
  }

  async updatePreferences(prefs: InsertPreferences): Promise<Preferences> {
    const id = this.currentPrefId;
    this.preferences = { ...prefs, id };
    return this.preferences;
  }
}

export const storage = new MemStorage();
