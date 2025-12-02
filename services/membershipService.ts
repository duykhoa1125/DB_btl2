import axiosClient from '@/lib/axiosClient';
import { Member } from './types';

const membershipService = {
    /**
     * Get all membership levels
     */
    getAllLevels: (): Promise<Member[]> => {
        return axiosClient.get('/memberships');
    },

    /**
     * Get membership progress for a user based on their points
     */
    getProgress: (points: number): Promise<{
        currentTier: Member;
        nextTier?: Member;
        progress: number;
        pointsToNext: number;
    }> => {
        return axiosClient.get('/memberships/progress', { params: { points } });
    },
};

export default membershipService;
