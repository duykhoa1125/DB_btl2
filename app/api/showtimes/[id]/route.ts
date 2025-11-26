import { NextResponse } from 'next/server';
import { MOCK_SHOWTIMES } from '@/services/mock-data';

// GET /api/showtimes/:id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const showtime = MOCK_SHOWTIMES.find(s => s.showtime_id === id);

        if (!showtime) {
            return NextResponse.json(
                { error: 'Showtime not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(showtime);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch showtime' },
            { status: 500 }
        );
    }
}
