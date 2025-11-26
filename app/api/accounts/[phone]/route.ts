import { NextResponse } from 'next/server';
import { MOCK_ACCOUNTS } from '@/services/mock-data';

// GET /api/accounts/:phone
export async function GET(
    request: Request,
    { params }: { params: Promise<{ phone: string }> }
) {
    try {
        const { phone } = await params;
        const account = MOCK_ACCOUNTS.find(a => a.phone_number === phone);

        if (!account) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(account);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch account' },
            { status: 500 }
        );
    }
}
