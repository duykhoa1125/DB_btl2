/**
 * Pricing utilities based on database schema
 * Price is stored in TICKET table, calculated based on seat_type
 */

import type { SeatType } from "@/services/types";

/**
 * Ticket prices by seat type (in VND)
 * Based on SQL schema examples (mysql_Ticket_Booking_System.sql lines 500-506)
 */
export const SEAT_PRICES: Record<SeatType, number> = {
    normal: 75000,
    vip: 85000,
    couple: 90000,
} as const;

/**
 * Map lib/mock-data seat types to services/types seat types
 */
function mapSeatType(oldType: "Standard" | "VIP" | "Couple" | "Accessible"): SeatType {
    switch (oldType) {
        case "VIP":
            return "vip";
        case "Couple":
            return "couple";
        case "Standard":
        case "Accessible":
        default:
            return "normal";
    }
}

/**
 * Get ticket price for a given seat type
 */
export function getTicketPrice(seatType: SeatType | "Standard" | "VIP" | "Couple" | "Accessible"): number {
    const mappedType = typeof seatType === "string" && ["Standard", "VIP", "Couple", "Accessible"].includes(seatType)
        ? mapSeatType(seatType as "Standard" | "VIP" | "Couple" | "Accessible")
        : (seatType as SeatType);

    return SEAT_PRICES[mappedType];
}

/**
 * Calculate total price for multiple seats
 */
export function calculateSeatsTotal(seats: Array<{ seatType: SeatType | "Standard" | "VIP" | "Couple" | "Accessible" }>): number {
    return seats.reduce((total, seat) => total + getTicketPrice(seat.seatType), 0);
}
