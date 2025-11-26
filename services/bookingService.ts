import axiosClient from '@/lib/axiosClient';
import { Bill, Ticket, Food } from './types';
import { BookingRequest } from './types';

interface CreateBookingPayload extends BookingRequest {
    // All fields from BookingRequest
}

interface BookingResponse {
    bill: Bill;
    tickets: Ticket[];
    foods: Food[];
}

const bookingService = {
    /**
     * Create complete booking (bill + tickets + foods)
     */
    createBooking: (data: CreateBookingPayload): Promise<BookingResponse> => {
        return axiosClient.post('/bookings', data);
    },

    /**
     * Get user's booking history
     */
    getMyBookings: (phoneNumber: string): Promise<BookingResponse[]> => {
        return axiosClient.get(`/bookings/user/${phoneNumber}`);
    },

    /**
     * Get booking details by bill ID
     */
    getBookingById: (billId: string): Promise<BookingResponse> => {
        return axiosClient.get(`/bookings/${billId}`);
    },

    /**
     * Cancel a booking
     */
    cancelBooking: (billId: string): Promise<void> => {
        return axiosClient.delete(`/bookings/${billId}`);
    },

    /**
     * Get all bookings (admin)
     */
    getAllBookings: (): Promise<BookingResponse[]> => {
        return axiosClient.get('/bookings');
    },

    /**
     * Get bookings by date range (admin)
     */
    getBookingsByDateRange: (startDate: string, endDate: string): Promise<BookingResponse[]> => {
        return axiosClient.get('/bookings', { params: { start_date: startDate, end_date: endDate } });
    },
};

export default bookingService;
