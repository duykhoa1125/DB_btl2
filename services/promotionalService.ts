import axiosClient from '@/lib/axiosClient';
import { Promotional, Discount, Gift } from './types';

const promotionalService = {
    /**
     * Get all promotionals
     */
    getAll: (): Promise<Promotional[]> => {
        return axiosClient.get('/promotionals');
    },

    /**
     * Get promotional by ID
     */
    getById: (id: string): Promise<Promotional> => {
        return axiosClient.get(`/promotionals/${id}`);
    },

    /**
     * Get promotionals for a specific event
     */
    getByEvent: (eventId: string): Promise<Promotional[]> => {
        return axiosClient.get('/promotionals', { params: { event_id: eventId } });
    },

    /**
     * Get promotionals for a specific membership level
     */
    getByMemberLevel: (level: 'copper' | 'gold' | 'diamond' | 'vip'): Promise<Promotional[]> => {
        return axiosClient.get('/promotionals', { params: { level } });
    },

    /**
     * Get active promotionals
     */
    getActive: (): Promise<Promotional[]> => {
        return axiosClient.get('/promotionals/active');
    },

    /**
     * Get discount details for a promotional
     */
    getDiscounts: (promotionalId: string): Promise<Discount[]> => {
        return axiosClient.get(`/promotionals/${promotionalId}/discounts`);
    },

    /**
     * Get gift details for a promotional
     */
    getGifts: (promotionalId: string): Promise<Gift[]> => {
        return axiosClient.get(`/promotionals/${promotionalId}/gifts`);
    },

    /**
     * Create promotional (admin)
     */
    create: (data: Omit<Promotional, 'promotional_id'>): Promise<Promotional> => {
        return axiosClient.post('/promotionals', data);
    },

    /**
     * Update promotional (admin)
     */
    update: (id: string, data: Partial<Omit<Promotional, 'promotional_id'>>): Promise<Promotional> => {
        return axiosClient.put(`/promotionals/${id}`, data);
    },

    /**
     * Delete promotional (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/promotionals/${id}`);
    },
};

export default promotionalService;
