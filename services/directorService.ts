import axiosClient from '@/lib/axiosClient';
import { Director } from './types';

const directorService = {
    /**
     * Get directors for a specific movie
     */
    getByMovie: (movieId: string): Promise<Director[]> => {
        return axiosClient.get('/directors', { params: { movie_id: movieId } });
    },

    /**
     * Get all directors
     */
    getAll: (): Promise<Director[]> => {
        return axiosClient.get('/directors');
    },

    /**
     * Add director to a movie (admin)
     */
    addToMovie: (movieId: string, name: string): Promise<Director> => {
        return axiosClient.post('/directors', { movie_id: movieId, name });
    },

    /**
     * Remove director from a movie (admin)
     */
    removeFromMovie: (movieId: string, name: string): Promise<void> => {
        return axiosClient.delete('/directors', {
            data: { movie_id: movieId, name }
        });
    },

    /**
     * Update director name (admin)
     */
    update: (movieId: string, oldName: string, newName: string): Promise<Director> => {
        return axiosClient.put('/directors', {
            movie_id: movieId,
            old_name: oldName,
            new_name: newName
        });
    },
};

export default directorService;
