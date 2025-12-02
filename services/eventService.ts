import axiosClient from '@/lib/axiosClient';
import { Event } from './types';

const eventService = {
    /**
     * Get all events
     */
    getAll: (): Promise<Event[]> => {
        return axiosClient.get('/promotions/events');
    },
    /**
     * Get event by ID
     */
    getById: (id: string): Promise<Event> => {
        return axiosClient.get(`/promotions/events/${id}/promotions`);
    },
};

export default eventService;
