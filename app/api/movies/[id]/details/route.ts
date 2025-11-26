import { NextResponse } from 'next/server';
import { getMovieWithDetails } from '@/services/mock-data';

// GET /api/movies/:id/details
// Trả về movie kèm theo directors, actors
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const movie = getMovieWithDetails(id);

        if (!movie) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(movie);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch movie details' },
            { status: 500 }
        );
    }
}
