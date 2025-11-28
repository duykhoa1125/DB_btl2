import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import type { AccountWithRole, StaffWithRole } from '@/services/types';

// TODO: Replace with actual mock-data import
const MOCK_ACCOUNTS = [
    {
        phone_number: '0912345678',
        email: 'user1@gmail.com',
        fullname: 'Nguyễn Văn An',
        birth_date: '1990-05-15',
        gender: 'male' as const,
        avatar: 'https://avatar.vercel.sh/user1',
        membership_points: 1500,
        registration_date: '2024-01-01'
    }
];

const MOCK_STAFF = [
    {
        staff_id: 'STA00001',
        name: 'Nguyễn Văn A',
        phone_number: '0901111111',
        cinema_id: 'CIN00001'
    }
];

export async function GET(request: NextRequest) {
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
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Find user based on role
        let user: AccountWithRole | StaffWithRole | null = null;

        if (payload.role === 'admin') {
            // Find in STAFF
            const staff = MOCK_STAFF.find(s => s.phone_number === payload.phone_number);
            if (staff) {
                user = {
                    ...staff,
                    role: 'admin' as const
                };
            }
        } else {
            // Find in ACCOUNTS
            const account = MOCK_ACCOUNTS.find(acc => acc.phone_number === payload.phone_number);
            if (account) {
                user = {
                    ...account,
                    role: 'user' as const
                };
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
