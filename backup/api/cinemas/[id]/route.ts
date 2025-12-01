import { NextResponse } from 'next/server';
import { MOCK_CINEMAS } from '@/services/mock-data';
import type { Cinema } from '@/services/types';

// GET /api/cinemas/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cinema = MOCK_CINEMAS.find(c => c.cinema_id === id);

        if (!cinema) {
            return NextResponse.json(
                { error: 'Cinema not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(cinema);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch cinema' },
            { status: 500 }
        );
    }
}

// PUT /api/cinemas/:id (Admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const index = MOCK_CINEMAS.findIndex(c => c.cinema_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Cinema not found' },
                { status: 404 }
            );
        }

        MOCK_CINEMAS[index] = { ...MOCK_CINEMAS[index], ...body };

        return NextResponse.json(MOCK_CINEMAS[index]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update cinema' },
            { status: 500 }
        );
    }
}

// DELETE /api/cinemas/:id (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const index = MOCK_CINEMAS.findIndex(c => c.cinema_id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Cinema not found' },
                { status: 404 }
            );
        }

        MOCK_CINEMAS.splice(index, 1);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete cinema' },
            { status: 500 }
        );
    }
}

