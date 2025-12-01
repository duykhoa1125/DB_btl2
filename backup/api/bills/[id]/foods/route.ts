import { NextResponse } from "next/server";
import { MOCK_FOODS } from "@/services/mock-data";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    // Return empty array to fix 404 and allow page to load
    return NextResponse.json([]);
}
