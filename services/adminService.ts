import axiosClient from '@/lib/axiosClient';
import type { Movie, Cinema, Showtime, Bill } from './types';

interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    topMovies: Array<{
        movie: Movie;
        revenue: number;
    }>;
    monthlyRevenue: number;
}

const adminService = {
    // ============ MOVIES CRUD ============

    /**
     * Get all movies (admin)
     */
    getAllMovies: (): Promise<Movie[]> => {
        return axiosClient.get('/movies');
    },

    /**
     * Get movie by ID (admin)
     */
    getMovieById: (id: string): Promise<Movie> => {
        return axiosClient.get(`/movies/${id}`);
    },

    /**
     * Create new movie (admin)
     */
    createMovie: (data: Omit<Movie, 'movie_id'>): Promise<Movie> => {
        return axiosClient.post('/movies', data);
    },

    /**
     * Update movie (admin)
     */
    updateMovie: (id: string, data: Partial<Omit<Movie, 'movie_id'>>): Promise<Movie> => {
        return axiosClient.put(`/movies/${id}`, data);
    },

    /**
     * Delete movie (admin)
     */
    deleteMovie: (id: string): Promise<void> => {
        return axiosClient.delete(`/movies/${id}`);
    },

    // ============ CINEMAS CRUD ============

    /**
     * Get all cinemas (admin)
     */
    getAllCinemas: (): Promise<Cinema[]> => {
        return axiosClient.get('/cinemas');
    },

    /**
     * Get cinema by ID (admin)
     */
    getCinemaById: (id: string): Promise<Cinema> => {
        return axiosClient.get(`/cinemas/${id}`);
    },

    /**
     * Create new cinema (admin)
     */
    createCinema: (data: Omit<Cinema, 'cinema_id'>): Promise<Cinema> => {
        return axiosClient.post('/cinemas', data);
    },

    /**
     * Update cinema (admin)
     */
    updateCinema: (id: string, data: Partial<Omit<Cinema, 'cinema_id'>>): Promise<Cinema> => {
        return axiosClient.put(`/cinemas/${id}`, data);
    },

    /**
     * Delete cinema (admin)
     */
    deleteCinema: (id: string): Promise<void> => {
        return axiosClient.delete(`/cinemas/${id}`);
    },

    // ============ SHOWTIMES CRUD ============

    /**
     * Get all showtimes (admin)
     */
    getAllShowtimes: (): Promise<Showtime[]> => {
        return axiosClient.get('/showtimes');
    },

    /**
     * Get showtime by ID (admin)
     */
    getShowtimeById: (id: string): Promise<Showtime> => {
        return axiosClient.get(`/showtimes/${id}`);
    },

    /**
     * Create new showtime (admin)
     */
    createShowtime: (data: Omit<Showtime, 'showtime_id'>): Promise<Showtime> => {
        return axiosClient.post('/showtimes', data);
    },

    /**
     * Update showtime (admin)
     */
    updateShowtime: (id: string, data: Partial<Omit<Showtime, 'showtime_id'>>): Promise<Showtime> => {
        return axiosClient.put(`/showtimes/${id}`, data);
    },

    /**
     * Delete showtime (admin)
     */
    deleteShowtime: (id: string): Promise<void> => {
        return axiosClient.delete(`/showtimes/${id}`);
    },

    // ============ STATISTICS ============

    /**
     * Get monthly revenue (admin)
     */
    getMonthlyRevenue: (year: number, month: number): Promise<number> => {
        return axiosClient.get('/admin/stats/monthly-revenue', {
            params: { year, month }
        });
    },

    /**
     * Get total bookings this month (admin)
     */
    getTotalBookingsThisMonth: (): Promise<number> => {
        return axiosClient.get('/admin/stats/bookings-this-month');
    },

    /**
     * Get top movies by revenue (admin)
     */
    getTopMoviesByRevenue: (limit: number = 5): Promise<Array<{ movie: Movie; revenue: number }>> => {
        return axiosClient.get('/admin/stats/top-movies', {
            params: { limit }
        });
    },

    /**
     * Get dashboard statistics (admin)
     */
    getDashboardStats: (): Promise<DashboardStats> => {
        return axiosClient.get('/admin/stats');
    },
};

export default adminService;
