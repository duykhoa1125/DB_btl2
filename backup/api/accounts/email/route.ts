import { NextResponse } from "next/server";
import { MOCK_ACCOUNTS } from "@/services/mock-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const account = MOCK_ACCOUNTS.find(a => a.email === email);

    if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
}
