import { NextResponse } from 'next/server';
import { MOCK_CINEMAS } from '@/services/mock-data';
import type { Cinema } from '@/services/types';

// GET /api/cinemas
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        return NextResponse.json(MOCK_CINEMAS);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch cinemas' },
            { status: 500 }
        );
    }
}

// POST /api/cinemas (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newCinema: Cinema = {
            ...body,
            cinema_id: `CIN${Date.now()}`,
        };

        MOCK_CINEMAS.push(newCinema);

        return NextResponse.json(newCinema, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create cinema' },
            { status: 500 }
        );
    }
}

