import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import type { LoginRequest, AuthResponse, AccountWithRole, StaffWithRole } from '@/services/types';

// TODO: Import from actual mock-data file
// For now, using inline mock data based on SQL schema
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
    },
    {
        phone_number: '0923456789',
        email: 'user2@gmail.com',
        password: 'password123',
        fullname: 'Trần Thị Bình',
        birth_date: '1995-08-20',
        gender: 'female' as const,
        avatar: 'https://avatar.vercel.sh/user2',
        membership_points: 800,
        registration_date: '2024-01-15'
    },
    {
        phone_number: '0934567890',
        email: 'user3@gmail.com',
        password: 'password123',
        fullname: 'Lê Văn Cường',
        birth_date: '1988-12-10',
        gender: 'male' as const,
        avatar: 'https://avatar.vercel.sh/user3',
        membership_points: 2500,
        registration_date: '2024-02-01'
    }
];

const MOCK_STAFF = [
    {
        staff_id: 'STA00001',
        name: 'Nguyễn Văn A',
        phone_number: '0901111111',
        password: 'admin123',
        cinema_id: 'CIN00001',
        manage_id: null
    },
    {
        staff_id: 'STA00002',
        name: 'Trần Thị B',
        phone_number: '0902222222',
        password: 'admin123',
        cinema_id: 'CIN00001',
        manage_id: 'STA00001'
    },
    {
        staff_id: 'STA00003',
        name: 'Lê Văn C',
        phone_number: '0903333333',
        password: 'admin123',
        cinema_id: 'CIN00002',
        manage_id: null
    }
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[Login API] Received body:', body);

        const { identifier, password } = body as LoginRequest;

        if (!identifier || !password) {
            return NextResponse.json(
                { error: 'Email/Phone and password are required' },
                { status: 400 }
            );
        }

        // Detect identifier type
        const isEmail = identifier.includes('@');

        let user: AccountWithRole | StaffWithRole | null = null;

        if (isEmail) {
            // Email login - only search in ACCOUNTS (users)
            const account = MOCK_ACCOUNTS.find(acc => acc.email === identifier);

            if (account && account.password === password) {
                // Remove password before sending
                const { password: _, ...accountWithoutPassword } = account;
                user = {
                    ...accountWithoutPassword,
                    role: 'user' as const
                };
            }
        } else {
            // Phone login - check STAFF first (admin), then ACCOUNT (user)

            // 1. Try admin login first
            const staff = MOCK_STAFF.find(s => s.phone_number === identifier);
            if (staff && staff.password === password) {
                const { password: _, cinema_id, manage_id, ...staffData } = staff;
                user = {
                    ...staffData,
                    role: 'admin' as const
                };
            }

            // 2. If not admin, try user login
            if (!user) {
                const account = MOCK_ACCOUNTS.find(acc => acc.phone_number === identifier);
                if (account && account.password === password) {
                    const { password: _, ...accountWithoutPassword } = account;
                    user = {
                        ...accountWithoutPassword,
                        role: 'user' as const
                    };
                }
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            phone_number: user.phone_number,
            role: user.role,
            name: user.role === 'user' ? (user as AccountWithRole).fullname : (user as StaffWithRole).name
        });

        const response: AuthResponse = {
            token,
            user
        };

        console.log('[Login API] Login successful for:', user.role, user.phone_number);
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('[Login API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
