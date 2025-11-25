/**
 * EXAMPLE: How to use the new Ticket Service
 * 
 * This file demonstrates how to integrate the new Bill/Ticket/Food tracking
 * system into your booking flow.
 */

import {
    createCompleteBooking,
    generateTicketsForSeats,
    generateFoodItemsWithDates,
    createBill,
    createPromotionalBill
} from '@/services/ticketService';
import { foodCatalogMap } from '@/lib/mock-data';

// ============================================
// EXAMPLE 1: Complete Booking with Everything
// ============================================
export function exampleCompleteBooking() {
    const result = createCompleteBooking(
        "0912345678",              // Customer phone number
        [                          // Selected seats
            { row: "A", column: 1, price: 80000 },
            { row: "A", column: 2, price: 80000 }
        ],
        [                          // Selected foods
            { id: "food_001", quantity: 1 },  // Bắp mặn vừa
            { id: "food_007", quantity: 2 }   // Coca-Cola vừa x2
        ],
        "st_001",                  // Showtime ID
        "Avengers: Endgame",       // Movie name
        "room_001",                // Room ID
        foodCatalogMap,            // Food catalog (from mock-data)
        true                       // Has promotional applied
    );

    console.log("Created Bill:", result.bill);
    console.log("Generated Tickets:", result.tickets.length); // 2 tickets (1 per seat)
    console.log("Food Items:", result.foods); // With production & expiry dates
    console.log("Promotional Bill:", result.promotionalBill);

    return result;
}

// ============================================
// EXAMPLE 2: Ticket-Only Booking (No Food)
// ============================================
export function exampleTicketOnlyBooking() {
    const result = createCompleteBooking(
        "0987654321",
        [
            { row: "E", column: 7, price: 120000 }, // VIP seat
        ],
        [],                        // No food
        "st_015",
        "The Dark Knight",
        "room_002",
        foodCatalogMap,
        false                      // No promotional
    );

    console.log("Bill Total:", result.bill.total_price); // 120,000 VND
    console.log("Tickets:", result.tickets[0]); // Single ticket
    console.log("Foods:", result.foods); // Empty array
    console.log("Has Promotional?:", !!result.promotionalBill); // false

    return result;
}

// ============================================
// EXAMPLE 3: Manual Ticket Generation Only
// ============================================
export function exampleManualTicketGeneration() {
    const billId = "bill_custom_001";
    const seats = [
        { row: "B", column: 3, price: 80000 },
        { row: "B", column: 4, price: 80000 },
        { row: "B", column: 5, price: 80000 },
    ];

    const tickets = generateTicketsForSeats(
        billId,
        seats,
        "st_007",
        "Inception",
        "room_003"
    );

    console.log("Generated Individual Tickets:");
    tickets.forEach(ticket => {
        console.log(`- ${ticket.ticket_id}: Seat ${ticket.seat_row}${ticket.seat_column}, Price: ${ticket.price}`);
    });

    return tickets;
}

// ============================================
// EXAMPLE 4: Food with Expiry Date Calculation
// ============================================
export function exampleFoodWithExpiryDates() {
    const billId = "bill_custom_002";

    const foodItems = [
        { id: "food_001", quantity: 2 },  // Popcorn: 3 days shelf life
        { id: "food_005", quantity: 1 },  // Orange juice: 7 days shelf life
        { id: "food_009", quantity: 1 },  // Combo: 1 day shelf life
    ];

    const foods = generateFoodItemsWithDates(
        billId,
        foodItems,
        foodCatalogMap
    );

    console.log("Food Items with Dates:");
    foods.forEach(food => {
        console.log(`- ${food.name}: Qty ${food.quantity}`);
        console.log(`  Production: ${food.production_date}`);
        console.log(`  Expiration: ${food.expiration_date}`);

        // Calculate days until expiry
        const daysUntilExpiry = Math.ceil(
            (new Date(food.expiration_date).getTime() - new Date().getTime())
            / (1000 * 60 * 60 * 24)
        );
        console.log(`  Days until expiry: ${daysUntilExpiry}`);
    });

    return foods;
}

// ============================================
// EXAMPLE 5: Check Promotional Bill
// ============================================
export function examplePromotionalBillTracking() {
    // Create a bill with promotional
    const result = createCompleteBooking(
        "0999888777",
        [{ row: "C", column: 10, price: 100000 }],
        [{ id: "food_010", quantity: 1 }], // VIP Combo
        "st_020",
        "Interstellar",
        "room_001",
        foodCatalogMap,
        true  // Enable promotional tracking
    );

    if (result.promotionalBill) {
        console.log("✅ Promotional Applied!");
        console.log("Promotional Bill ID:", result.promotionalBill.promotional_bill_id);
        console.log("Linked to Bill:", result.promotionalBill.bill_id);
    }

    return result;
}

