import { NextResponse } from 'next/server';
import { MOCK_GIFTS } from '@/services/mock-data';

// GET /api/promotionals/[id]/gifts
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const { id } = await params;

        const gifts = MOCK_GIFTS.filter(g => g.promotional_id === id);

        return NextResponse.json(gifts);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch gifts' },
            { status: 500 }
        );
    }
}
