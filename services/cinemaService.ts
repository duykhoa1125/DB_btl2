import axiosClient from '@/lib/axiosClient';
import { Cinema } from './types';

const cinemaService = {
    /**
     * Get all cinemas
     */
    getAll: (): Promise<Cinema[]> => {
        return axiosClient.get('/cinemas');
    },

    /**
     * Get cinema by ID
     */
    getById: (id: string): Promise<Cinema> => {
        return axiosClient.get(`/cinemas/${id}`);
    },

    /**
     * Get only active cinemas
     */
    getActive: (): Promise<Cinema[]> => {
        return axiosClient.get('/cinemas', { params: { state: 'active' } });
    },

    /**
     * Create new cinema (admin)
     */
    create: (data: Omit<Cinema, 'cinema_id'>): Promise<Cinema> => {
        return axiosClient.post('/cinemas', data);
    },

    /**
     * Update cinema (admin)
     */
    update: (id: string, data: Partial<Omit<Cinema, 'cinema_id'>>): Promise<Cinema> => {
        return axiosClient.put(`/cinemas/${id}`, data);
    },

    /**
     * Delete cinema (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/cinemas/${id}`);
    },
};

export default cinemaService;
