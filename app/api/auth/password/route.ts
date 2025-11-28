import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// TODO: Replace with actual mock-data import
const MOCK_ACCOUNTS = [
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

const MOCK_STAFF = [
    {
        staff_id: 'STA00001',
        name: 'Nguyễn Văn A',
        phone_number: '0901111111',
        password: 'admin123',
        cinema_id: 'CIN00001'
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
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Get password data
        const { old_password, new_password } = await request.json();

        if (!old_password || !new_password) {
            return NextResponse.json(
                { error: 'Old and new passwords are required' },
                { status: 400 }
            );
        }

        if (new_password.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Find and update password based on role
        if (payload.role === 'admin') {
            const staffIndex = MOCK_STAFF.findIndex(
                s => s.phone_number === payload.phone_number
            );

            if (staffIndex === -1) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            if (MOCK_STAFF[staffIndex].password !== old_password) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 401 }
                );
            }

            MOCK_STAFF[staffIndex].password = new_password;
        } else {
            const userIndex = MOCK_ACCOUNTS.findIndex(
                acc => acc.phone_number === payload.phone_number
            );

            if (userIndex === -1) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            if (MOCK_ACCOUNTS[userIndex].password !== old_password) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 401 }
                );
            }

            MOCK_ACCOUNTS[userIndex].password = new_password;
        }

        return NextResponse.json(
            { message: 'Password updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
