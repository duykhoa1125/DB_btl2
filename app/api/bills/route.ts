import { NextResponse } from 'next/server';
import { MOCK_BILLS } from '@/services/mock-data';

// GET /api/bills
// Support query param: ?account_phone=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const account_phone = searchParams.get('account_phone');

        let bills = MOCK_BILLS;

        if (account_phone) {
            bills = bills.filter(b => b.account_phone === account_phone);
        }

        return NextResponse.json(bills);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch bills' },
            { status: 500 }
        );
    }
}
