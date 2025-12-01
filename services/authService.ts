import axiosClient from '@/lib/axiosClient';
import { Account, AuthResponse, LoginRequest, RegisterRequest, AuthenticatedUser } from './types';

const authService = {
    /**
     * User/Admin login (supports email or phone)
     */
    login: (data: LoginRequest): Promise<AuthResponse> => {
        return axiosClient.post('/auth/login', data);
    },

    /**
     * User registration (users only, not admins)
     * Backend returns { success: true } on success, no token.
     */
    register: (data: RegisterRequest): Promise<void> => {
        return axiosClient.post('/auth/register', data);
    },

    /**
     * Logout (clear local storage)
     */
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/account/login';
        }
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: (): Promise<AuthenticatedUser> => {
        return axiosClient.get('/auth/me');
    },

    /**
     * Update user profile (users only)
     * @warning Not fully implemented in backend yet
     */
    updateProfile: (data: Partial<Omit<Account, 'phone_number'>>): Promise<Account> => {
        // TODO: Implement backend endpoint
        return axiosClient.put('/auth/profile', data);
    },

    /**
     * Change password (both user and admin)
     * @warning Not fully implemented in backend yet
     */
    changePassword: (oldPassword: string, newPassword: string): Promise<void> => {
        // TODO: Implement backend endpoint
        return axiosClient.put('/auth/password', { old_password: oldPassword, new_password: newPassword });
    },
};

export default authService;
