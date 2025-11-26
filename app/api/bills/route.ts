import { NextResponse } from 'next/server';
import { MOCK_BILLS } from '@/services/mock-data';

// GET /api/bills
// Support query param: ?account_phone=xxx
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const phone_number = searchParams.get('phone_number') || searchParams.get('account_phone');

        let bills = MOCK_BILLS;

        if (phone_number) {
            bills = bills.filter(b => b.phone_number === phone_number);
        }

        return NextResponse.json(bills);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch bills' },
            { status: 500 }
        );
    }
}
