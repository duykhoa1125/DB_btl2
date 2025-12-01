import { NextResponse } from 'next/server';
import { MOCK_SEATS } from '@/services/mock-data';

// GET /api/seats
// Support query param: ?room_id=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const room_id = searchParams.get('room_id');

        let seats = MOCK_SEATS;

        if (room_id) {
            seats = seats.filter(s => s.room_id === room_id);
        }

        return NextResponse.json(seats);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch seats' },
            { status: 500 }
        );
    }
}
