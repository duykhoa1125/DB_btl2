/**
 * COMMON & ENUMS
 * Các định nghĩa dùng chung và các ràng buộc (Check Constraints) từ DB
 */

export type EntityState = 'active' | 'inactive';

// Các trạng thái của ghế (lưu ý: state trong bảng SEAT là trạng thái vật lý, 
// còn trạng thái đặt vé sẽ được tính toán riêng)
export type SeatType = 'normal' | 'vip' | 'couple';
export type SeatPhysicalState = 'available' | 'occupied' | 'unavailable' | 'reserved';

// Trạng thái vé trong màn hình đặt vé (Frontend tự định nghĩa thêm để xử lý UI)
export type BookingSeatState = SeatPhysicalState | 'selected' | 'sold';

export type MovieStatus = 'upcoming' | 'showing' | 'ended';
export type MovieLanguage = 'vi' | 'en' | 'ko' | 'ja' | string; // Mặc định 'vi'

export type Gender = 'male' | 'female' | 'unknown';
export type MemberLevel = 'copper' | 'gold' | 'diamond' | 'vip';

export type VoucherState = 'active' | 'used' | 'expired';

/**
 * DATABASE ENTITIES
 * Ánh xạ trực tiếp 1-1 với các bảng trong SQL
 */

// 1. CINEMA & ROOM
export interface Cinema {
    cinema_id: string;
    name: string;
    state: EntityState;
    address: string;
}

export interface Staff {
    staff_id: string;
    name: string;
    phone_number: string;
    manage_id?: string | null;
    cinema_id: string;
}

export interface Room {
    room_id: string;
    cinema_id: string;
    name: string;
    state: EntityState | 'full';
}

export interface Seat {
    room_id: string;
    seat_row: string;      // CHAR(1) - Ví dụ: 'A', 'B'
    seat_column: number;   // INT
    seat_type: SeatType;
    state: SeatPhysicalState;
}

// 2. MOVIE
export interface Movie {
    movie_id: string;
    image: string;
    name: string;
    duration: number;       // Phút
    release_date: string;   // ISO Date String: "2024-05-25"
    end_date: string;       // ISO Date String
    age_rating: number;     // Ví dụ: 13, 16, 18
    trailer?: string | null;
    language: MovieLanguage;
    status: MovieStatus;
    synopsis?: string | null;
}

export interface Director {
    movie_id: string;
    name: string;
}

export interface Actor {
    movie_id: string;
    name: string;
}

// 3. SCHEDULE (SHOWTIME)
export interface Showtime {
    showtime_id: string;
    room_id: string;
    movie_id: string;
    start_date: string;     // "YYYY-MM-DD"
    start_time: string;     // "HH:mm:ss"
    end_time: string;       // "HH:mm:ss"
}

// 4. USER & AUTH
export interface Account {
    phone_number: string;   // PK
    email: string;
    password?: string;      // Thường ẩn khi trả về frontend
    fullname: string;
    birth_date: string;
    gender: Gender;
    avatar?: string | null;
    membership_points: number;
    registration_date: string;
}

export interface Member {
    level: MemberLevel;
    minimum_point: number;
}

export interface AccountMembership {
    phone_number: string;
    level: MemberLevel;
    join_date: string;
}

// 5. BOOKING & TICKET
export interface Bill {
    bill_id: string;
    phone_number: string;
    creation_date: string;  // DATETIME
    total_price: number;
}

export interface PromotionalBill {
    promotional_bill_id: string;
    bill_id: string;
}

export interface Ticket {
    ticket_id: string;
    movie_name: string;
    price: number;
    purchase_date: string;
    expiration_date: string;
    bill_id: string;
    room_id: string;
    seat_row: string;
    seat_column: number;
    showtime_id: string;
}

export interface Food {
    food_id: string;
    bill_id: string;
    name: string;
    description?: string | null;
    price: number;
    production_date: string;  // ISO Date: "2024-11-25"
    expiration_date: string;  // ISO Date: "2024-12-25"
}

// 6. MARKETING (Events, Vouchers, Reviews)
export interface Event {
    event_id: string;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
}

export interface Promotional {
    promotional_id: string;
    event_id: string;
    description?: string;
    start_date: string;
    end_date: string;
    level: MemberLevel;
}

export interface Voucher {
    code: string;
    promotional_id: string;
    start_date: string;
    end_date: string;
    state: VoucherState;
    phone_number: string;
}

export interface Gift {
    promotional_id: string;
    name: string;
    quantity: number;
}

export interface Discount {
    promotional_id: string;
    percent_reduce: number;  // DECIMAL(5,2) - từ 0 đến 100
    max_price_can_reduce: number;
}

export interface MovieReview {
    phone_number: string;
    movie_id: string;
    date_written: string;
    star_rating: number; // 1-5
    review_content: string;
}

/**
 * EXTENDED TYPES FOR FRONTEND UI
 * Các type mở rộng thường dùng khi join bảng hoặc hiển thị UI
 */

// Dùng cho trang chi tiết phim (bao gồm danh sách diễn viên/đạo diễn dạng mảng)
export interface MovieDetail extends Movie {
    directors: string[]; // Mảng tên đạo diễn
    actors: string[];    // Mảng tên diễn viên
    avg_rating?: number; // Điểm đánh giá trung bình (tính toán từ reviews)
}

// Dùng cho trang chọn suất chiếu (cần biết tên rạp và định dạng phòng)
export interface ShowtimeDetail extends Showtime {
    cinema_name: string;
    room_name: string;
    movie_name: string; // Đôi khi cần hiển thị lại
}

// Dùng cho màn hình chọn ghế (quan trọng)
export interface SeatLayoutItem extends Seat {
    is_booked: boolean; // True nếu đã có ticket cho suất chiếu này
    price: number;      // Giá vé (tính toán dựa trên loại ghế và lịch chiếu)
}

// Dùng cho trang thanh toán (Giỏ hàng)
export interface BookingRequest {
    showtime_id: string;
    seats: { row: string; col: number; price: number }[];
    foods: { id: string; quantity: number }[]; // Nếu có menu food cố định
    voucher_code?: string;
    phone_number: string; // Người đặt
}