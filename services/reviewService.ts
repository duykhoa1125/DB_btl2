import axiosClient from '@/lib/axiosClient';
import { MovieReview } from './types';

const reviewService = {
    /**
     * Get all reviews
     */
    getAll: (): Promise<MovieReview[]> => {
        return axiosClient.get('/reviews');
    },

    /**
     * Get reviews for a specific movie
     */
    getByMovie: (movieId: string): Promise<MovieReview[]> => {
        return axiosClient.get('/reviews', { params: { movie_id: movieId } });
    },

    /**
     * Get reviews by a specific user
     */
    getByUser: (phoneNumber: string): Promise<MovieReview[]> => {
        return axiosClient.get('/reviews', { params: { phone_number: phoneNumber } });
    },

    /**
     * Get specific review
     */
    getReview: (phoneNumber: string, movieId: string): Promise<MovieReview> => {
        return axiosClient.get(`/reviews/${phoneNumber}/${movieId}`);
    },

    /**
     * Get average rating for a movie
     */
    getAverageRating: (movieId: string): Promise<{ average: number; count: number }> => {
        return axiosClient.get(`/reviews/movie/${movieId}/rating`);
    },

    /**
     * Create a review
     */
    create: (data: Omit<MovieReview, 'date_written'>): Promise<MovieReview> => {
        return axiosClient.post('/reviews', data);
    },

    /**
     * Update a review
     */
    update: (phoneNumber: string, movieId: string, data: Partial<Omit<MovieReview, 'phone_number' | 'movie_id'>>): Promise<MovieReview> => {
        return axiosClient.put(`/reviews/${phoneNumber}/${movieId}`, data);
    },

    /**
     * Delete a review
     */
    delete: (phoneNumber: string, movieId: string): Promise<void> => {
        return axiosClient.delete(`/reviews/${phoneNumber}/${movieId}`);
    },
};

export default reviewService;
