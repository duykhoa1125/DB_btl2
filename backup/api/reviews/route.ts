import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/services/mock-data';

// GET /api/reviews
// Support query param: ?movie_id=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const movie_id = searchParams.get('movie_id');

        let reviews = MOCK_REVIEWS;

        if (movie_id) {
            reviews = reviews.filter(r => r.movie_id === movie_id);
        }

        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
