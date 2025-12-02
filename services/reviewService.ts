import axiosClient from '@/lib/axiosClient';
import { MovieReview } from './types';

const reviewService = {

    /**
     * Get reviews for a specific movie
     */
    getByMovie: (movieId: string): Promise<MovieReview[]> => {
        return axiosClient.get('/reviews', { params: { movie_id: movieId } });
    },

    /**
     * Create a review
     */
    create: (data: Omit<MovieReview, 'date_written'>): Promise<MovieReview> => {
        return axiosClient.post('/reviews', data);
    },
};

export default reviewService;
