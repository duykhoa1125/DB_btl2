import { NextResponse } from 'next/server';
import { MOCK_FOODS } from '@/services/mock-data';

// GET /api/foods/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const food = MOCK_FOODS.find(f => f.food_id === id);

        if (!food) {
            return NextResponse.json(
                { error: 'Food not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(food);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch food' },
            { status: 500 }
        );
    }
}
