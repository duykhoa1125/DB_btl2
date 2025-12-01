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
  food_id: item.ma_do_an ,
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
    //   if (items.length === 0) {
    //     return defaultFoodMenu;
    //   }
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
    //   return defaultFoodMenu;
    }
  },

  /**
   * Get available food items
   */
  getAvailableItems: async (): Promise<FoodMenuItem[]> => {
    return foodService.getAllMenuItems();
  },

  /**
   * Get food items by category
   */
  getByCategory: (category: string): Promise<FoodMenuItem[]> => {
    return axiosClient.get("/foods/menu", { params: { category } });
  },

  /**
   * Get food items for a specific bill
   */
  getByBill: (billId: string): Promise<Food[]> => {
    return axiosClient.get("/foods", { params: { bill_id: billId } });
  },

  /**
   * Create food menu item (admin)
   */
  createMenuItem: (
    data: Omit<FoodMenuItem, "food_id">
  ): Promise<FoodMenuItem> => {
    return axiosClient.post("/foods/menu", data);
  },

  /**
   * Update food menu item (admin)
   */
  updateMenuItem: (
    id: string,
    data: Partial<Omit<FoodMenuItem, "food_id">>
  ): Promise<FoodMenuItem> => {
    return axiosClient.put(`/foods/menu/${id}`, data);
  },

  /**
   * Delete food menu item (admin)
   */
  deleteMenuItem: (id: string): Promise<void> => {
    return axiosClient.delete(`/foods/menu/${id}`);
  },
};

export default foodService;
