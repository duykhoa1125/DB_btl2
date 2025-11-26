import axiosClient from '@/lib/axiosClient';
import { Movie, MovieDetail } from './types';

const movieService = {
    /**
     * Get all movies
     */
    getAll: (): Promise<Movie[]> => {
        return axiosClient.get('/movies');
    },

    /**
     * Get movie by ID
     */
    getById: (id: string): Promise<Movie> => {
        return axiosClient.get(`/movies/${id}`);
    },

    /**
     * Get movies by status
     */
    getByStatus: (status: 'showing' | 'upcoming' | 'ended'): Promise<Movie[]> => {
        return axiosClient.get('/movies', { params: { status } });
    },

    /**
     * Get movie with full details (directors, actors, reviews)
     */
    getWithDetails: (id: string): Promise<MovieDetail> => {
        return axiosClient.get(`/movies/${id}/details`);
    },

    /**
     * Get all movies with details
     */
    getAllWithDetails: (): Promise<MovieDetail[]> => {
        return axiosClient.get('/movies/details');
    },

    /**
     * Search movies by keyword (name or synopsis)
     */
    search: (keyword: string): Promise<Movie[]> => {
        return axiosClient.get('/movies/search', { params: { q: keyword } });
    },

    /**
     * Get now showing movies
     */
    getNowShowing: (): Promise<Movie[]> => {
        return axiosClient.get('/movies/now-showing');
    },

    /**
     * Get upcoming movies
     */
    getUpcoming: (): Promise<Movie[]> => {
        return axiosClient.get('/movies/upcoming');
    },

    /**
     * Create new movie (admin)
     */
    create: (data: Omit<Movie, 'movie_id'>): Promise<Movie> => {
        return axiosClient.post('/movies', data);
    },

    /**
     * Update movie (admin)
     */
    update: (id: string, data: Partial<Omit<Movie, 'movie_id'>>): Promise<Movie> => {
        return axiosClient.put(`/movies/${id}`, data);
    },

    /**
     * Delete movie (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/movies/${id}`);
    },
};

export default movieService;