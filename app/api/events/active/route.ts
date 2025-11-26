import { NextResponse } from 'next/server';
import { getActiveEvents } from '@/services/mock-data';

// GET /api/events/active
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const events = getActiveEvents();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch active events' },
            { status: 500 }
        );
    }
}
