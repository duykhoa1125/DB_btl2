import { NextResponse } from "next/server";
import { MOCK_TICKETS, MOCK_BILLS } from "@/services/mock-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bill_id = searchParams.get("bill_id");
    const phone_number = searchParams.get("phone_number");
    const showtime_id = searchParams.get("showtime_id");

    let tickets = [...MOCK_TICKETS];

    if (bill_id) {
        tickets = tickets.filter((t) => t.bill_id === bill_id);
    }

    if (phone_number) {
        const userBillIds = MOCK_BILLS
            .filter(b => b.phone_number === phone_number)
            .map(b => b.bill_id);
        tickets = tickets.filter(t => userBillIds.includes(t.bill_id));
    }

    if (showtime_id) {
        tickets = tickets.filter((t) => t.showtime_id === showtime_id);
    }

    return NextResponse.json(tickets);
}
