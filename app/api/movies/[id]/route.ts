import { NextResponse } from 'next/server';
import { MOCK_MOVIES } from '@/services/mock-data';
import type { Movie } from '@/services/types';

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

// PUT /api/movies/:id (Admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const index = MOCK_MOVIES.findIndex(m => m.movie_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        MOCK_MOVIES[index] = { ...MOCK_MOVIES[index], ...body };

        return NextResponse.json(MOCK_MOVIES[index]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update movie' },
            { status: 500 }
        );
    }
}

// DELETE /api/movies/:id (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const index = MOCK_MOVIES.findIndex(m => m.movie_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        MOCK_MOVIES.splice(index, 1);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete movie' },
            { status: 500 }
        );
    }
}