// ============================================
// EXAMPLE 6: Retrieve Bill Details
// ============================================
import { getBillDetails, getBillById, getTicketsByBillId, getFoodsByBillId } from '@/lib/mock-data';

export function exampleRetrieveBillDetails() {
    const billId = "bill_001";

    // Method 1: Get everything at once
    const details = getBillDetails(billId);
    if (details) {
        console.log("Bill:", details.bill);
        console.log("Tickets:", details.tickets); // Array of individual tickets
        console.log("Foods:", details.foods); // Foods with dates
        console.log("Has Promotional:", details.isPromotional);
    }

    // Method 2: Get individual components
    const bill = getBillById(billId);
    const tickets = getTicketsByBillId(billId);
    const foods = getFoodsByBillId(billId);

    console.log("\n--- Individual Retrieval ---");
    console.log("Bill Total:", bill?.total_price);
    console.log("Number of Tickets:", tickets.length);
    console.log("Number of Food Items:", foods.length);

    return { bill, tickets, foods };
}

// ============================================
// EXAMPLE 7: Integration with Booking Component
// ============================================
export async function exampleBookingComponentIntegration(
    showtimeId: string,
    selectedSeats: Array<{ row: string; column: number; price: number }>,
    selectedFoods: Array<{ id: string; quantity: number }>,
    userPhone: string,
    voucherCode?: string
) {
    // 1. Get movie details from showtime
    const movieName = "Movie Title"; // Get from your showtime data
    const roomId = "room_xyz"; // Get from your showtime data

    // 2. Check if voucher is valid and promotional
    const hasPromotional = voucherCode ? true : false;

    // 3. Create complete booking
    const bookingResult = createCompleteBooking(
        userPhone,
        selectedSeats,
        selectedFoods,
        showtimeId,
        movieName,
        roomId,
        foodCatalogMap,
        hasPromotional
    );

    // 4. Save to database (when backend is ready)
    // await saveBillToDatabase(bookingResult.bill);
    // await saveTicketsToDatabase(bookingResult.tickets);
    // await saveFoodsToDatabase(bookingResult.foods);
    // if (bookingResult.promotionalBill) {
    //   await savePromotionalBillToDatabase(bookingResult.promotionalBill);
    // }

    // 5. Return booking confirmation
    return {
        success: true,
        billId: bookingResult.bill.bill_id,
        ticketCount: bookingResult.tickets.length,
        totalAmount: bookingResult.bill.total_price,
        tickets: bookingResult.tickets,
        foods: bookingResult.foods,
    };
}

// ============================================
// EXAMPLE 8: Display Ticket Details in UI
// ============================================
export function exampleDisplayTicketInUI(ticketId: string) {
    // In a React component:
    /*
    import { mockTickets } from '@/lib/mock-data';
  
    const ticket = mockTickets.find(t => t.ticket_id === ticketId);
  
    return (
      <div className="ticket-card">
        <h3>{ticket.movie_name}</h3>
        <p>Seat: {ticket.seat_row}{ticket.seat_column}</p>
        <p>Room: {ticket.room_id}</p>
        <p>Price: {ticket.price.toLocaleString()} VND</p>
        <p>Purchase Date: {new Date(ticket.purchase_date).toLocaleDateString()}</p>
        <p>Valid Until: {new Date(ticket.expiration_date).toLocaleDateString()}</p>
        <QRCode value={ticket.ticket_id} />
      </div>
    );
    */
}

// ============================================
// EXAMPLE 9: Check Food Expiry Status
// ============================================
export function exampleCheckFoodExpiry(foodId: string) {
    import { mockFoodTrackings } from '@/lib/mock-data';

    const food = mockFoodTrackings.find(f => f.food_id === foodId);
    if (!food) return null;

    const today = new Date();
    const expiryDate = new Date(food.expiration_date);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'fresh' | 'expiring_soon' | 'expired';
    if (daysUntilExpiry < 0) {
        status = 'expired';
    } else if (daysUntilExpiry <= 2) {
        status = 'expiring_soon';
    } else {
        status = 'fresh';
    }

    return {
        food,
        daysUntilExpiry,
        status,
        shouldWarn: status !== 'fresh'
    };
}

// ============================================
// RUN EXAMPLES
// ============================================
if (require.main === module) {
    console.log("=== Example 1: Complete Booking ===");
    exampleCompleteBooking();

    console.log("\n=== Example 2: Ticket Only ===");
    exampleTicketOnlyBooking();

    console.log("\n=== Example 3: Manual Ticket Generation ===");
    exampleManualTicketGeneration();

    console.log("\n=== Example 4: Food with Expiry ===");
    exampleFoodWithExpiryDates();

    console.log("\n=== Example 5: Promotional Tracking ===");
    examplePromotionalBillTracking();

    console.log("\n=== Example 6: Retrieve Bill Details ===");
    exampleRetrieveBillDetails();
}
