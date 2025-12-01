import { NextResponse } from 'next/server';
import { MOCK_ROOMS } from '@/services/mock-data';

// GET /api/rooms
// Support query param: ?cinema_id=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cinema_id = searchParams.get('cinema_id');

        let rooms = MOCK_ROOMS;

        if (cinema_id) {
            rooms = rooms.filter(r => r.cinema_id === cinema_id);
        }

        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}
