import { NextResponse } from 'next/server';
import { MOCK_PROMOTIONALS } from '@/services/mock-data';

// GET /api/promotionals
export async function GET(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const { searchParams } = new URL(request.url);
        const event_id = searchParams.get('event_id');
        const level = searchParams.get('level');

        let promotionals = [...MOCK_PROMOTIONALS];

        if (event_id) {
            promotionals = promotionals.filter(p => p.event_id === event_id);
        }

        if (level) {
            promotionals = promotionals.filter(p => p.level === level);
        }

        return NextResponse.json(promotionals);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch promotionals' },
            { status: 500 }
        );
    }
}
