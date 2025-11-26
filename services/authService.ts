import axiosClient from '@/lib/axiosClient';
import { Account } from './types';

interface LoginPayload {
    phone_number: string;
    password: string;
}

interface RegisterPayload {
    phone_number: string;
    email: string;
    password: string;
    fullname: string;
    birth_date: string;
    gender: 'male' | 'female' | 'unknown';
}

interface AuthResponse {
    token: string;
    user: Account;
}

const authService = {
    /**
     * User login
     */
    login: (data: LoginPayload): Promise<AuthResponse> => {
        return axiosClient.post('/auth/login', data);
    },

    /**
     * User registration
     */
    register: (data: RegisterPayload): Promise<AuthResponse> => {
        return axiosClient.post('/auth/register', data);
    },

    /**
     * Logout (clear local storage)
     */
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/account/login';
        }
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: (): Promise<Account> => {
        return axiosClient.get('/auth/me');
    },

    /**
     * Update user profile
     */
    updateProfile: (data: Partial<Omit<Account, 'phone_number'>>): Promise<Account> => {
        return axiosClient.put('/auth/profile', data);
    },

    /**
     * Change password
     */
    changePassword: (oldPassword: string, newPassword: string): Promise<void> => {
        return axiosClient.put('/auth/password', { old_password: oldPassword, new_password: newPassword });
    },

    /**
     * Get account by email (used for authentication lookup)
     */
    getByEmail: (email: string): Promise<Account> => {
        return axiosClient.get('/accounts/email', { params: { email } });
    },
};

export default authService;
