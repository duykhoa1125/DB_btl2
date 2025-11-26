import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS } from '@/services/mock-data';

// GET /api/vouchers
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        return NextResponse.json(MOCK_VOUCHERS);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch vouchers' },
            { status: 500 }
        );
    }
}
