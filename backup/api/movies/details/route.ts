import { NextResponse } from 'next/server';
import { getAllMoviesWithDetails } from '@/services/mock-data';

// GET /api/movies/details
// Get all movies with their directors and actors
export async function GET(request: Request) {
    try {
        const movies = getAllMoviesWithDetails();
        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch movies with details' },
            { status: 500 }
        );
    }
}
