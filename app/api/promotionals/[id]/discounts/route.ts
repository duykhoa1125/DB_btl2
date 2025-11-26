import { NextResponse } from 'next/server';
import { MOCK_DISCOUNTS } from '@/services/mock-data';

// GET /api/promotionals/[id]/discounts
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const { id } = await params;

        const discounts = MOCK_DISCOUNTS.filter(d => d.promotional_id === id);

        return NextResponse.json(discounts);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch discounts' },
            { status: 500 }
        );
    }
}
