import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS, MOCK_DISCOUNTS, MOCK_BILLS } from '@/services/mock-data';

// POST /api/vouchers/apply
export async function POST(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const body = await request.json();
        const { code, bill_id, total_price } = body;
        // Note: bill_id might be null if bill not created yet, so we might pass total_price directly

        if (!code) {
            return NextResponse.json(
                { message: 'Missing voucher code' },
                { status: 400 }
            );
        }

        const voucher = MOCK_VOUCHERS.find(v => v.code === code);
        if (!voucher || voucher.state !== 'active') {
            return NextResponse.json(
                { message: 'Invalid voucher' },
                { status: 400 }
            );
        }

        const discount = MOCK_DISCOUNTS.find(d => d.promotional_id === voucher.promotional_id);

        let discountAmount = 0;
        let message = 'Voucher applied successfully';

        if (discount) {
            // Calculate discount
            // We need the bill total. If passed in body, use it. If bill_id, fetch bill.
            let billTotal = total_price;

            if (!billTotal && bill_id) {
                const bill = MOCK_BILLS.find(b => b.bill_id === bill_id);
                if (bill) billTotal = bill.total_price;
            }

            if (billTotal) {
                const rawDiscount = billTotal * (discount.percent_reduce / 100);
                discountAmount = Math.min(rawDiscount, discount.max_price_can_reduce);
            }
        } else {
            // Gift voucher
            message = 'Gift voucher applied. Check your gifts!';
        }

        return NextResponse.json({
            discount: discountAmount,
            message
        });

    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to apply voucher' },
            { status: 500 }
        );
    }
}
