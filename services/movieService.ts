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
        return axiosClient.get('/movies', { params: { status: 'showing' } });
    },

    /**
     * Get upcoming movies
     */
    getUpcoming: (): Promise<Movie[]> => {
        return axiosClient.get('/movies', { params: { status: 'upcoming' } });
    },

    /**
     * Create new movie (admin)
     */
    create: (data: Omit<Movie, 'movie_id'>): Promise<Movie> => {
        return axiosClient.post('/admin/movies', data);
    },

    /**
     * Update movie (admin)
     */
    update: (id: string, data: Partial<Omit<Movie, 'movie_id'>>): Promise<Movie> => {
        return axiosClient.put(`/admin/movies/${id}`, data);
    },

    /**
     * Delete movie (admin)
     */
    delete: (id: string): Promise<void> => {
        return axiosClient.delete(`/admin/movies/${id}`);
    },
};

export default movieService;