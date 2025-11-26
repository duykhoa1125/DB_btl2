import axiosClient from '@/lib/axiosClient';
import { Actor } from './types';

const actorService = {
    /**
     * Get actors for a specific movie
     */
    getByMovie: (movieId: string): Promise<Actor[]> => {
        return axiosClient.get('/actors', { params: { movie_id: movieId } });
    },

    /**
     * Get all actors
     */
    getAll: (): Promise<Actor[]> => {
        return axiosClient.get('/actors');
    },

    /**
     * Add actor to a movie (admin)
     */
    addToMovie: (movieId: string, name: string): Promise<Actor> => {
        return axiosClient.post('/actors', { movie_id: movieId, name });
    },

    /**
     * Remove actor from a movie (admin)
     */
    removeFromMovie: (movieId: string, name: string): Promise<void> => {
        return axiosClient.delete('/actors', {
            data: { movie_id: movieId, name }
        });
    },

    /**
     * Update actor name (admin)
     */
    update: (movieId: string, oldName: string, newName: string): Promise<Actor> => {
        return axiosClient.put('/actors', {
            movie_id: movieId,
            old_name: oldName,
            new_name: newName
        });
    },
};

export default actorService;
