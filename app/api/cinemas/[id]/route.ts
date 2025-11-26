import { NextResponse } from 'next/server';
import { MOCK_CINEMAS } from '@/services/mock-data';

// GET /api/cinemas/:id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const cinema = MOCK_CINEMAS.find(c => c.cinema_id === id);

        if (!cinema) {
            return NextResponse.json(
                { error: 'Cinema not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(cinema);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch cinema' },
            { status: 500 }
        );
    }
}
