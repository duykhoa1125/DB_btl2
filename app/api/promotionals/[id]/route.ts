import { NextResponse } from 'next/server';
import { MOCK_PROMOTIONALS } from '@/services/mock-data';

// GET /api/promotionals/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const { id } = await params;

        const promotional = MOCK_PROMOTIONALS.find(p => p.promotional_id === id);

        if (!promotional) {
            return NextResponse.json(
                { error: 'Promotional not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(promotional);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch promotional' },
            { status: 500 }
        );
    }
}
