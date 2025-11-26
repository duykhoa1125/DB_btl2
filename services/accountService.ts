import axiosClient from '@/lib/axiosClient';
import { Account, AccountMembership } from './types';

const accountService = {
    /**
     * Get account by phone number
     */
    getByPhone: (phoneNumber: string): Promise<Account> => {
        return axiosClient.get(`/accounts/${phoneNumber}`);
    },

    /**
     * Get account membership information
     */
    getMembership: (phoneNumber: string): Promise<AccountMembership> => {
        return axiosClient.get(`/accounts/${phoneNumber}/membership`);
    },

    /**
     * Update membership points
     */
    updateMembershipPoints: (phoneNumber: string, points: number): Promise<Account> => {
        return axiosClient.put(`/accounts/${phoneNumber}/points`, { points });
    },

    /**
     * Get account order/booking history
     */
    getOrderHistory: (phoneNumber: string): Promise<any> => {
        return axiosClient.get(`/accounts/${phoneNumber}/orders`);
    },

    /**
     * Get all accounts (admin)
     */
    getAll: (): Promise<Account[]> => {
        return axiosClient.get('/accounts');
    },

    /**
     * Update account (admin)
     */
    update: (phoneNumber: string, data: Partial<Omit<Account, 'phone_number'>>): Promise<Account> => {
        return axiosClient.put(`/accounts/${phoneNumber}`, data);
    },

    /**
     * Delete account (admin)
     */
    delete: (phoneNumber: string): Promise<void> => {
        return axiosClient.delete(`/accounts/${phoneNumber}`);
    },
};

export default accountService;
