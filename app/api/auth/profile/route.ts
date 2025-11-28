import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import type { Account, AccountWithRole } from '@/services/types';

// TODO: Replace with actual mock-data import
const MOCK_ACCOUNTS: Account[] = [
    {
        phone_number: '0912345678',
        email: 'user1@gmail.com',
        password: 'password123',
        fullname: 'Nguyễn Văn An',
        birth_date: '1990-05-15',
        gender: 'male' as const,
        avatar: 'https://avatar.vercel.sh/user1',
        membership_points: 1500,
        registration_date: '2024-01-01'
    }
];

export async function PUT(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'user') {
            return NextResponse.json(
                { error: 'Unauthorized - User role required' },
                { status: 403 }
            );
        }

        // Get update data
        const updates: Partial<Account> = await request.json();

        // Find user
        const userIndex = MOCK_ACCOUNTS.findIndex(
            acc => acc.phone_number === payload.phone_number
        );

        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent updating sensitive fields
        delete updates.phone_number;
        delete updates.password;
        delete updates.membership_points;
        delete updates.registration_date;

        // Update user (in real app, this would be database update)
        const updatedAccount = {
            ...MOCK_ACCOUNTS[userIndex],
            ...updates
        };
        MOCK_ACCOUNTS[userIndex] = updatedAccount;

        // Return updated user (without password)
        const { password: _, ...userWithoutPassword } = updatedAccount;
        const user: AccountWithRole = {
            ...userWithoutPassword,
            role: 'user' as const
        };

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
