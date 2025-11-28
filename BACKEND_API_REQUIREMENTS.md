# Tài liệu Yêu cầu Backend API - Hệ thống Đặt vé Xem phim

> **LƯU Ý QUAN TRỌNG:** Tài liệu này dành cho **team backend thật** sẽ implement API với MySQL database thực tế, KHÔNG phải cho mock API hiện tại của frontend.

## Mục lục

- [1. Quy ước chung](#1-quy-ước-chung)
- [2. Authentication \& Authorization](#2-authentication--authorization)
- [3. Movies Management](#3-movies-management)
- [4. Cinemas \& Rooms Management](#4-cinemas--rooms-management)
- [5. Seats Management](#5-seats-management)
- [6. Showtimes Management](#6-showtimes-management)
- [7. Booking \& Bills](#7-booking--bills)
- [8. Food/Concessions](#8-foodconcessions)
- [9. Events \& Promotions](#9-events--promotions)
- [10. Vouchers](#10-vouchers)
- [11. Reviews](#11-reviews)
- [12. Memberships](#12-memberships)
- [13. Staff Management](#13-staff-management)
- [14. Admin Dashboard](#14-admin-dashboard)
- [15. Error Handling](#15-error-handling)
- [16. Business Logic Requirements](#16-business-logic-requirements)
- [17. Database Triggers \& Constraints](#17-database-triggers--constraints)

---

## 1. Quy ước chung

### Base Configuration

- **Base URL**: `/api` (hoặc theo config từ `NEXT_PUBLIC_API_URL`)
- **Data Format**: JSON
- **Charset**: UTF-8
- **HTTP Methods**: GET, POST, PUT, DELETE

### Naming Convention

> **QUAN TRỌNG:** API **PHẢI** trả về JSON objects với keys theo format **snake_case** để match với database schema và TypeScript interfaces của frontend.

**Ví dụ:**

```json
{
  "cinema_id": "CIN00001",
  "phone_number": "0912345678",
  "start_date": "2024-05-25",
  "membership_points": 1500
}
```

**KHÔNG SỬ DỤNG camelCase** như `cinemaId`, `phoneNumber`, `startDate`, `membershipPoints`.

### Date/Time Formats

- **Dates**: `YYYY-MM-DD` (ví dụ: `"2024-05-25"`)
- **Times**: `HH:mm:ss` (ví dụ: `"09:00:00"`)
- **Datetimes**: ISO 8601 hoặc `YYYY-MM-DD HH:mm:ss` (ví dụ: `"2024-05-25 09:00:00"`)

### Authentication

- **Method**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Token Location (Client)**: `localStorage.getItem('token')`
- **Auto-attach**: Frontend tự động attach token vào mọi request thông qua axios interceptor

### Response Format

#### Success Response

Trả về data trực tiếp (không wrap trong `{data: ...}`):

```json
// Single object
{
  "movie_id": "MOV00001",
  "name": "Avengers: Endgame",
  "duration": 181
}

// Array
[
  { "cinema_id": "CIN00001", "name": "CGV Hùng Vương" },
  { "cinema_id": "CIN00002", "name": "Lotte Cinema Đà Nẵng" }
]
```

#### Error Response

```json
{
  "error": "Mô tả lỗi dễ hiểu cho user",
  "details": "Chi tiết kỹ thuật (optional, chỉ dùng cho debugging)"
}
```

### HTTP Status Codes

| Code | Ý nghĩa               | Khi nào sử dụng                                                    |
| ---- | --------------------- | ------------------------------------------------------------------ |
| 200  | OK                    | Request thành công                                                 |
| 201  | Created               | Tạo resource thành công (POST)                                     |
| 400  | Bad Request           | Request không hợp lệ (thiếu field, sai format)                     |
| 401  | Unauthorized          | Chưa đăng nhập hoặc token không hợp lệ                             |
| 403  | Forbidden             | Không có quyền truy cập (ví dụ: user cố truy cập admin endpoint)   |
| 404  | Not Found             | Resource không tồn tại                                             |
| 409  | Conflict              | Xung đột business logic (ví dụ: email đã tồn tại, ghế đã được đặt) |
| 500  | Internal Server Error | Lỗi server                                                         |

### Pagination (Tương lai)

> **LƯU Ý:** Hiện tại frontend CHƯA implement pagination. Có thể bỏ qua phần này trong version 1.0.

Khi cần implement pagination cho các endpoints trả về list lớn:

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số items mỗi trang (default: 20, max: 100)

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## 2. Authentication & Authorization

### Authorization Rules

> **QUY TẮC QUAN TRỌNG VỀ PHÂN QUYỀN:**

#### Roles trong hệ thống:

- **`user`**: Khách hàng thông thường (từ bảng `ACCOUNT`)
- **`admin`**: Nhân viên quản lý (từ bảng `STAFF`)

#### Access Control Logic:

1. **Admin có thể truy cập MỌI routes của user**

   - Admin có thể xem movies, showtimes, đặt vé như user bình thường
   - Admin có thể access `/movies`, `/cinemas`, `/showtimes`, `/bills`, v.v.
   - Admin CÓ THỂ đặt vé cho khách hàng

2. **User KHÔNG THỂ truy cập admin routes**
   - User không thể access `/admin/*` endpoints
   - User không thể quản lý movies, cinemas, staff, v.v.
   - Nếu user cố truy cập admin endpoint → Trả về `403 Forbidden`

#### Implementation Guide:

```javascript
// Middleware/Guard logic
function checkPermission(requiredRole, userRole) {
  // Admin có thể access tất cả
  if (userRole === "admin") {
    return true;
  }

  // User chỉ có thể access user endpoints
  if (requiredRole === "user" && userRole === "user") {
    return true;
  }

  // Block user khỏi admin endpoints
  if (requiredRole === "admin" && userRole === "user") {
    return false; // 403 Forbidden
  }

  return false;
}
```

#### Endpoint Permissions Table:

| Endpoint Category       | Required Role | Admin Access   | User Access    |
| ----------------------- | ------------- | -------------- | -------------- |
| `POST /auth/login`      | Public        | ✅             | ✅             |
| `POST /auth/register`   | Public        | ✅             | ✅             |
| `GET /auth/me`          | Authenticated | ✅             | ✅             |
| `GET /movies/*`         | Public/User   | ✅             | ✅             |
| `POST /movies` (create) | **Admin**     | ✅             | ❌ (403)       |
| `PUT /movies/:id`       | **Admin**     | ✅             | ❌ (403)       |
| `DELETE /movies/:id`    | **Admin**     | ✅             | ❌ (403)       |
| `GET /cinemas/*`        | Public        | ✅             | ✅             |
| `POST /cinemas`         | **Admin**     | ✅             | ❌ (403)       |
| `GET /showtimes/*`      | Public        | ✅             | ✅             |
| `POST /showtimes`       | **Admin**     | ✅             | ❌ (403)       |
| `POST /bills` (booking) | User          | ✅             | ✅             |
| `GET /bills`            | User          | ✅ (all bills) | ✅ (own bills) |
| `POST /reviews`         | User          | ✅             | ✅             |
| `GET /staff/*`          | **Admin**     | ✅             | ❌ (403)       |
| `POST /staff`           | **Admin**     | ✅             | ❌ (403)       |
| `GET /admin/stats`      | **Admin**     | ✅             | ❌ (403)       |

**Lưu ý:**

- ✅ = Có quyền truy cập
- ❌ = Không có quyền (trả về 403)
- Public = Không cần authentication
- User = Cần authentication (cả admin và user)
- **Admin** = Chỉ admin mới access được

---

### 2.1. Login - `POST /auth/login`

**Mô tả:** Đăng nhập cho cả User và Admin. Hệ thống tự động phát hiện role dựa trên `identifier`.

**Request Body:**

```json
{
  "identifier": "user@gmail.com", // Email (user only) hoặc phone (user/admin)
  "password": "password123"
}
```

**Logic:**

1. Nếu `identifier` chứa `@` → Email login → Chỉ tìm trong bảng `ACCOUNT` (user)
2. Nếu `identifier` là số điện thoại:
   - Tìm trong `STAFF` trước (admin)
   - Nếu không tìm thấy, tìm trong `ACCOUNT` (user)

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    // Nếu role = "user" (từ ACCOUNT)
    "phone_number": "0912345678",
    "email": "user1@gmail.com",
    "fullname": "Nguyễn Văn An",
    "birth_date": "1990-05-15",
    "gender": "male",
    "avatar": "https://...",
    "membership_points": 1500,
    "registration_date": "2024-01-01",
    "role": "user"
  }
  // HOẶC nếu role = "admin" (từ STAFF)
  // {
  //   "staff_id": "STA00001",
  //   "name": "Nguyễn Văn A",
  //   "phone_number": "0901111111",
  //   "role": "admin"
  // }
}
```

**Errors:**

- `400`: Thiếu identifier hoặc password
- `401`: Sai thông tin đăng nhập

---

### 2.2. Register - `POST /auth/register`

**Mô tả:** Đăng ký tài khoản user mới.

**Request Body:**

```json
{
  "email": "user@gmail.com",
  "password": "password123", // Min 6 ký tự
  "fullname": "Nguyễn Văn An",
  "birth_date": "1990-05-15",
  "gender": "male" // "male" | "female" | "unknown"
}
```

**Business Logic:**

1. Auto-generate `phone_number` HOẶC bắt user nhập phone (tùy requirement)
2. Set `membership_points = 0`
3. Set `registration_date = CURRENT_TIMESTAMP`
4. Tự động tạo `ACCOUNT_MEMBERSHIP` với `level = 'copper'`

**Response (201):**

```json
{
  "token": "...",
  "user": {
    "phone_number": "0912345678",
    "email": "user@gmail.com",
    "fullname": "Nguyễn Văn An",
    "role": "user",
    ...
  }
}
```

**Errors:**

- `400`: Thiếu required fields, password quá ngắn, email sai format
- `409`: Email hoặc phone đã tồn tại

---

### 2.3. Get Current User - `GET /auth/me`

**Mô tả:** Lấy thông tin user hiện tại từ JWT token.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "phone_number": "0912345678",
  "email": "user1@gmail.com",
  "fullname": "Nguyễn Văn An",
  "birth_date": "1990-05-15",
  "gender": "male",
  "avatar": "https://...",
  "membership_points": 1500,
  "registration_date": "2024-01-01",
  "role": "user",
  "level": "gold" // JOIN với ACCOUNT_MEMBERSHIP để lấy level
}
```

**Errors:**

- `401`: Token không hợp lệ hoặc hết hạn

---

### 2.4. Get Account by Phone - `GET /accounts/:phone`

**Mô tả:** Lấy thông tin account theo số điện thoại (Admin only hoặc chính user đó).

**Response (200):**

```json
{
  "phone_number": "0912345678",
  "email": "user1@gmail.com",
  "fullname": "Nguyễn Văn An",
  ...
}
```

---

### 2.5. Update Account Profile - `PUT /accounts/:phone`

**Mô tả:** Cập nhật thông tin profile (only chính user đó hoặc admin).

**Request Body (các field đều optional):**

```json
{
  "fullname": "Nguyễn Văn An Updated",
  "birth_date": "1990-05-15",
  "gender": "male",
  "avatar": "https://..."
}
```

**Response (200):** Trả về account object đã update.

---

### 2.6. Check Email Exists - `GET /accounts/email/:email`

**Mô tả:** Kiểm tra email đã tồn tại chưa (dùng cho form validation).

**Response (200):**

```json
{
  "exists": true
}
```

---

## 3. Movies Management

### 3.1. Get All Movies - `GET /movies`

**Query Parameters (optional):**

- `status`: `'showing'` | `'upcoming'` | `'ended'`

**Response (200):**

```json
[
  {
    "movie_id": "MOV00001",
    "image": "https://...",
    "name": "Avengers: Endgame",
    "duration": 181,
    "release_date": "2024-04-26",
    "end_date": "2024-06-26",
    "age_rating": 13,
    "trailer": "https://youtube.com/...",
    "language": "en",
    "status": "showing",
    "synopsis": "Phim siêu anh hùng của Marvel"
  },
  ...
]
```

---

### 3.2. Get Movie by ID - `GET /movies/:id`

**Response (200):** Trả về single `Movie` object.

**Errors:**

- `404`: Movie không tồn tại

---

### 3.3. Get Movie with Details - `GET /movies/:id/details`

**Mô tả:** Lấy thông tin chi tiết movie + directors + actors + avg_rating.

**Response (200):**

```json
{
  "movie_id": "MOV00001",
  "name": "Avengers: Endgame",
  "duration": 181,
  ...
  "directors": ["Anthony Russo", "Joe Russo"],
  "actors": ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
  "avg_rating": 4.8  // Tính từ bảng MOVIE_REVIEW
}
```

**SQL Logic:**

```sql
-- Get directors
SELECT name FROM DIRECTOR WHERE movie_id = :movie_id

-- Get actors
SELECT name FROM ACTOR WHERE movie_id = :movie_id

-- Calculate avg_rating
SELECT AVG(star_rating) FROM MOVIE_REVIEW WHERE movie_id = :movie_id
```

---

### 3.4. Get All Movies with Details - `GET /movies/details`

**Response (200):** Array of `MovieDetail` objects (giống 3.3 nhưng cho tất cả movies).

---

### 3.5. Create Movie (Admin) - `POST /movies`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "image": "https://...",
  "name": "Avengers: Endgame",
  "duration": 181,
  "release_date": "2024-04-26",
  "end_date": "2024-06-26",
  "age_rating": 13,
  "trailer": "https://...",
  "language": "en",
  "status": "showing",
  "synopsis": "...",
  "directors": ["Anthony Russo", "Joe Russo"],
  "actors": ["Robert Downey Jr.", "Chris Evans"]
}
```

**Business Logic:**

1. Trigger `before_insert_movie` sẽ auto-generate `movie_id` (MOV00001, MOV00002, ...)
2. Insert vào bảng `MOVIE`
3. Insert directors vào bảng `DIRECTOR`
4. Insert actors vào bảng `ACTOR`

**Response (201):** Trả về `Movie` object đã tạo (bao gồm `movie_id`).

**Errors:**

- `401`: Chưa đăng nhập
- `403`: Không phải admin
- `400`: Thiếu required fields, `end_date < release_date`

---

### 3.6. Update Movie (Admin) - `PUT /movies/:id`

**Request Body:** Giống 3.5 nhưng tất cả fields đều optional.

**Response (200):** Trả về `Movie` object đã update.

---

### 3.7. Delete Movie (Admin) - `DELETE /movies/:id`

**Response (200):**

```json
{
  "message": "Movie deleted successfully"
}
```

**Errors:**

- `404`: Movie không tồn tại
- `409`: Không thể xóa vì có liên kết với showtimes/tickets

---

## 4. Cinemas & Rooms Management

### 4.1. Get All Cinemas - `GET /cinemas`

**Response (200):**

```json
[
  {
    "cinema_id": "CIN00001",
    "name": "CGV Hùng Vương Plaza",
    "state": "active",
    "address": "126 Hùng Vương, Quận 5, TP.HCM"
  },
  ...
]
```

---

### 4.2. Get Cinema by ID - `GET /cinemas/:id`

**Response (200):** Single `Cinema` object.

---

### 4.3. Get Rooms by Cinema - `GET /cinemas/:id/rooms`

**Response (200):**

```json
[
  {
    "room_id": "ROO00001",
    "cinema_id": "CIN00001",
    "name": "R01",
    "state": "active"
  },
  ...
]
```

---

### 4.4. Create Cinema (Admin) - `POST /cinemas`

**Request Body:**

```json
{
  "name": "CGV Vĩnh Trung Plaza",
  "state": "active",
  "address": "255-257 Hùng Vương, Quận Thanh Khê, Đà Nẵng"
}
```

**Response (201):** Trả về `Cinema` object với `cinema_id` auto-generated.

---

### 4.5. Update/Delete Cinema - `PUT/DELETE /cinemas/:id`

Tương tự Movies Management.

---

### 4.6. Rooms CRUD

- **Get All Rooms**: `GET /rooms`
- **Get Room by ID**: `GET /rooms/:id`
- **Create Room (Admin)**: `POST /rooms`
  ```json
  {
    "cinema_id": "CIN00001",
    "name": "R01",
    "state": "active"
  }
  ```
- **Update Room**: `PUT /rooms/:id`
- **Delete Room**: `DELETE /rooms/:id`

---

## 5. Seats Management

### 5.1. Get Seats by Room - `GET /rooms/:id/seats`

**Response (200):**

```json
[
  {
    "room_id": "ROO00001",
    "seat_row": "A",
    "seat_column": 1,
    "seat_type": "normal",
    "state": "available"
  },
  {
    "room_id": "ROO00001",
    "seat_row": "B",
    "seat_column": 4,
    "seat_type": "vip",
    "state": "occupied"
  },
  ...
]
```

---

### 5.2. Create Seats (Admin) - `POST /seats`

**Mô tả:** Hỗ trợ batch creation để tạo nhiều ghế cùng lúc.

**Request Body:**

```json
{
  "room_id": "ROO00001",
  "seats": [
    { "seat_row": "A", "seat_column": 1, "seat_type": "normal" },
    { "seat_row": "A", "seat_column": 2, "seat_type": "normal" },
    { "seat_row": "B", "seat_column": 1, "seat_type": "vip" }
  ]
}
```

**Response (201):**

```json
{
  "message": "Created 3 seats successfully"
}
```

---

### 5.3. Update Seat - `PUT /seats/:room_id/:row/:col`

**Request Body:**

```json
{
  "seat_type": "vip",
  "state": "unavailable"
}
```

---

### 5.4. Delete Seat - `DELETE /seats/:room_id/:row/:col`

---

## 6. Showtimes Management

### 6.1. Get Showtimes - `GET /showtimes`

**Query Parameters (optional):**

- `movie_id`: Filter by movie
- `cinema_id`: Filter by cinema
- `room_id`: Filter by room
- `date`: Filter by date (YYYY-MM-DD)

**Response (200):**

```json
[
  {
    "showtime_id": "SHO00001",
    "room_id": "ROO00001",
    "movie_id": "MOV00001",
    "start_date": "2024-05-25",
    "start_time": "09:00:00",
    "end_time": "12:01:00"
  },
  ...
]
```

---

### 6.2. Get Showtime by ID - `GET /showtimes/:id`

**Response (200):** Single `Showtime` object.

---

### 6.3. Get Showtime Seats - `GET /showtimes/:id/seats`

**Mô tả:** Lấy layout ghế cho một suất chiếu cụ thể, bao gồm trạng thái đã đặt và giá vé.

**Response (200):**

```json
[
  {
    "room_id": "ROO00001",
    "seat_row": "A",
    "seat_column": 1,
    "seat_type": "normal",
    "state": "available",     // Trạng thái vật lý từ bảng SEAT
    "is_booked": false,       // Kiểm tra trong bảng TICKET cho showtime này
    "price": 75000            // Tính toán dựa trên seat_type
  },
  {
    "room_id": "ROO00001",
    "seat_row": "B",
    "seat_column": 4,
    "seat_type": "vip",
    "state": "available",
    "is_booked": true,        // Đã có vé
    "price": 120000
  },
  ...
]
```

**Business Logic - Tính `is_booked`:**

```sql
SELECT COUNT(*) > 0 as is_booked
FROM TICKET
WHERE showtime_id = :showtime_id
  AND room_id = :room_id
  AND seat_row = :seat_row
  AND seat_column = :seat_column
```

**Business Logic - Tính `price`:**

```javascript
// Ví dụ logic, có thể customize
const basePrices = {
  normal: 75000,
  vip: 120000,
  couple: 150000,
};
price = basePrices[seat_type];
// Có thể thêm logic giảm giá theo giờ chiếu, ngày trong tuần, v.v.
```

---

### 6.4. Create Showtime (Admin) - `POST /showtimes`

**Request Body:**

```json
{
  "room_id": "ROO00001",
  "movie_id": "MOV00001",
  "start_date": "2024-05-25",
  "start_time": "09:00:00",
  "end_time": "12:01:00"
}
```

**Validation QUAN TRỌNG:**

1. Kiểm tra `end_time > start_time`
2. **Kiểm tra conflict với showtimes khác trong cùng room:**
   ```sql
   SELECT COUNT(*) FROM SHOWTIME
   WHERE room_id = :room_id
     AND start_date = :start_date
     AND (
       (:start_time BETWEEN start_time AND end_time)
       OR (:end_time BETWEEN start_time AND end_time)
       OR (start_time BETWEEN :start_time AND :end_time)
     )
   ```
   Nếu COUNT > 0 → Conflict → Trả về `409 Conflict`

**Response (201):** Trả về `Showtime` object với `showtime_id` auto-generated.

---

### 6.5. Update/Delete Showtime - `PUT/DELETE /showtimes/:id`

Tương tự, với validation conflict khi update.

---

## 7. Booking & Bills

### 7.1. Create Booking - `POST /bills`

**Mô tả:** Endpoint phức tạp nhất, xử lý toàn bộ quy trình đặt vé.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "showtime_id": "SHO00001",
  "seats": [
    { "row": "A", "col": 1, "price": 75000 },
    { "row": "A", "col": 2, "price": 75000 }
  ],
  "foods": [
    // Optional
    {
      "name": "Combo A",
      "description": "1 bỏng + 1 nước",
      "quantity": 1,
      "price": 60000
    }
  ],
  "voucher_code": "VOU00001" // Optional
}
```

**Business Logic (Transaction):**

```javascript
BEGIN TRANSACTION;

try {
  // 1. Validate seats chưa được đặt
  for (seat of seats) {
    const exists = await checkSeatBooked(showtime_id, seat.row, seat.col);
    if (exists) {
      throw new Error(`Ghế ${seat.row}${seat.col} đã được đặt`);
    }
  }

  // 2. Validate và apply voucher (nếu có)
  let discount = 0;
  if (voucher_code) {
    const voucher = await validateVoucher(voucher_code, phone_number);
    if (!voucher.valid) {
      throw new Error('Voucher không hợp lệ');
    }
    // Get discount từ bảng DISCOUNT
    discount = calculateDiscount(voucher, total_price);

    // Update voucher state = 'used'
    await updateVoucherState(voucher_code, 'used');
  }

  // 3. Create BILL
  const ticket_total = seats.reduce((sum, s) => sum + s.price, 0);
  const food_total = foods.reduce((sum, f) => sum + (f.price * f.quantity), 0);
  const total_price = ticket_total + food_total - discount;

  const bill_id = await createBill({
    phone_number: current_user.phone_number,
    total_price: total_price
  });

  // 4. Create TICKETs
  const showtime = await getShowtime(showtime_id);
  const movie = await getMovie(showtime.movie_id);

  for (seat of seats) {
    await createTicket({
      movie_name: movie.name,
      price: seat.price,
      expiration_date: `${showtime.start_date} ${showtime.end_time}`,
      bill_id: bill_id,
      room_id: showtime.room_id,
      seat_row: seat.row,
      seat_column: seat.col,
      showtime_id: showtime_id
    });
  }

  // 5. Create FOODs (nếu có)
  for (food of foods) {
    await createFood({
      bill_id: bill_id,
      name: food.name,
      description: food.description,
      price: food.price,
      production_date: TODAY,
      expiration_date: TODAY + 2_DAYS  // Ví dụ
    });
  }

  // 6. Update membership points
  const points = Math.floor(total_price / 1000);  // 1 điểm per 1000 VND
  await updateMembershipPoints(phone_number, points);

  // 7. If voucher applied, create PROMOTIONAL_BILL
  if (voucher_code) {
    await createPromotionalBill({ bill_id: bill_id });
  }

  COMMIT;

  return { bill_id, total_price, discount, points_earned: points };

} catch (error) {
  ROLLBACK;
  throw error;
}
```

**Response (201):**

```json
{
  "bill_id": "BIL00001",
  "total_price": 250000,
  "discount": 50000,
  "points_earned": 250,
  "message": "Đặt vé thành công"
}
```

**Errors:**

- `400`: Thiếu required fields
- `409`: Ghế đã được đặt
- `404`: Showtime không tồn tại
- `400`: Voucher không hợp lệ

---

### 7.2. Get Bills by User - `GET /bills`

**Query Parameters:**

- `phone_number`: Filter by phone (admin có thể xem tất cả, user chỉ xem của mình)

**Response (200):**

```json
[
  {
    "bill_id": "BIL00001",
    "phone_number": "0912345678",
    "creation_date": "2024-05-25 10:30:00",
    "total_price": 250000
  },
  ...
]
```

---

### 7.3. Get Bill Details - `GET /bills/:id`

**Response (200):**

```json
{
  "bill_id": "BIL00001",
  "phone_number": "0912345678",
  "creation_date": "2024-05-25 10:30:00",
  "total_price": 250000
}
```

---

### 7.4. Get Bill Tickets - `GET /bills/:id/tickets`

**Response (200):**

```json
[
  {
    "ticket_id": "TIC00001",
    "movie_name": "Avengers: Endgame",
    "price": 85000,
    "purchase_date": "2024-05-25 10:30:00",
    "expiration_date": "2024-05-25 12:01:00",
    "bill_id": "BIL00001",
    "room_id": "ROO00001",
    "seat_row": "B",
    "seat_column": 4,
    "showtime_id": "SHO00001"
  },
  ...
]
```

---

### 7.5. Get Bill Foods - `GET /bills/:id/foods`

**Response (200):**

```json
[
  {
    "food_id": "FOO00001",
    "bill_id": "BIL00001",
    "name": "Combo A",
    "description": "1 bỏng + 1 nước",
    "price": 60000,
    "production_date": "2024-05-24",
    "expiration_date": "2024-05-26"
  },
  ...
]
```

---

### 7.6. Get All Tickets (Admin) - `GET /tickets`

**Response (200):** Array of all `Ticket` objects.

---

## 8. Food/Concessions

### 8.1. Get Food Menu - `GET /foods/menu`

**Mô tả:** Lấy danh sách món ăn/đồ uống có sẵn để đặt.

> **LƯU Ý:** Bảng `FOOD` trong database lưu các món đã BÁN (linked to BILL). Cần tạo logic riêng để quản lý menu items. Có thể:
>
> - Hardcode menu trong backend
> - Tạo bảng `MENU_ITEM` riêng
> - Hoặc lấy từ `FOOD` nhưng group by `name` và lấy item gần nhất

**Response (200):**

```json
[
  {
    "name": "Combo A",
    "description": "1 bỏng + 1 nước",
    "price": 60000,
    "image": "https://..."
  },
  {
    "name": "Combo B",
    "description": "2 bỏng + 2 nước",
    "price": 110000,
    "image": "https://..."
  },
  ...
]
```

---

### 8.2. Get All Food Items Sold (Admin) - `GET /foods`

**Query Parameters:**

- `bill_id`: Filter by bill (optional)

**Response (200):** Array of `Food` objects from database.

---

### 8.3. Create/Update/Delete Menu Item (Admin)

- `POST /foods/menu`
- `PUT /foods/menu/:id`
- `DELETE /foods/menu/:id`

---

## 9. Events & Promotions

### 9.1. Get All Events - `GET /events`

**Response (200):**

```json
[
  {
    "event_id": "EVE00001",
    "name": "Khuyến mãi tháng 5",
    "description": "Ưu đãi đặc biệt cho khách hàng trong tháng 5",
    "start_date": "2024-05-01",
    "end_date": "2024-05-31"
  },
  ...
]
```

---

### 9.2. Get Active Events - `GET /events/active`

**Mô tả:** Lấy các events đang diễn ra (TODAY between start_date and end_date).

**Response (200):** Array of `Event` objects.

---

### 9.3. Get Upcoming Events - `GET /events/upcoming`

**Mô tả:** Lấy các events sắp diễn ra (start_date > TODAY).

---

### 9.4. Get Event by ID - `GET /events/:id`

---

### 9.5. Get Promotionals - `GET /promotionals`

**Query Parameters:**

- `event_id`: Filter by event (optional)
- `active`: `true` để lấy promotionals đang active

**Response (200):**

```json
[
  {
    "promotional_id": "PRO00001",
    "event_id": "EVE00001",
    "description": "Giảm 20% cho tất cả các suất chiếu",
    "start_date": "2024-05-01",
    "end_date": "2024-05-31",
    "level": "copper"  // Required membership level
  },
  ...
]
```

---

### 9.6. Get Promotional Details - `GET /promotionals/:id`

**Response (200):** Single `Promotional` object.

---

### 9.7. Get Promotional Gifts - `GET /promotionals/:id/gifts`

**Response (200):**

```json
[
  {
    "promotional_id": "PRO00002",
    "name": "Combo bỏng nước size M",
    "quantity": 1000
  }
]
```

---

### 9.8. Get Promotional Discounts - `GET /promotionals/:id/discounts`

**Response (200):**

```json
[
  {
    "promotional_id": "PRO00001",
    "percent_reduce": 20.0,
    "max_price_can_reduce": 50000
  }
]
```

---

### 9.9. Events & Promotionals CRUD (Admin)

- `POST /events`
- `PUT /events/:id`
- `DELETE /events/:id`
- `POST /promotionals`
- `PUT /promotionals/:id`
- `DELETE /promotionals/:id`

---

## 10. Vouchers

### 10.1. Get Voucher by Code - `GET /vouchers/:code`

**Mô tả:** Validate voucher code.

**Response (200):**

```json
{
  "code": "VOU00001",
  "promotional_id": "PRO00001",
  "start_date": "2024-05-01",
  "end_date": "2024-05-31",
  "state": "active",
  "phone_number": "0912345678",
  "valid": true // Calculated: state='active' AND TODAY between start_date and end_date
}
```

**Errors:**

- `404`: Voucher không tồn tại
- `400`: Voucher đã sử dụng hoặc hết hạn (trả về với `valid: false`)

---

### 10.2. Get Voucher Details - `GET /vouchers/:code/details`

**Mô tả:** Lấy voucher kèm thông tin promotional và discount/gift.

**Response (200):**

```json
{
  "code": "VOU00001",
  "state": "active",
  "start_date": "2024-05-01",
  "end_date": "2024-05-31",
  "promotional": {
    "promotional_id": "PRO00001",
    "description": "Giảm 20% cho tất cả các suất chiếu",
    "level": "copper"
  },
  "discount": {
    "percent_reduce": 20.0,
    "max_price_can_reduce": 50000
  },
  "gift": null // hoặc gift object nếu promotional có gift
}
```

---

### 10.3. Get Active Vouchers by User - `GET /vouchers/active`

**Query Parameters:**

- `phone_number`: Required

**Response (200):** Array of active vouchers của user.

---

### 10.4. Create Voucher (Admin) - `POST /vouchers`

**Request Body:**

```json
{
  "promotional_id": "PRO00001",
  "start_date": "2024-05-01",
  "end_date": "2024-05-31",
  "state": "active",
  "phone_number": "0912345678"
}
```

**Response (201):** Trả về `Voucher` object với `code` auto-generated (VOU00001, VOU00002, ...).

---

### 10.5. Update Voucher State (Admin) - `PUT /vouchers/:code`

**Request Body:**

```json
{
  "state": "used" // 'active' | 'used' | 'expired'
}
```

---

## 11. Reviews

### 11.1. Get Reviews - `GET /reviews`

**Query Parameters:**

- `movie_id`: Filter by movie (optional)
- `phone_number`: Filter by user (optional)

**Response (200):**

```json
[
  {
    "phone_number": "0912345678",
    "movie_id": "MOV00001",
    "date_written": "2024-05-25 14:30:00",
    "star_rating": 5,
    "review_content": "Phim hay tuyệt vời! Hiệu ứng đỉnh cao",
    "user_fullname": "Nguyễn Văn An"  // JOIN với ACCOUNT
  },
  ...
]
```

---

### 11.2. Create Review - `POST /reviews`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "movie_id": "MOV00001",
  "star_rating": 5, // 1-5
  "review_content": "Phim hay tuyệt vời!"
}
```

**Business Logic:**

- `phone_number` lấy từ JWT token
- `date_written` = CURRENT_TIMESTAMP
- Validate: `star_rating` between 1 and 5

**Response (201):** Trả về `MovieReview` object.

**Errors:**

- `400`: `star_rating` không hợp lệ
- `409`: User đã review movie này rồi (nếu muốn giới hạn 1 review/user/movie)

---

### 11.3. Update Review - `PUT /reviews/:phone/:movie_id/:date`

**Mô tả:** Update review content hoặc rating.

**Request Body:**

```json
{
  "star_rating": 4,
  "review_content": "Updated content"
}
```

---

### 11.4. Delete Review - `DELETE /reviews/:phone/:movie_id/:date`

**Authorization:** Chỉ chính user đó hoặc admin.

---

## 12. Memberships

### 12.1. Get All Membership Levels - `GET /memberships`

**Response (200):**

```json
[
  {
    "level": "copper",
    "minimum_point": 0
  },
  {
    "level": "gold",
    "minimum_point": 1000
  },
  {
    "level": "diamond",
    "minimum_point": 2500
  },
  {
    "level": "vip",
    "minimum_point": 5000
  }
]
```

---

### 12.2. Get User Membership Progress - `GET /memberships/progress`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "current_points": 1500,
  "current_level": "gold",
  "next_level": "diamond",
  "points_to_next_level": 1000,
  "progress_percentage": 60 // (1500 / 2500) * 100
}
```

**Business Logic:**

```javascript
const levels = [
  { level: "copper", min: 0 },
  { level: "gold", min: 1000 },
  { level: "diamond", min: 2500 },
  { level: "vip", min: 5000 },
];

const current_points = user.membership_points;
const current_level = levels.filter((l) => current_points >= l.min).pop();
const next_level = levels.find((l) => l.min > current_points);

const points_to_next_level = next_level ? next_level.min - current_points : 0;

const progress_percentage = next_level
  ? ((current_points - current_level.min) /
      (next_level.min - current_level.min)) *
    100
  : 100;
```

---

### 12.3. Get Account Membership - `GET /accounts/:phone/membership`

**Response (200):**

```json
{
  "phone_number": "0912345678",
  "level": "gold",
  "join_date": "2024-01-15",
  "membership_points": 1500
}
```

---

### 12.4. Update Account Membership (Admin) - `POST /accounts/:phone/membership`

**Request Body:**

```json
{
  "level": "vip"
}
```

---

## 13. Staff Management

### 13.1. Get All Staff (Admin) - `GET /staff`

**Response (200):**

```json
[
  {
    "staff_id": "STA00001",
    "name": "Nguyễn Văn A",
    "phone_number": "0901111111",
    "manage_id": null,
    "cinema_id": "CIN00001"
  },
  ...
]
```

---

### 13.2. Get Staff by ID (Admin) - `GET /staff/:id`

---

### 13.3. Create Staff (Admin) - `POST /staff`

**Request Body:**

```json
{
  "name": "Lê Văn C",
  "phone_number": "0903333333",
  "password": "admin123",
  "cinema_id": "CIN00002",
  "manage_id": null // optional
}
```

**Response (201):** Trả về `Staff` object với `staff_id` auto-generated.

---

### 13.4. Update/Delete Staff - `PUT/DELETE /staff/:id`

---

## 14. Admin Dashboard

### 14.1. Get Dashboard Stats - `GET /admin/stats`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response (200):**

```json
{
  "total_movies": 10,
  "now_showing": 5,
  "coming_soon": 2,
  "total_cinemas": 5,
  "total_rooms": 15,
  "total_users": 150,
  "monthly_revenue": 50000000, // PHẢI dùng Stored Procedure sp_GetMonthlyRevenue
  "bookings_this_month": 120,
  "total_tickets_sold": 450
}
```

**Database Logic:**

```sql
-- QUAN TRỌNG: Phải sử dụng Stored Procedure để tính monthly_revenue
CREATE PROCEDURE sp_GetMonthlyRevenue(IN target_month INT, IN target_year INT)
BEGIN
  SELECT SUM(total_price) as monthly_revenue
  FROM BILL
  WHERE MONTH(creation_date) = target_month
    AND YEAR(creation_date) = target_year;
END;

-- Call từ backend
CALL sp_GetMonthlyRevenue(5, 2024);
```

**Các stats khác:**

```sql
-- Total movies
SELECT COUNT(*) FROM MOVIE;

-- Now showing
SELECT COUNT(*) FROM MOVIE WHERE status = 'showing';

-- Coming soon
SELECT COUNT(*) FROM MOVIE WHERE status = 'upcoming';

-- Total cinemas
SELECT COUNT(*) FROM CINEMA WHERE state = 'active';

-- Bookings this month
SELECT COUNT(*) FROM BILL
WHERE MONTH(creation_date) = MONTH(NOW())
  AND YEAR(creation_date) = YEAR(NOW());
```

---

### 14.2. Get Revenue Report - `GET /admin/revenue`

**Query Parameters:**

- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `group_by`: `'day'` | `'month'` | `'cinema'` (optional)

**Response (200):**

```json
{
  "total_revenue": 150000000,
  "breakdown": [
    {
      "date": "2024-05-01",  // hoặc "cinema_id" nếu group_by='cinema'
      "revenue": 5000000
    },
    ...
  ]
}
```

---

### 14.3. Get Top Revenue Movies - `GET /admin/top-movies`

**Query Parameters:**

- `limit`: Number of top movies (default: 10)

**Response (200):**

```json
[
  {
    "movie": {
      "movie_id": "MOV00001",
      "name": "Avengers: Endgame",
      ...
    },
    "revenue": 15000000,
    "tickets_sold": 500
  },
  ...
]
```

**SQL Logic:**

```sql
SELECT
  M.*,
  SUM(T.price) as revenue,
  COUNT(T.ticket_id) as tickets_sold
FROM MOVIE M
JOIN SHOWTIME S ON M.movie_id = S.movie_id
JOIN TICKET T ON S.showtime_id = T.showtime_id
GROUP BY M.movie_id
ORDER BY revenue DESC
LIMIT :limit;
```

---

## 15. Error Handling

### Error Response Format

Tất cả errors trả về theo format:

```json
{
  "error": "Mô tả lỗi bằng tiếng Việt dễ hiểu cho user",
  "details": "Chi tiết kỹ thuật (optional, chỉ dùng trong development)"
}
```

### Common Error Messages

| Scenario                | Status Code | Error Message (tiếng Việt)                                     |
| ----------------------- | ----------- | -------------------------------------------------------------- |
| Missing required fields | 400         | "Thiếu thông tin bắt buộc: {field_name}"                       |
| Invalid email format    | 400         | "Email không hợp lệ"                                           |
| Invalid phone format    | 400         | "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)" |
| Password too short      | 400         | "Mật khẩu phải có ít nhất 6 ký tự"                             |
| Email already exists    | 409         | "Email đã được sử dụng"                                        |
| Phone already exists    | 409         | "Số điện thoại đã được sử dụng"                                |
| Invalid credentials     | 401         | "Sai email/số điện thoại hoặc mật khẩu"                        |
| Token expired           | 401         | "Phiên đăng nhập đã hết hạn"                                   |
| Not authenticated       | 401         | "Vui lòng đăng nhập"                                           |
| Not authorized          | 403         | "Bạn không có quyền truy cập"                                  |
| Resource not found      | 404         | "{Resource} không tồn tại"                                     |
| Seat already booked     | 409         | "Ghế {row}{col} đã được đặt"                                   |
| Voucher invalid         | 400         | "Mã giảm giá không hợp lệ hoặc đã hết hạn"                     |
| Showtime conflict       | 409         | "Phòng chiếu đã có lịch chiếu trùng giờ"                       |
| Date validation         | 400         | "Ngày kết thúc phải sau ngày bắt đầu"                          |

### Global Error Handler

```javascript
// Pseudocode
app.use((error, req, res, next) => {
  console.error(error);

  // Database errors
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: "Dữ liệu đã tồn tại",
      details: error.message,
    });
  }

  // Validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: error.message,
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token không hợp lệ",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Phiên đăng nhập đã hết hạn",
    });
  }

  // Default
  res.status(500).json({
    error: "Đã có lỗi xảy ra, vui lòng thử lại sau",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});
```

---

## 16. Business Logic Requirements

### 16.1. Seat Booking Rules

1. **Ghế chỉ có thể đặt nếu:**

   - `SEAT.state = 'available'` (không phải 'occupied', 'unavailable', 'reserved')
   - Chưa có `TICKET` nào cho showtime đó với seat đó

2. **Khi tạo booking:**

   - Phải check lock để tránh race condition (2 users đặt cùng ghế)
   - Nên dùng database transaction với isolation level `SERIALIZABLE`

3. **Sau khi booking thành công:**
   - KHÔNG cần update `SEAT.state = 'occupied'` (vì `state` là trạng thái vật lý của ghế)
   - Trạng thái "đã đặt" được xác định bởi sự tồn tại của `TICKET` record

### 16.2. Showtime Scheduling Rules

1. **Validation khi tạo showtime:**

   ```
   - start_time < end_time
   - Không trùng với showtime khác trong cùng room và cùng date
   - Movie phải trong trạng thái 'showing'
   - Room phải ở state 'active'
   ```

2. **Logic tính end_time:**
   ```javascript
   // Có thể auto-calculate end_time từ movie duration
   end_time = start_time + movie.duration + BUFFER_TIME (15 phút)
   ```

### 16.3. Membership Points Rules

1. **Tích điểm:**

   - 1 điểm = 1,000 VND chi tiêu
   - Tính trên `bill.total_price` (sau khi trừ voucher)
   - Update `ACCOUNT.membership_points`

2. **Tự động nâng hạng membership:**

   ```javascript
   // Mỗi khi update points, check và update level
   if (membership_points >= 5000) {
     level = "vip";
   } else if (membership_points >= 2500) {
     level = "diamond";
   } else if (membership_points >= 1000) {
     level = "gold";
   } else {
     level = "copper";
   }

   // Update hoặc Insert vào ACCOUNT_MEMBERSHIP
   ```

### 16.4. Voucher Validation Rules

1. **Voucher hợp lệ khi:**

   - `state = 'active'`
   - `TODAY >= start_date AND TODAY <= end_date`
   - `phone_number` match với user đang đặt vé
   - User membership level >= promotional.level requirement

2. **Áp dụng discount:**

   ```javascript
   const promotional = getPromotional(voucher.promotional_id);
   const discount_config = getDiscount(promotional.promotional_id);

   let discount_amount = (total_price * discount_config.percent_reduce) / 100;

   // Cap at max_price_can_reduce
   if (discount_amount > discount_config.max_price_can_reduce) {
     discount_amount = discount_config.max_price_can_reduce;
   }

   final_price = total_price - discount_amount;
   ```

### 16.5. Price Calculation

**Seat prices (ví dụ, có thể customize):**

```javascript
const BASE_PRICES = {
  normal: 75000,
  vip: 120000,
  couple: 150000,
};

// Có thể thêm multipliers
const TIME_MULTIPLIERS = {
  morning: 0.8, // Before 12:00
  afternoon: 1.0, // 12:00 - 18:00
  evening: 1.2, // After 18:00
};

const DAY_MULTIPLIERS = {
  weekday: 1.0,
  weekend: 1.3,
};

function calculateSeatPrice(seat_type, start_time, start_date) {
  let price = BASE_PRICES[seat_type];

  const hour = parseInt(start_time.split(":")[0]);
  const dayOfWeek = new Date(start_date).getDay();

  // Time multiplier
  if (hour < 12) price *= TIME_MULTIPLIERS.morning;
  else if (hour >= 18) price *= TIME_MULTIPLIERS.evening;

  // Day multiplier
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    price *= DAY_MULTIPLIERS.weekend;
  }

  return Math.round(price);
}
```

### 16.6. Data Validation Rules

**From Database Constraints:**

```sql
-- ACCOUNT
phone_number: REGEXP '^0[0-9]{9}$'  -- 10 số, bắt đầu bằng 0
email: LIKE '%_@__%.__%'            -- Email format
password: CHAR_LENGTH >= 6
membership_points >= 0
gender: IN('male', 'female', 'unknown')

-- MOVIE
duration > 0
age_rating >= 0
end_date >= release_date
status: IN('upcoming', 'showing', 'ended')

-- SEAT
seat_column > 0
seat_type: IN('normal', 'vip', 'couple')
state: IN('available', 'occupied', 'unavailable', 'reserved')

-- SHOWTIME
start_time < end_time

-- VOUCHER
start_date <= end_date
state: IN('active', 'used', 'expired')

-- MOVIE_REVIEW
star_rating >= 1 AND star_rating <= 5
```

---

## 17. Database Triggers & Constraints

### 17.1. Auto-generated IDs

**Tất cả các bảng chính đều có trigger auto-generate ID theo format:**

- `CINEMA` → `CIN00001`, `CIN00002`, ...
- `STAFF` → `STA00001`, `STA00002`, ...
- `ROOM` → `ROO00001`, `ROO00002`, ...
- `MOVIE` → `MOV00001`, `MOV00002`, ...
- `SHOWTIME` → `SHO00001`, `SHO00002`, ...
- `TICKET` → `TIC00001`, `TIC00002`, ...
- `BILL` → `BIL00001`, `BIL00002`, ...
- `FOOD` → `FOO00001`, `FOO00002`, ...
- `EVENT` → `EVE00001`, `EVE00002`, ...
- `PROMOTIONAL` → `PRO00001`, `PRO00002`, ...
- `VOUCHER` → `VOU00001`, `VOU00002`, ...
- `PROMOTIONAL_BILL` → `PRB00001`, `PRB00002`, ...

**Khi INSERT, set ID = NULL để trigger tự sinh:**

```sql
INSERT INTO CINEMA (cinema_id, name, address)
VALUES (NULL, 'CGV Vĩnh Trung', '255-257 Hùng Vương');
-- Trigger sẽ tự động set cinema_id = 'CIN00006' (nếu đã có 5 cinemas)
```

### 17.2. Foreign Key Constraints

**Cascade behaviors cần lưu ý:**

- Khi DELETE `CINEMA` → Có thể fail nếu có `STAFF` hoặc `ROOM` liên kết
  - Recommend: Check trước khi xóa, hoặc set `state = 'inactive'` thay vì xóa
- Khi DELETE `ROOM` → Có thể fail nếu có `SEAT` hoặc `SHOWTIME`

  - Recommend: Delete seats trước, hoặc check showtimes

- Khi DELETE `MOVIE` → Có thể fail nếu có `SHOWTIME` hoặc `TICKET`

  - Recommend: Chỉ cho phép xóa nếu chưa có showtime nào

- Khi DELETE `ACCOUNT` → Cascade delete `BILL`, `TICKET`, `MOVIE_REVIEW`, `VOUCHER`
  - Recommend: KHÔNG cho phép xóa account, chỉ deactivate

### 17.3. Check Constraints

**Backend PHẢI validate các constraints sau trước khi INSERT/UPDATE:**

```javascript
// SEAT
if (seat_column <= 0) throw Error("seat_column phải > 0");
if (!["normal", "vip", "couple"].includes(seat_type))
  throw Error("seat_type không hợp lệ");

// MOVIE
if (duration <= 0) throw Error("duration phải > 0");
if (age_rating < 0) throw Error("age_rating phải >= 0");
if (new Date(end_date) < new Date(release_date))
  throw Error("end_date phải >= release_date");

// SHOWTIME
if (start_time >= end_time) throw Error("start_time phải < end_time");

// BILL
if (total_price < 0) throw Error("total_price phải >= 0");

// MOVIE_REVIEW
if (star_rating < 1 || star_rating > 5)
  throw Error("star_rating phải từ 1 đến 5");

// DISCOUNT
if (percent_reduce < 0 || percent_reduce > 100)
  throw Error("percent_reduce phải từ 0 đến 100");
```

---

## Kết luận

Tài liệu này cung cấp đầy đủ thông tin để backend team implement API server với MySQL database.

**Những điểm quan trọng cần nhớ:**

1. ✅ **PHẢI dùng snake_case** cho tất cả JSON keys
2. ✅ **PHẢI dùng Stored Procedure** `sp_GetMonthlyRevenue` cho dashboard stats
3. ✅ **PHẢI dùng Transactions** cho booking endpoint
4. ✅ **PHẢI validate** business logic (seat conflicts, showtime conflicts, voucher rules)
5. ✅ **PHẢI handle** auto-generated IDs từ triggers
6. ✅ Error messages nên bằng **tiếng Việt** để user dễ hiểu

**Tech Stack gợi ý:**

- **Node.js + Express** hoặc **NestJS**
- **MySQL2** hoặc **Sequelize ORM**
- **JWT** cho authentication
- **bcrypt** cho password hashing

---

**Version:** 1.0  
**Last Updated:** 2024-11-28  
**Contact:** Backend Team Lead
