import { NextResponse } from 'next/server';
import { MOCK_MOVIES } from '@/services/mock-data';

// GET /api/movies/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const movie = MOCK_MOVIES.find(m => m.movie_id === id);

        if (!movie) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(movie);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch movie' },
            { status: 500 }
        );
    }
}
