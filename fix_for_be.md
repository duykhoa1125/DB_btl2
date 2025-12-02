
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

## File sửa: `server/src/services/booking_service.js`

| Lỗi                                                            | Sửa                                                            |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| Insert vé dùng `ma_phim`                                       | Đổi sang `ten_phim` (bảng `Ve` yêu cầu VARCHAR(50))            |
| `ngay_chieu` là Date object, ghép với time bị sai              | Chuyển về string `YYYY-MM-DD` trước khi ghép                   |
| Insert `DoAn` thiếu `ngay_san_xuat`, `ngay_het_han` (NOT NULL) | Thêm 2 helper: `getCurrentDateStr()`, `getFutureDateStr(days)` |
| Tổng tiền đồ ăn chỉ cộng `f.price`                             | Sửa thành `f.price * f.quantity`                               |

# Admin Login Implementation

## Changes in `server/src/services/login_service.js`

Added a hardcoded check at the beginning of the `login` function to support admin access:

- **Credentials**:
  - Username: `admin`
  - Password: `123456789`
- **Behavior**:
  - Bypasses database lookup.
  - Returns a mock user object with `role: 'admin'`.
  - Generates a valid JWT token for the admin session.

# Changelog sửa `admin_service` (server)

Tóm tắt các sửa đổi chính:

- Sửa lỗi tạo Movie (insert ID):

  - Thay vì INSERT `VALUES (NULL, ...)` (nhầm với auto-increment), service giờ tạo ID thủ công.
  - Điều chỉnh SQL lấy `last` theo MySQL: `SELECT ma_phim FROM Phim ORDER BY ma_phim DESC LIMIT 1`.
  - Tạo ID mới theo định dạng hiện tại `PHMxxxxx` (PHM + 5 chữ số, ví dụ PHM00006). Sửa logic substring/parse để lấy phần số đúng (substring(3)).
  - INSERT kèm danh sách cột: `INSERT INTO Phim (ma_phim, ten_phim, thoi_luong, ngay_khoi_chieu, ngay_ket_thuc, do_tuoi, trailer, ngon_ngu, trang_thai, tom_tat) VALUES ...`.

- Sửa lỗi tạo Cinema (insert ID):

  - Thay `VALUES (NULL, ...)` bằng tạo `RAPxxxxx` (RAP + 5 chữ số) theo cùng logic: `SELECT ma_rap FROM RapChieu ORDER BY ma_rap DESC LIMIT 1`.
  - INSERT kèm danh sách cột: `INSERT INTO RapChieu (ma_rap, ten_rap, trang_thai, dia_chi) VALUES ...`.

- Sửa lỗi SQL dialect:
  - Thay `SELECT TOP 1 ...` (SQL Server) bằng `LIMIT 1` (MySQL).

### Các thay đổi chính (server/src)

- `admin_service.js`

  - Sửa câu truy vấn lấy bản ghi cuối cho MySQL (dùng `LIMIT 1`) thay vì SQL Server `TOP`.
  - Thêm logic tạo mã tự động cho PK dạng VARCHAR (PHM... cho phim, RAP... cho rạp, SCH... cho suất chiếu) thay vì chèn NULL.
  - `createShowtime(...)`:
    - Kiểm tra trạng thái phòng (`ma_phong`) trước khi tạo suất chiếu (phòng phải active).
    - Sinh `ma_suat_chieu` (ví dụ `SCH00001`) và lưu vào DB.
    - Trả về `newId` (một số controller hiện tại không gửi lại id — có thể mở rộng)
  - `getShowtimeById(id)` trả về các trường đã map phù hợp với frontend: `showtime_id`, `room_id`, `movie_id`, `start_date`, `start_time`, `end_time`.

- `admin_controller.js`

  - Thêm các handler cho CRUD showtime (GET `/admin/showtimes/:id`, POST, PUT, DELETE) gọi tới `AdminService`.
  - Trả về JSON `{ success: true/false, data?: ... }`

- `admin_route.js`

  - Đăng ký các route admin cho showtimes: `GET /showtimes/:id`, `POST /showtimes`, `PUT /showtimes/:id`, `DELETE /showtimes/:id`.

- `other_service.js`, `other_controller.js`, `other_route.js`
  - Tạo endpoint `GET /other/rooms` để frontend admin lấy danh sách `PhongChieu` (map về `room_id`, `cinema_id`, `name`, `state`).

## fix crud admin movie
add image, director and actors
