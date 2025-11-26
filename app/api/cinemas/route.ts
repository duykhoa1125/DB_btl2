import { NextResponse } from 'next/server';
import { MOCK_CINEMAS } from '@/services/mock-data';

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
