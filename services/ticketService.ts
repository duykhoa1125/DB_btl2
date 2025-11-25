/**
 * TICKET SERVICE
 * Service xử lý logic cho TICKET - Vé riêng lẻ cho từng ghế
 * Theo SQL schema: mỗi ghế = 1 ticket riêng (không gộp chung như Booking)
 */

import { Ticket, Food, Bill, PromotionalBill } from './types';

/**
 * Tạo ticket riêng lẻ cho từng ghế trong booking
 * @param billId ID của hóa đơn
 * @param seats Danh sách ghế đã đặt
 * @param showtimeId ID suất chiếu
 * @param movieName Tên phim
 * @param roomId ID phòng chiếu
 * @returns Mảng các ticket đã tạo
 */
export function generateTicketsForSeats(
    billId: string,
    seats: Array<{ row: string; column: number; price: number }>,
    showtimeId: string,
    movieName: string,
    roomId: string
): Ticket[] {
    const purchaseDate = new Date().toISOString();

    // Tính expiration_date = purchase_date + 30 ngày
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    return seats.map((seat, index) => ({
        ticket_id: `ticket_${billId}_${seat.row}${seat.column}`,
        movie_name: movieName,
        price: seat.price,
        purchase_date: purchaseDate,
        expiration_date: expirationDate.toISOString(),
        bill_id: billId,
        room_id: roomId,
        seat_row: seat.row,
        seat_column: seat.column,
        showtime_id: showtimeId,
    }));
}

/**
 * Tạo Food items với ngày sản xuất và hết hạn
 * @param billId ID của hóa đơn
 * @param foodItems Danh sách món ăn và số lượng
 * @param foodCatalog Catalog của các món ăn có sẵn
 * @returns Mảng Food đã tạo với ngày SX và HSD
 */
export function generateFoodItemsWithDates(
    billId: string,
    foodItems: Array<{ id: string; quantity: number }>,
    foodCatalog: Map<string, { name: string; description?: string; price: number; shelfLifeDays: number }>
): Food[] {
    const productionDate = new Date();

    return foodItems.flatMap((item) => {
        const foodInfo = foodCatalog.get(item.id);
        if (!foodInfo) return [];

        // Tính expiration_date dựa vào shelf life
        const expirationDate = new Date(productionDate);
        expirationDate.setDate(expirationDate.getDate() + foodInfo.shelfLifeDays);

        // Tạo quantity records riêng biệt cho mỗi món ăn (database không có field quantity)
        // Ví dụ: 2 Coca → tạo 2 Food records
        return Array.from({ length: item.quantity }, (_, index) => ({
            food_id: `food_${billId}_${item.id}_${index + 1}`,
            bill_id: billId,
            name: foodInfo.name,
            description: foodInfo.description,
            price: foodInfo.price,
            production_date: productionDate.toISOString().split('T')[0], // "YYYY-MM-DD"
            expiration_date: expirationDate.toISOString().split('T')[0],
        }));
    });
}

/**
 * Tạo Bill (Hóa đơn tổng)
 * @param phoneNumber Số điện thoại khách hàng
 * @param totalPrice Tổng tiền
 * @returns Bill mới
 */
export function createBill(
    phoneNumber: string,
    totalPrice: number
): Bill {
    const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        bill_id: billId,
        phone_number: phoneNumber,
        creation_date: new Date().toISOString(),
        total_price: totalPrice,
    };
}

/**
 * Tạo PromotionalBill nếu có voucher/promotional được áp dụng
 * @param billId ID của hóa đơn
 * @returns PromotionalBill
 */
export function createPromotionalBill(billId: string): PromotionalBill {
    return {
        promotional_bill_id: `promo_bill_${billId}`,
        bill_id: billId,
    };
}

/**
 * Workflow hoàn chỉnh: Tạo Bill + Tickets + Foods + PromotionalBill
 */
export interface CompleteBookingResult {
    bill: Bill;
    tickets: Ticket[];
    foods: Food[];
    promotionalBill?: PromotionalBill;
}

export function createCompleteBooking(
    phoneNumber: string,
    seats: Array<{ row: string; column: number; price: number }>,
    foodItems: Array<{ id: string; quantity: number }>,
    showtimeId: string,
    movieName: string,
    roomId: string,
    foodCatalog: Map<string, { name: string; description?: string; price: number; shelfLifeDays: number }>,
    hasPromotional: boolean = false
): CompleteBookingResult {
    // 1. Tính tổng tiền
    const ticketTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    const foodTotal = foodItems.reduce((sum, item) => {
        const foodInfo = foodCatalog.get(item.id);
        return sum + (foodInfo ? foodInfo.price * item.quantity : 0);
    }, 0);
    const totalPrice = ticketTotal + foodTotal;

    // 2. Tạo Bill
    const bill = createBill(phoneNumber, totalPrice);

    // 3. Tạo Tickets (mỗi ghế = 1 ticket)
    const tickets = generateTicketsForSeats(bill.bill_id, seats, showtimeId, movieName, roomId);

    // 4. Tạo Foods với ngày SX/HSD
    const foods = generateFoodItemsWithDates(bill.bill_id, foodItems, foodCatalog);

    // 5. Tạo PromotionalBill nếu có
    const promotionalBill = hasPromotional ? createPromotionalBill(bill.bill_id) : undefined;

    return {
        bill,
        tickets,
        foods,
        promotionalBill,
    };
}
