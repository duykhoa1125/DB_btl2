import { NextResponse } from "next/server";
import { MOCK_STAFFS } from "@/services/mock-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cinema_id = searchParams.get("cinema_id");
    const manage_id = searchParams.get("manage_id");

    let staffs = [...MOCK_STAFFS];

    if (cinema_id) {
        staffs = staffs.filter((s) => s.cinema_id === cinema_id);
    }

    if (manage_id) {
        staffs = staffs.filter((s) => s.manage_id === manage_id);
    }

    return NextResponse.json(staffs);
}

export async function POST(request: Request) {
    const body = await request.json();
    // In a real app, save to DB. Here just return the data with a new ID (mock)
    const newStaff = {
        ...body,
        staff_id: `STA${Math.floor(Math.random() * 10000)}`
    };
    return NextResponse.json(newStaff);
}
