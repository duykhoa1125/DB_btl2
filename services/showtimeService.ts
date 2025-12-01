import axiosClient from "@/lib/axiosClient";
import { Showtime, ShowtimeDetail, SeatLayoutItem } from "./types";

const showtimeService = {
  /**
   * Get all showtimes
   */
  getAll: (): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes");
  },

  /**
   * Get showtime by ID (sử dụng getAll với filter)
   * Server không có endpoint riêng cho single showtime
   */
  getById: async (id: string): Promise<Showtime | null> => {
    const showtimes = await axiosClient.get("/showtimes");
    const showtimeArray = Array.isArray(showtimes) ? showtimes : [];
    return showtimeArray.find((s: Showtime) => s.showtime_id === id) || null;
  },

  /**
   * Get showtimes for a specific movie
   */
  getByMovie: (movieId: string): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes", { params: { movie_id: movieId } });
  },

  /**
   * Get showtimes for a specific cinema
   */
  getByCinema: (cinemaId: string): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes", { params: { cinema_id: cinemaId } });
  },

  /**
   * Get showtimes for a specific room
   */
  getByRoom: (roomId: string): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes", { params: { room_id: roomId } });
  },

  /**
   * Get showtimes for a specific date
   */
  getByDate: (date: string): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes", { params: { date } });
  },

  /**
   * Get showtime with full details (cinema, room, movie info)
   */
  getWithDetails: (id: string): Promise<ShowtimeDetail> => {
    return axiosClient.get(`/showtimes/${id}/details`);
  },

  /**
   * Get available seats for a showtime
   */
  getAvailableSeats: (showtimeId: string): Promise<SeatLayoutItem[]> => {
    return axiosClient.get(`/showtimes/${showtimeId}/seats`);
  },

  /**
   * Create new showtime (admin)
   */
  create: (data: Omit<Showtime, "showtime_id">): Promise<Showtime> => {
    return axiosClient.post("/showtimes", data);
  },

  /**
   * Update showtime (admin)
   */
  update: (
    id: string,
    data: Partial<Omit<Showtime, "showtime_id">>
  ): Promise<Showtime> => {
    return axiosClient.put(`/showtimes/${id}`, data);
  },

  /**
   * Delete showtime (admin)
   */
  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/showtimes/${id}`);
  },
};

export default showtimeService;
