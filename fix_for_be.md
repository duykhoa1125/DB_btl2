# Backend Minimal Fixes - 01/12/2025

## Lỗi gốc

- ❌ 500 error khi load trang `/movie/PHM00001` và `/movie/PHM00002`
- ❌ Frontend expects field names snake_case, backend trả về mixed camelCase
- ❌ SQL error: "Unknown column 'sc.trang_thai' in 'field list'"

## Files đã sửa (3 files)

### 1. ✅ `server/src/models/showtime_model.js`

**Thay đổi:**

- Added `this.roomId` và `this.movieId` từ DB columns
- toJSON() đổi toàn bộ sang snake_case: `showtime_id`, `start_date`, `start_time`, `end_time`, `room_name`, `cinema_name`
- **REMOVED** `this.status` vì DB không có column `trang_thai` trong bảng `SuatChieu`

### 2. ✅ `server/src/services/showtime_service.js`

**Thay đổi:**

- SQL query thêm 2 columns: `ma_phong`, `ma_phim`
- **FIX 1**: Đổi từ `NATURAL JOIN` sang `JOIN ... ON` với table aliases (sc, ph, rc)
- **FIX 2**: **REMOVED** `sc.trang_thai` khỏi SELECT vì column này không tồn tại trong DB

### 3. ✅ `server/src/models/movie_detail.js`

**Thay đổi:**

- toJSON() đổi `avgRating` → `avg_rating`

## Root Cause

Bảng `SuatChieu` trong database KHÔNG có column `trang_thai`. Code cũ giả định có column này → SQL error.

## Kết quả

- ✅ Backend trả về đúng format frontend expects
- ✅ SQL query hoạt động với table aliases và columns đúng
- ✅ API `/showtimes?movie_id=PHM00001` response: `{"success":true,"data":[...]}`
- ✅ Sửa tối thiểu nhất: chỉ 3 files, không thêm dependencies

---

# Backend Fix #2 - Movie Reviews - 01/12/2025

## Lỗi gốc

- ❌ Page `/movie/PHM00001` crash với error: `TypeError: Cannot read properties of undefined (reading 'replace')`
- ❌ Frontend component `review-list.tsx` cần `phone_number`, `star_rating`, `date_written` nhưng backend chỉ trả về `review_content`
- ❌ Backend query chỉ SELECT `noi_dung_danh_gia` → reviews thiếu thông tin

## Files đã sửa (1 file)

### ✅ `server/src/services/movie_service.js`

**Thay đổi:**

**Line 25 - SQL Query:**

```diff
- const reviews = await executeQuery(`SELECT noi_dung_danh_gia FROM DanhGiaPhim WHERE ma_phim='${id}'`);
+ const reviews = await executeQuery(`SELECT so_dien_thoai, so_sao, ngay_viet, noi_dung_danh_gia FROM DanhGiaPhim WHERE ma_phim='${id}'`);
```

**Line 34 - Data Mapping:**

```diff
- const review_list = reviews.map(row => row.noi_dung_danh_gia);
+ const review_list = reviews.map(row => ({
+     phone_number: row.so_dien_thoai,
+     star_rating: row.so_sao,
+     date_written: row.ngay_viet,
+     review_content: row.noi_dung_danh_gia
+ }));
```

## Root Cause

Backend query thiếu các columns cần thiết cho reviews. Frontend expects objects nhưng backend chỉ trả về plain strings.

## Kết quả

- ✅ Reviews trả về đầy đủ: `phone_number`, `star_rating`, `date_written`, `review_content`
- ✅ `/movie/PHM00001` và các movie khác load thành công
- ✅ Review component hiển thị đúng thông tin người dùng và đánh giá

# Backend Fixes Log - Booking Flow (01/12/2025)

## 1. BookingController (`server/src/controllers/booking_controller.js`)

- **Fix Critical**: Đổi `req.user.phone` thành `req.user.phone_number` để khớp với payload JWT.
- **Validation**: Thêm check `if (!userPhone)` để đảm bảo user đã đăng nhập hợp lệ.
- **Typo**: Sửa `bookingService` thành `BookingService` (viết hoa) trong hàm `getHistory`.

## 2. BookingService (`server/src/services/booking_service.js`)

- **Import**: Thêm `const Bill = require("../models/bill_model");` (trước đó bị thiếu).
- **Circular Dependency**: Xóa import `booking_route` gây lỗi undefined service.
- **Query**: Thêm trường `ma_phim` vào câu lệnh SELECT trong `createBooking` để có dữ liệu tạo vé.

## 3. BookingRoute (`server/src/routes/booking_route.js`)

- **Middleware**: Thêm `authenticateToken` vào các route `/` (POST) và `/history` (GET) để xác thực user.
