import { NextResponse } from 'next/server';
import { MOCK_VOUCHERS, MOCK_PROMOTIONALS, MOCK_ACCOUNTS_MEMBERSHIP } from '@/services/mock-data';

// POST /api/vouchers/validate
export async function POST(request: Request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const body = await request.json();
        const { code, phone_number } = body;

        if (!code || !phone_number) {
            return NextResponse.json(
                { valid: false, message: 'Missing code or phone number' },
                { status: 400 }
            );
        }

        const voucher = MOCK_VOUCHERS.find(v => v.code === code);

        if (!voucher) {
            return NextResponse.json(
                { valid: false, message: 'Voucher not found' },
                { status: 404 }
            );
        }

        // 1. Check owner
        if (voucher.phone_number !== phone_number) {
            return NextResponse.json(
                { valid: false, message: 'Voucher does not belong to this user' },
                { status: 403 }
            );
        }

        // 2. Check state
        if (voucher.state !== 'active') {
            return NextResponse.json(
                { valid: false, message: `Voucher is ${voucher.state}` },
                { status: 400 }
            );
        }

        // 3. Check date
        const today = new Date().toISOString().split('T')[0];
        if (today < voucher.start_date || today > voucher.end_date) {
            return NextResponse.json(
                { valid: false, message: 'Voucher is not valid at this time' },
                { status: 400 }
            );
        }

        // 4. Check Member Level
        const promotional = MOCK_PROMOTIONALS.find(p => p.promotional_id === voucher.promotional_id);
        if (promotional) {
            const userMembership = MOCK_ACCOUNTS_MEMBERSHIP.find(m => m.phone_number === phone_number);
            // If user has no membership record, assume copper (default)
            const userLevel = userMembership ? userMembership.level : 'copper';

            // Simple level hierarchy check could be implemented here if needed.
            // For now, exact match or if promotional level is 'copper' (available to all)
            // But usually higher levels can use lower level vouchers? 
            // The DB schema just says "level" in Promotional. Let's assume it means "Minimum Level" or "Exclusive Level".
            // Let's assume exact match for simplicity as per schema FK, or maybe hierarchy.
            // Let's stick to the logic: if promo requires VIP, user must be VIP.

            if (promotional.level !== 'copper' && userLevel !== promotional.level) {
                // Allow higher levels to use lower level vouchers?
                // Let's define hierarchy: copper < gold < diamond < vip
                const levels = ['copper', 'gold', 'diamond', 'vip'];
                const userLevelIdx = levels.indexOf(userLevel);
                const promoLevelIdx = levels.indexOf(promotional.level);

                if (userLevelIdx < promoLevelIdx) {
                    return NextResponse.json(
                        { valid: false, message: `This voucher is for ${promotional.level} members only` },
                        { status: 403 }
                    );
                }
            }
        }

        return NextResponse.json({ valid: true, message: 'Voucher is valid' });

    } catch (error) {
        return NextResponse.json(
            { valid: false, message: 'Validation failed' },
            { status: 500 }
        );
    }
}
