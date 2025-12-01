import { NextResponse } from 'next/server';
import { MOCK_SHOWTIMES } from '@/services/mock-data';
import type { Showtime } from '@/services/types';

// GET /api/showtimes/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
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

// PUT /api/showtimes/:id (Admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const index = MOCK_SHOWTIMES.findIndex(s => s.showtime_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Showtime not found' },
                { status: 404 }
            );
        }

        MOCK_SHOWTIMES[index] = { ...MOCK_SHOWTIMES[index], ...body };

        return NextResponse.json(MOCK_SHOWTIMES[index]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update showtime' },
            { status: 500 }
        );
    }
}

// DELETE /api/showtimes/:id (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const index = MOCK_SHOWTIMES.findIndex(s => s.showtime_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Showtime not found' },
                { status: 404 }
            );
        }

        MOCK_SHOWTIMES.splice(index, 1);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete showtime' },
            { status: 500 }
        );
    }
}

