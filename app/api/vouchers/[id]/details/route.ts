import { NextResponse } from 'next/server';
import { getVoucherDetail } from '@/services/mock-data';

// GET /api/vouchers/:id/details
// Trả về voucher kèm thông tin chi tiết (promotional, discount, gift)
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const voucherDetail = getVoucherDetail(id);

        if (!voucherDetail) {
            return NextResponse.json(
                { error: 'Voucher not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(voucherDetail);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch voucher details' },
            { status: 500 }
        );
    }
}
