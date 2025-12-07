import axiosClient from "@/lib/axiosClient";
import { SeatLayoutItem } from "./types";

const seatService = {
  /**
   * Get seats for a specific showtime
   * Server endpoint: GET /showtimes/:showtimeId/seats
   */
  getByShowtime: async (showtimeId: string): Promise<SeatLayoutItem[]> => {
    const response = (await axiosClient.get(
      `/showtimes/${showtimeId}/seats`
    )) as any;
    // Response format: { showtime_id, room: {room_id, name}, seats: [...] }
    return response.seats || [];
  },
};

export default seatService;
