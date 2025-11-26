import axiosClient from '@/lib/axiosClient';
import { Seat, SeatLayoutItem } from './types';

const seatService = {
    /**
     * Get all seats in a room
     */
    getByRoom: (roomId: string): Promise<Seat[]> => {
        return axiosClient.get('/seats', { params: { room_id: roomId } });
    },

    /**
     * Get seat layout with booking status for a specific showtime
     */
    getSeatLayout: (roomId: string, showtimeId: string): Promise<SeatLayoutItem[]> => {
        return axiosClient.get('/seats/layout', {
            params: { room_id: roomId, showtime_id: showtimeId }
        });
    },

    /**
     * Get specific seat
     */
    getSeat: (roomId: string, row: string, col: number): Promise<Seat> => {
        return axiosClient.get(`/seats/${roomId}/${row}/${col}`);
    },

    /**
     * Update seat state (admin)
     */
    updateSeatState: (
        roomId: string,
        row: string,
        col: number,
        state: 'available' | 'occupied' | 'unavailable' | 'reserved'
    ): Promise<Seat> => {
        return axiosClient.put(`/seats/${roomId}/${row}/${col}`, { state });
    },

    /**
     * Create seats for a room (admin)
     */
    createSeats: (roomId: string, seatsData: Omit<Seat, 'room_id'>[]): Promise<Seat[]> => {
        return axiosClient.post('/seats', { room_id: roomId, seats: seatsData });
    },
};

export default seatService;
