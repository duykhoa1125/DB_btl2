import { NextResponse } from "next/server";
import { MOCK_TICKETS } from "@/services/mock-data";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const billId = params.id;
    const tickets = MOCK_TICKETS.filter((t) => t.bill_id === billId);
    return NextResponse.json(tickets);
}
