import axiosClient from "@/lib/axiosClient";
import type { Movie, Cinema, Showtime, Bill } from "./types";

interface DashboardStats {
  total_movies: number;
  now_showing: number;
  coming_soon: number;
  total_cinemas: number;
  monthly_revenue: number;
  bookings_this_month: number;
}

export interface TopRevenueMovie {
  ma_phim: string;
  ten_phim: string;
  doanh_thu: number;
}

const adminService = {
  // ============ MOVIES CRUD ============

  /**
   * Get all movies (admin)
   * Note: Backend admin_service doesn't have getAll, so we rely on public movie endpoint or assume this calls a valid endpoint.
   */
  getAllMovies: (): Promise<Movie[]> => {
    return axiosClient.get("/movies");
  },

  /**
   * Create new movie (admin)
   */
  createMovie: (
    data: Omit<Movie, "movie_id">,
    directors?: string[],
    actors?: string[]
  ): Promise<Movie> => {
    // Map frontend fields to backend fields
    const backendData = {
      title: data.name,
      duration: data.duration,
      releaseDate: data.release_date,
      endDate: data.end_date,
      ageRating: data.age_rating,
      trailer: data.trailer,
      language: data.language,
      status: data.status,
      summary: data.synopsis,
      image: data.image,
      directors: directors || [],
      actors: actors || [],
    };
    return axiosClient.post("/admin/movies", backendData);
  },

  /**
   * Update movie (admin)
   */
  updateMovie: (
    id: string,
    data: Partial<Omit<Movie, "movie_id">>,
    directors?: string[],
    actors?: string[]
  ): Promise<Movie> => {
    const backendData: any = {};
    if (data.name !== undefined) backendData.title = data.name;
    if (data.duration !== undefined) backendData.duration = data.duration;
    if (data.release_date !== undefined)
      backendData.releaseDate = data.release_date;
    if (data.end_date !== undefined) backendData.endDate = data.end_date;
    if (data.age_rating !== undefined) backendData.ageRating = data.age_rating;
    if (data.trailer !== undefined) backendData.trailer = data.trailer;
    if (data.language !== undefined) backendData.language = data.language;
    if (data.status !== undefined) backendData.status = data.status;
    if (data.synopsis !== undefined) backendData.summary = data.synopsis;
    if (data.image !== undefined) backendData.image = data.image;
    if (directors !== undefined) backendData.directors = directors;
    if (actors !== undefined) backendData.actors = actors;

    return axiosClient.put(`/admin/movies/${id}`, backendData);
  },

  /**
   * Delete movie (admin)
   */
  deleteMovie: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/movies/${id}`);
  },

  // ============ CINEMAS CRUD ============

  /**
   * Get all cinemas (admin)
   */
  getAllCinemas: async (): Promise<Cinema[]> => {
    const data = await axiosClient.get("/cinemas");
    // Map backend fields (id, status) to frontend fields (cinema_id, state)
    if (Array.isArray(data)) {
      return data.map((cinema: any) => ({
        cinema_id: cinema.id || cinema.cinema_id,
        name: cinema.name,
        state: cinema.status || cinema.state,
        address: cinema.address,
      }));
    }
    return [];
  },

  /**
   * Get cinema by ID (admin)
   */
  getCinemaById: async (id: string): Promise<Cinema> => {
    const data: any = await axiosClient.get(`/cinemas/${id}`);
    // Map backend fields (id, status) to frontend fields (cinema_id, state)
    return {
      cinema_id: data.id || data.cinema_id,
      name: data.name,
      state: data.status || data.state,
      address: data.address,
    };
  },

  /**
   * Create new cinema (admin)
   */
  createCinema: (data: Omit<Cinema, "cinema_id">): Promise<Cinema> => {
    // Backend expects: name, status, address
    const backendData = {
      name: data.name,
      status: "active", // Default or from data if available
      address: data.address,
    };
    return axiosClient.post("/admin/cinemas", backendData);
  },

  /**
   * Update cinema (admin)
   */
  updateCinema: (
    id: string,
    data: Partial<Omit<Cinema, "cinema_id">>
  ): Promise<Cinema> => {
    // Map frontend fields to backend fields
    const backendData: any = {};
    if (data.name !== undefined) backendData.name = data.name;
    if (data.address !== undefined) backendData.address = data.address;
    if (data.state !== undefined) backendData.status = data.state; // Frontend uses 'state', backend uses 'status'

    return axiosClient.put(`/admin/cinemas/${id}`, backendData);
  },

  /**
   * Delete cinema (admin)
   */
  deleteCinema: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/cinemas/${id}`);
  },

  // ============ SHOWTIMES CRUD ============

  /**
   * Get all showtimes (admin)
   */
  getAllShowtimes: (): Promise<Showtime[]> => {
    return axiosClient.get("/showtimes");
  },

  /**
   * Get showtime by ID (admin)
   */
  getShowtimeById: async (id: string): Promise<Showtime> => {
    const response: any = await axiosClient.get(`/admin/showtimes/${id}`);
    // Format date for input
    if (response.start_date) {
      const date = new Date(response.start_date);
      response.start_date = date.toISOString().split("T")[0];
    }
    return response as Showtime;
  },

  /**
   * Create new showtime (admin)
   */
  createShowtime: (data: Omit<Showtime, "showtime_id">): Promise<Showtime> => {
    // Backend expects: roomId, movieId, date, startTime, endTime
    const backendData = {
      roomId: data.room_id,
      movieId: data.movie_id,
      date: data.start_date,
      startTime: data.start_time,
      endTime: data.end_time,
    };
    return axiosClient.post("/admin/showtimes", backendData);
  },

  /**
   * Update showtime (admin)
   */
  updateShowtime: (
    id: string,
    data: Partial<Omit<Showtime, "showtime_id">>
  ): Promise<Showtime> => {
    const backendData: any = {};
    if (data.room_id) backendData.roomId = data.room_id;
    if (data.movie_id) backendData.movieId = data.movie_id;
    if (data.start_date) backendData.date = data.start_date;
    if (data.start_time) backendData.startTime = data.start_time;
    if (data.end_time) backendData.endTime = data.end_time;

    return axiosClient.put(`/admin/showtimes/${id}`, backendData);
  },

  /**
   * Delete showtime (admin)
   */
  deleteShowtime: (id: string): Promise<void> => {
    return axiosClient.delete(`/admin/showtimes/${id}`);
  },

  // ============ STATISTICS ============

  /**
   * Get dashboard statistics (admin)
   */
  getDashboardStats: (): Promise<DashboardStats> => {
    return axiosClient.get("/admin/stats");
  },

  getTopRevenue: (): Promise<TopRevenueMovie[]> => {
    return axiosClient.get("/movies/top-revenue");
  },
};

export default adminService;
