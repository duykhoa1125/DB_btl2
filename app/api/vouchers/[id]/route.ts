import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS } from '@/services/mock-data';

// GET /api/vouchers/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const voucher = MOCK_VOUCHERS.find(v => v.code === id);

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
