import { NextResponse } from 'next/server';
import { MOCK_PROMOTIONALS } from '@/services/mock-data';

// GET /api/promotionals/active
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const today = new Date().toISOString().split('T')[0];
        const activePromotionals = MOCK_PROMOTIONALS.filter(
            p => p.start_date <= today && p.end_date >= today
        );

        return NextResponse.json(activePromotionals);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch active promotionals' },
            { status: 500 }
        );
    }
}
