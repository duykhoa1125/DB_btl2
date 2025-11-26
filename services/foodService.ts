import axiosClient from '@/lib/axiosClient';
import { Food } from './types';

interface FoodMenuItem {
    food_id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    available: boolean;
}

const foodService = {
    /**
     * Get all food menu items
     */
    getAllMenuItems: (): Promise<FoodMenuItem[]> => {
        return axiosClient.get('/foods/menu');
    },

    /**
     * Get available food items
     */
    getAvailableItems: (): Promise<FoodMenuItem[]> => {
        return axiosClient.get('/foods/menu', { params: { available: true } });
    },

    /**
     * Get food items by category
     */
    getByCategory: (category: string): Promise<FoodMenuItem[]> => {
        return axiosClient.get('/foods/menu', { params: { category } });
    },

    /**
     * Get food items for a specific bill
     */
    getByBill: (billId: string): Promise<Food[]> => {
        return axiosClient.get('/foods', { params: { bill_id: billId } });
    },

    /**
     * Create food menu item (admin)
     */
    createMenuItem: (data: Omit<FoodMenuItem, 'food_id'>): Promise<FoodMenuItem> => {
        return axiosClient.post('/foods/menu', data);
    },

    /**
     * Update food menu item (admin)
     */
    updateMenuItem: (id: string, data: Partial<Omit<FoodMenuItem, 'food_id'>>): Promise<FoodMenuItem> => {
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
