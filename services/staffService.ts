import axiosClient from '@/lib/axiosClient';
import { Staff } from './types';

const staffService = {
    /**
     * Get all staff
     */
    getAll: (): Promise<Staff[]> => {
        return axiosClient.get('/staff');
    },

    /**
     * Get staff for a specific cinema
     */
    getByCinema: (cinemaId: string): Promise<Staff[]> => {
        return axiosClient.get('/staff', { params: { cinema_id: cinemaId } });
    },

    /**
     * Get staff by ID
     */
    getById: (id: string): Promise<Staff> => {
        return axiosClient.get(`/staff/${id}`);
    },

    /**
     * Get staff managed by a specific manager
     */
    getByManager: (managerId: string): Promise<Staff[]> => {
        return axiosClient.get('/staff', { params: { manage_id: managerId } });
    },

    /**
     * Create staff (admin)
     */
    create: (data: Omit<Staff, 'staff_id'>): Promise<Staff> => {
        return axiosClient.post('/staff', data);
    },

    /**
     * Update staff (admin)
     */
    update: (id: string, data: Partial<Omit<Staff, 'staff_id'>>): Promise<Staff> => {
        return axiosClient.put(`/staff/${id}`, data);
    },

    /**
     * Delete staff (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/staff/${id}`);
    },

    /**
     * Assign manager to staff (admin)
     */
    assignManager: (staffId: string, managerId: string): Promise<Staff> => {
        return axiosClient.put(`/staff/${staffId}/manager`, { manage_id: managerId });
    },
};

export default staffService;
