import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS } from '@/services/mock-data';

// GET /api/vouchers/active
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const { searchParams } = new URL(request.url);
        const phone_number = searchParams.get('phone_number');

        if (!phone_number) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        const today = new Date().toISOString().split('T')[0];
        const activeVouchers = MOCK_VOUCHERS.filter(
            v => v.phone_number === phone_number &&
                v.state === 'active' &&
                v.start_date <= today &&
                v.end_date >= today
        );

        return NextResponse.json(activeVouchers);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch active vouchers' },
            { status: 500 }
        );
    }
}
