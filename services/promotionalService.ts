import axiosClient from '@/lib/axiosClient';
import { Promotional, Discount, Gift } from './types';

const promotionalService = {

    /**
     * Get promotionals for a specific event
     */
    getByEvent: (eventId: string): Promise<Promotional[]> => {
        return axiosClient.get('/promotionals', { params: { event_id: eventId } });
    },
};

export default promotionalService;
