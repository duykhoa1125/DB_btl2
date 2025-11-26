import { NextResponse } from 'next/server';
import { MOCK_BILLS } from '@/services/mock-data';

// GET /api/bills/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const bill = MOCK_BILLS.find(b => b.bill_id === id);

        if (!bill) {
            return NextResponse.json(
                { error: 'Bill not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(bill);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch bill' },
            { status: 500 }
        );
    }
}
