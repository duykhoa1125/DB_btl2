import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/services/mock-data';

// GET /api/reviews/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // const review = MOCK_REVIEWS.find(r => r.review_id === id);
        // Review ID is not supported in current data model
        const review = undefined;

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch review' },
            { status: 500 }
        );
    }
}
