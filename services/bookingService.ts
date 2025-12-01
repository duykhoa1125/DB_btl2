import axiosClient from "@/lib/axiosClient";
import { Bill, Ticket, Food } from "./types";
import { BookingRequest } from "./types";

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
  createBooking: async (
    data: CreateBookingPayload
  ): Promise<BookingResponse> => {
    const response: any = await axiosClient.post("/booking", data);

    // Validate response - nếu không có hoặc không đúng format thì throw error
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response from server");
    }

    // Response đã được unwrap bởi axiosClient interceptor
    // Backend trả về Bill object với format: { id, phone, createdAt, total }
    return {
      bill: {
        bill_id: response.id ?? "",
        phone_number: response.phone ?? "",
        creation_date: response.createdAt ?? new Date().toISOString(),
        total_price: response.total ?? 0,
      },
      tickets: [],
      foods: [],
    };
  },

  /**
   * Get user's booking history
   */

  getMyBookings: async (): Promise<BookingResponse[]> => {
    const response: any[] = await axiosClient.get("/booking/history");
    return response.map((item) => ({
      bill: {
        bill_id: item.id,
        phone_number: item.phone,
        creation_date: item.createdAt,
        total_price: item.total,
      },
      tickets: [],
      foods: [],
    }));
  },

  /**
   * Get booking details by bill ID
   */
  // getBookingById: (billId: string): Promise<BookingResponse> => {
  //     return axiosClient.get(`/booking/${billId}`);
  // },

  /**
   * Cancel a booking
   */
  // cancelBooking: (billId: string): Promise<void> => {
  //     return axiosClient.delete(`/booking/${billId}`);
  // },

  /**
   * Get all bookings (admin)
   */
  // getAllBookings: (): Promise<BookingResponse[]> => {
  //     return axiosClient.get('/booking');
  // },

  /**
   * Get bookings by date range (admin)
   */
  // getBookingsByDateRange: (startDate: string, endDate: string): Promise<BookingResponse[]> => {
  //     return axiosClient.get('/booking', { params: { start_date: startDate, end_date: endDate } });
  // },
};

export default bookingService;
