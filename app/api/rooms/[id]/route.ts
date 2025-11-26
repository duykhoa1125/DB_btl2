import { NextResponse } from 'next/server';
import { MOCK_ROOMS } from '@/services/mock-data';

// GET /api/rooms/:id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const room = MOCK_ROOMS.find(r => r.room_id === id);

        if (!room) {
            return NextResponse.json(
                { error: 'Room not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(room);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch room' },
            { status: 500 }
        );
    }
}
