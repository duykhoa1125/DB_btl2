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
};

export default cinemaService;
