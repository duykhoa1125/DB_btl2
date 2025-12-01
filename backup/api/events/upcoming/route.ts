import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/services/mock-data';

// GET /api/events/upcoming
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const today = new Date().toISOString().split('T')[0];
        // Logic: Events starting in the future
        const upcomingEvents = MOCK_EVENTS.filter(e => e.start_date > today);

        return NextResponse.json(upcomingEvents);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch upcoming events' },
            { status: 500 }
        );
    }
}
