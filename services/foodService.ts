import axiosClient from "@/lib/axiosClient";
import { Food } from "./types";

export interface FoodMenuItem {
  food_id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  available?: boolean;
}

// Map từ cấu trúc database DoAn sang FoodMenuItem
const mapToFoodMenuItem = (item: any): FoodMenuItem => ({
  food_id: item.ma_do_an,
  name: item.ten_do_an,
  description: item.mo_ta,
  price: item.gia_ban,
  available: true,
});

const foodService = {
  /**
   * Get all food menu items
   * Server endpoint: GET /other/foods/menu
   * Falls back to default menu if API fails or returns empty
   */
  getAllMenuItems: async (): Promise<FoodMenuItem[]> => {
    try {
      const data = await axiosClient.get("/other/foods/menu");
      const items = Array.isArray(data) ? data : [];
      // Dedupe by name to create a menu from sold items
      const uniqueItems = new Map<string, FoodMenuItem>();
      items.forEach((item: any) => {
        const mapped = mapToFoodMenuItem(item);
        if (!uniqueItems.has(mapped.name)) {
          uniqueItems.set(mapped.name, mapped);
        }
      });
      return Array.from(uniqueItems.values());
    } catch (error) {
      console.warn("Failed to fetch food menu, using defaults:", error);
      return [];
    }
  },

  /**
   * Get available food items
   */
  getAvailableItems: async (): Promise<FoodMenuItem[]> => {
    return foodService.getAllMenuItems();
  },
};

export default foodService;
