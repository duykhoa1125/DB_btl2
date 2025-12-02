import axiosClient from "@/lib/axiosClient";
import { Seat, SeatLayoutItem } from "./types";

const seatService = {
  /**
   * Get seats for a specific showtime
   * Server endpoint: GET /showtimes/:showtimeId/seats
   */
  getByShowtime: async (showtimeId: string): Promise<Seat[]> => {
    const response = await axiosClient.get(`/showtimes/${showtimeId}/seats`);
    // Response format: { showtime_id, room: {room_id, name}, seats: [...] }
    return response.seats || [];
  },
};

export default seatService;
