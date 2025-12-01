import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS } from '@/services/mock-data';

// GET /api/vouchers
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const { searchParams } = new URL(request.url);
        const phone_number = searchParams.get('phone_number');

        let vouchers = [...MOCK_VOUCHERS];

        if (phone_number) {
            vouchers = vouchers.filter(v => v.phone_number === phone_number);
        }

        return NextResponse.json(vouchers);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch vouchers' },
            { status: 500 }
        );
    }
}
