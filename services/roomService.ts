import axiosClient from '@/lib/axiosClient';
import { Room } from './types';

const roomService = {
    /**
     * Get all rooms
     */
    getAll: (): Promise<Room[]> => {
        return axiosClient.get('/rooms');
    },

    /**
     * Get rooms for a specific cinema
     */
    getByCinema: (cinemaId: string): Promise<Room[]> => {
        return axiosClient.get('/rooms', { params: { cinema_id: cinemaId } });
    },

    /**
     * Get room by ID
     */
    getById: (id: string): Promise<Room> => {
        return axiosClient.get(`/rooms/${id}`);
    },

    /**
     * Create new room (admin)
     */
    create: (data: Omit<Room, 'room_id'>): Promise<Room> => {
        return axiosClient.post('/rooms', data);
    },

    /**
     * Update room (admin)
     */
    update: (id: string, data: Partial<Omit<Room, 'room_id'>>): Promise<Room> => {
        return axiosClient.put(`/rooms/${id}`, data);
    },

    /**
     * Delete room (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/rooms/${id}`);
    },
};

export default roomService;
