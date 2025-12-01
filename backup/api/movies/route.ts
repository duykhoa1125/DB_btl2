import { NextResponse } from 'next/server';
import { MOCK_MOVIES } from '@/services/mock-data';
import type { Movie } from '@/services/types';

// GET /api/movies
export async function GET(request: Request) {
    try {
        // Giả lập network delay (optional)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Có thể filter theo query params
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // ?status=showing

        let movies = MOCK_MOVIES;

        if (status) {
            movies = movies.filter(m => m.status === status);
        }

        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch movies' },
            { status: 500 }
        );
    }
}

// POST /api/movies (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newMovie: Movie = {
            ...body,
            movie_id: `MOV${Date.now()}`,
        };

        MOCK_MOVIES.push(newMovie);

        return NextResponse.json(newMovie, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create movie' },
            { status: 500 }
        );
    }
}

