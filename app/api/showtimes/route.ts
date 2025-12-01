import { NextResponse } from 'next/server';
import { MOCK_SHOWTIMES, MOCK_ROOMS } from '@/services/mock-data';
import type { Showtime } from '@/services/types';

// GET /api/showtimes
// Support query params: ?movie_id=xxx, ?cinema_id=xxx, ?room_id=xxx, ?date=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const movie_id = searchParams.get('movie_id');
        const cinema_id = searchParams.get('cinema_id');
        const room_id = searchParams.get('room_id');
        const date = searchParams.get('date');

        let showtimes = MOCK_SHOWTIMES;

        // Filter by movie_id
        if (movie_id) {
            showtimes = showtimes.filter(s => s.movie_id === movie_id);
        }

        // Filter by cinema_id (need to join with rooms)
        if (cinema_id) {
            const cinemaRoomIds = MOCK_ROOMS
                .filter(r => r.cinema_id === cinema_id)
                .map(r => r.room_id);
            showtimes = showtimes.filter(s => cinemaRoomIds.includes(s.room_id));
        }

        // Filter by room_id
        if (room_id) {
            showtimes = showtimes.filter(s => s.room_id === room_id);
        }

        // Filter by date
        if (date) {
            showtimes = showtimes.filter(s => s.start_date === date);
        }

        return NextResponse.json(showtimes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch showtimes' },
            { status: 500 }
        );
    }
}

// POST /api/showtimes (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newShowtime: Showtime = {
            ...body,
            showtime_id: `SHO${Date.now()}`,
        };

        MOCK_SHOWTIMES.push(newShowtime);

        return NextResponse.json(newShowtime, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create showtime' },
            { status: 500 }
        );
    }
}

