import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/services/mock-data';

// GET /api/events/:id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const event = MOCK_EVENTS.find(e => e.event_id === id);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}
