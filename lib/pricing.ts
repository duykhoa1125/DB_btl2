/**
 * Pricing utilities based on database schema
 * Price is stored in TICKET table, calculated based on seat_type
 */

import type { Seat, SeatType } from "@/services/types";

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
 * Get ticket price for a given seat type
 */
export function getTicketPrice(seatType: SeatType): number {
    return SEAT_PRICES[seatType];
}

/**
 * Calculate total price for multiple seats
 */
export function calculateSeatsTotal(seats: Seat[]): number {
    return seats.reduce((total, seat) => total + getTicketPrice(seat.seat_type), 0);
}

