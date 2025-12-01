import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS } from '@/services/mock-data';

// GET /api/vouchers/[code]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const { code } = await params;

        const voucher = MOCK_VOUCHERS.find(v => v.code === code);

        if (!voucher) {
            return NextResponse.json(
                { error: 'Voucher not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(voucher);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch voucher' },
            { status: 500 }
        );
    }
}
