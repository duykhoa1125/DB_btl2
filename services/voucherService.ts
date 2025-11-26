import axiosClient from '@/lib/axiosClient';
import { Voucher } from './types';

const voucherService = {
    /**
     * Get all vouchers
     */
    getAll: (): Promise<Voucher[]> => {
        return axiosClient.get('/vouchers');
    },

    /**
     * Get vouchers for a specific user
     */
    getByUser: (phoneNumber: string): Promise<Voucher[]> => {
        return axiosClient.get('/vouchers', { params: { phone_number: phoneNumber } });
    },

    /**
     * Get voucher by code
     */
    getByCode: (code: string): Promise<Voucher> => {
        return axiosClient.get(`/vouchers/${code}`);
    },

    /**
     * Get active vouchers for a user
     */
    getActiveVouchers: (phoneNumber: string): Promise<Voucher[]> => {
        return axiosClient.get('/vouchers/active', { params: { phone_number: phoneNumber } });
    },

    /**
     * Validate if a voucher can be used
     */
    validateVoucher: (code: string, phoneNumber: string): Promise<{ valid: boolean; message: string }> => {
        return axiosClient.post('/vouchers/validate', { code, phone_number: phoneNumber });
    },

    /**
     * Apply voucher to a bill
     */
    applyVoucher: (code: string, billId: string): Promise<{ discount: number; message: string }> => {
        return axiosClient.post('/vouchers/apply', { code, bill_id: billId });
    },

    /**
     * Create voucher (admin)
     */
    create: (data: Omit<Voucher, 'code'>): Promise<Voucher> => {
        return axiosClient.post('/vouchers', data);
    },

    /**
     * Update voucher state (admin)
     */
    updateState: (code: string, state: 'active' | 'used' | 'expired'): Promise<Voucher> => {
        return axiosClient.put(`/vouchers/${code}`, { state });
    },

    /**
     * Delete voucher (admin)
     */
    delete: (code: string): Promise<void> => {
        return axiosClient.delete(`/vouchers/${code}`);
    },
};

export default voucherService;
