import axiosClient from '@/lib/axiosClient';
import { Event } from './types';

const eventService = {
    /**
     * Get all events
     */
    getAll: (): Promise<Event[]> => {
        return axiosClient.get('/events');
    },

    /**
     * Get only active events (within date range)
     */
    getActive: (): Promise<Event[]> => {
        return axiosClient.get('/events/active');
    },

    /**
     * Get event by ID
     */
    getById: (id: string): Promise<Event> => {
        return axiosClient.get(`/events/${id}`);
    },

    /**
     * Get upcoming events
     */
    getUpcoming: (): Promise<Event[]> => {
        return axiosClient.get('/events/upcoming');
    },

    /**
     * Create event (admin)
     */
    create: (data: Omit<Event, 'event_id'>): Promise<Event> => {
        return axiosClient.post('/events', data);
    },

    /**
     * Update event (admin)
     */
    update: (id: string, data: Partial<Omit<Event, 'event_id'>>): Promise<Event> => {
        return axiosClient.put(`/events/${id}`, data);
    },

    /**
     * Delete event (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/events/${id}`);
    },
};

export default eventService;
