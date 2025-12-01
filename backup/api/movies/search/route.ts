import { NextResponse } from 'next/server';
import { MOCK_MOVIES } from '@/services/mock-data';

// GET /api/movies/search?q=keyword
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (!q) {
             return NextResponse.json([]);
        }

        const keyword = q.toLowerCase();
        // Filter by name or synopsis
        const filteredMovies = MOCK_MOVIES.filter(movie => 
            movie.name.toLowerCase().includes(keyword) || 
            (movie.synopsis && movie.synopsis.toLowerCase().includes(keyword))
        );

        return NextResponse.json(filteredMovies);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: 'Failed to search movies' },
            { status: 500 }
        );
    }
}
