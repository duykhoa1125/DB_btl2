import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS, MOCK_PROMOTIONALS, MOCK_DISCOUNTS, MOCK_GIFTS } from '@/services/mock-data';

// GET /api/vouchers/[code]/details
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

        const promotional = MOCK_PROMOTIONALS.find(p => p.promotional_id === voucher.promotional_id);
        const discount = MOCK_DISCOUNTS.find(d => d.promotional_id === voucher.promotional_id);
        const gift = MOCK_GIFTS.find(g => g.promotional_id === voucher.promotional_id);

        return NextResponse.json({
            ...voucher,
            promotional,
            discount,
            gift
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch voucher details' },
            { status: 500 }
        );
    }
}
