import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/services/mock-data';

// GET /api/events
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        return NextResponse.json(MOCK_EVENTS);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
