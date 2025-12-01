import { NextResponse } from 'next/server';
import { MOCK_FOODS } from '@/services/mock-data';

// GET /api/foods
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        return NextResponse.json(MOCK_FOODS);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch foods' },
            { status: 500 }
        );
    }
}
