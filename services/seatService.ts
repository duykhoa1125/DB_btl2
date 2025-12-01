import axiosClient from "@/lib/axiosClient";
import { Seat, SeatLayoutItem } from "./types";

const seatService = {
  /**
   * Get all seats in a room (via showtime endpoint)
   * Server endpoint: GET /showtimes/:showtimeId/seats
   */
  getByRoom: async (roomId: string): Promise<Seat[]> => {
    // Server không có endpoint /seats, nhưng có /showtimes/:id/seats
    // Tạm thời return empty array, vì cần showtimeId để lấy seats
    console.warn(
      "seatService.getByRoom: Server không hỗ trợ endpoint này. Cần sử dụng getByShowtime."
    );
    return [];
  },

  /**
   * Get seats for a specific showtime
   * Server endpoint: GET /showtimes/:showtimeId/seats
   */
  getByShowtime: async (showtimeId: string): Promise<Seat[]> => {
    const response = await axiosClient.get(`/showtimes/${showtimeId}/seats`);
    // Response format: { showtime_id, room: {room_id, name}, seats: [...] }
    return response.seats || [];
  },

  /**
   * Get seat layout with booking status for a specific showtime
   */
  getSeatLayout: (
    roomId: string,
    showtimeId: string
  ): Promise<SeatLayoutItem[]> => {
    return axiosClient.get("/seats/layout", {
      params: { room_id: roomId, showtime_id: showtimeId },
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
    state: "available" | "occupied" | "unavailable" | "reserved"
  ): Promise<Seat> => {
    return axiosClient.put(`/seats/${roomId}/${row}/${col}`, { state });
  },

  /**
   * Create seats for a room (admin)
   */
  createSeats: (
    roomId: string,
    seatsData: Omit<Seat, "room_id">[]
  ): Promise<Seat[]> => {
    return axiosClient.post("/seats", { room_id: roomId, seats: seatsData });
  },
};

export default seatService;
