import { NextResponse } from "next/server";
import { getMembershipProgress } from "@/services/mock-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const points = Number(searchParams.get("points") || 0);

    const progress = getMembershipProgress(points);
    return NextResponse.json(progress);
}
