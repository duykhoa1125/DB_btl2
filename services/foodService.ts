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

// Menu mặc định khi không có dữ liệu từ server
// const defaultFoodMenu: FoodMenuItem[] = [
//   {
//     food_id: "FOOD001",
//     name: "Combo A",
//     description: "1 bỏng + 1 nước",
//     price: 60000,
//     available: true,
//   },
//   {
//     food_id: "FOOD002",
//     name: "Combo B",
//     description: "2 bỏng + 2 nước",
//     price: 110000,
//     available: true,
//   },
//   {
//     food_id: "FOOD003",
//     name: "Combo C",
//     description: "1 bỏng + 1 nước + 1 snack",
//     price: 75000,
//     available: true,
//   },
//   {
//     food_id: "FOOD004",
//     name: "Bỏng caramel",
//     description: "Bỏng ngọt vị caramel",
//     price: 45000,
//     available: true,
//   },
//   {
//     food_id: "FOOD005",
//     name: "Bỏng phô mai",
//     description: "Bỏng vị phô mai đậm đà",
//     price: 50000,
//     available: true,
//   },
//   {
//     food_id: "FOOD006",
//     name: "Nước ngọt",
//     description: "Coca cola size L",
//     price: 25000,
//     available: true,
//   },
//   {
//     food_id: "FOOD007",
//     name: "Nước trái cây",
//     description: "Nước ép cam tươi",
//     price: 35000,
//     available: true,
//   },
// ];

// Map từ cấu trúc database DoAn sang FoodMenuItem
const mapToFoodMenuItem = (item: any): FoodMenuItem => ({
  food_id: item.ma_do_an || `FOOD_${Math.random().toString(36).substr(2, 9)}`,
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
