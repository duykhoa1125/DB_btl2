import { NextResponse } from "next/server";
import { MOCK_FOODS } from "@/services/mock-data";

export async function GET() {
    return NextResponse.json(MOCK_FOODS);
}
