import axiosClient from '@/lib/axiosClient';
import { Bill, Ticket, Food } from './types';

const billService = {
    /**
     * Get all bills (admin)
     */
    getAll: (): Promise<Bill[]> => {
        return axiosClient.get('/bills');
    },

    /**
     * Get bill by ID
     */
    getById: (id: string): Promise<Bill> => {
        return axiosClient.get(`/bills/${id}`);
    },

    /**
     * Get bills by user phone number
     */
    getByUser: (phoneNumber: string): Promise<Bill[]> => {
        return axiosClient.get('/bills', { params: { phone_number: phoneNumber } });
    },

    /**
     * Get tickets for a specific bill
     */
    getTickets: (billId: string): Promise<Ticket[]> => {
        return axiosClient.get(`/bills/${billId}/tickets`);
    },

    /**
     * Get food items for a specific bill
     */
    getFoods: (billId: string): Promise<Food[]> => {
        return axiosClient.get(`/bills/${billId}/foods`);
    },

    /**
     * Get bills by date range (admin)
     */
    getByDateRange: (startDate: string, endDate: string): Promise<Bill[]> => {
        return axiosClient.get('/bills', {
            params: { start_date: startDate, end_date: endDate }
        });
    },

    /**
     * Calculate revenue statistics (admin)
     */
    getRevenue: (year: number, month?: number): Promise<{ total: number; count: number }> => {
        return axiosClient.get('/bills/revenue', { params: { year, month } });
    },
};

export default billService;
