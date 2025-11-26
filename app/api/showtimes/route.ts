import { NextResponse } from 'next/server';
import { MOCK_SHOWTIMES } from '@/services/mock-data';

// GET /api/showtimes
// Support query params: ?movie_id=xxx, ?cinema_id=xxx, ?date=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const movie_id = searchParams.get('movie_id');
        const cinema_id = searchParams.get('cinema_id');
        const room_id = searchParams.get('room_id');
        const date = searchParams.get('date');

        let showtimes = MOCK_SHOWTIMES;

        if (movie_id) {
            showtimes = showtimes.filter(s => s.movie_id === movie_id);
        }

        if (cinema_id) {
            showtimes = showtimes.filter(s => s.cinema_id === cinema_id);
        }

        if (room_id) {
            showtimes = showtimes.filter(s => s.room_id === room_id);
        }

        if (date) {
            showtimes = showtimes.filter(s =>
                s.show_date_time.startsWith(date)
            );
        }

        return NextResponse.json(showtimes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch showtimes' },
            { status: 500 }
        );
    }
}
