import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import type { RegisterRequest, AuthResponse, AccountWithRole, Account } from '@/services/types';

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
    }
];

export async function POST(request: NextRequest) {
    try {
        const body: RegisterRequest = await request.json();
        const { email, password, fullname, birth_date, gender } = body;

        // Debug logging
        console.log('[Register API] Received data:', { email, fullname, birth_date, gender, hasPassword: !!password });

        // Validation
        if (!email || !password || !fullname || !birth_date || !gender) {
            const missing = [];
            if (!email) missing.push('email');
            if (!password) missing.push('password');
            if (!fullname) missing.push('fullname');
            if (!birth_date) missing.push('birth_date');
            if (!gender) missing.push('gender');

            console.error('[Register API] Missing fields:', missing);
            return NextResponse.json(
                { error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            console.error('[Register API] Password too short:', password.length);
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const emailExists = MOCK_ACCOUNTS.some(acc => acc.email === email);
        if (emailExists) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Generate phone number (mock)
        const phoneNumber = `09${Math.floor(10000000 + Math.random() * 90000000)}`;

        // Check if phone already exists (unlikely but just in case)
        const phoneExists = MOCK_ACCOUNTS.some(acc => acc.phone_number === phoneNumber);
        if (phoneExists) {
            return NextResponse.json(
                { error: 'Please try again' },
                { status: 500 }
            );
        }

        // Create new user
        const now = new Date().toISOString().split('T')[0];
        const newAccount = {
            phone_number: phoneNumber,
            email,
            password,
            fullname,
            birth_date,
            gender,
            avatar: `https://avatar.vercel.sh/${email.split('@')[0]}`,
            membership_points: 0,
            registration_date: now
        };

        // Add to mock accounts (in real app, this would be database insert)
        MOCK_ACCOUNTS.push(newAccount);

        // Create user response (without password)
        const { password: _, ...userWithoutPassword } = newAccount;
        const user: AccountWithRole = {
            ...userWithoutPassword,
            role: 'user' as const
        };

        // Generate token
        const token = generateToken({
            phone_number: user.phone_number,
            role: 'user',
            name: user.fullname
        });

        const response: AuthResponse = {
            token,
            user
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
