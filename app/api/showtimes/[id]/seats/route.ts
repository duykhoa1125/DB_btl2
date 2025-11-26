import { NextResponse } from 'next/server';
import { MOCK_SEATS, MOCK_SHOWTIMES } from '@/services/mock-data';

// GET /api/showtimes/:id/seats
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Tìm showtime để lấy room_id
        const showtime = MOCK_SHOWTIMES.find(s => s.showtime_id === id);

        if (!showtime) {
            return NextResponse.json(
                { error: 'Showtime not found' },
                { status: 404 }
            );
        }

        // Lấy seats của room đó
        const seats = MOCK_SEATS.filter(s => s.room_id === showtime.room_id);

        return NextResponse.json(seats);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch seats' },
            { status: 500 }
        );
    }
}
