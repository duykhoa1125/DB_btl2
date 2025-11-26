import axiosClient from '@/lib/axiosClient';
import { Ticket } from './types';

const ticketService = {
    /**
     * Get all tickets (admin)
     */
    getAll: (): Promise<Ticket[]> => {
        return axiosClient.get('/tickets');
    },

    /**
     * Get ticket by ID
     */
    getById: (id: string): Promise<Ticket> => {
        return axiosClient.get(`/tickets/${id}`);
    },

    /**
     * Get tickets for a specific bill
     */
    getByBill: (billId: string): Promise<Ticket[]> => {
        return axiosClient.get('/tickets', { params: { bill_id: billId } });
    },

    /**
     * Get tickets for a specific user
     */
    getByUser: (phoneNumber: string): Promise<Ticket[]> => {
        return axiosClient.get('/tickets', { params: { phone_number: phoneNumber } });
    },

    /**
     * Get tickets for a specific showtime
     */
    getByShowtime: (showtimeId: string): Promise<Ticket[]> => {
        return axiosClient.get('/tickets', { params: { showtime_id: showtimeId } });
    },

    /**
     * Get tickets for a specific movie
     */
    getByMovie: (movieName: string): Promise<Ticket[]> => {
        return axiosClient.get('/tickets', { params: { movie_name: movieName } });
    },

    /**
     * Get upcoming tickets for a user
     */
    getUpcoming: (phoneNumber: string): Promise<Ticket[]> => {
        return axiosClient.get('/tickets/upcoming', { params: { phone_number: phoneNumber } });
    },

    /**
     * Verify ticket validity
     */
    verify: (ticketId: string): Promise<{ valid: boolean; message: string }> => {
        return axiosClient.get(`/tickets/${ticketId}/verify`);
    },
};

export default ticketService;
