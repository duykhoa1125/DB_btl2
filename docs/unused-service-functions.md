# Báo Cáo Các Hàm Không Sử Dụng Trong Services

## 📊 Tổng Quan

Đây là báo cáo chi tiết về các **hàm không được sử dụng** trong các service files của dự án.

---

## ❌ Files Không Được Sử Dụng Hoàn Toàn

### 1. `services/directorService.ts` - **TOÀN BỘ FILE**

- **Trạng thái**: Không có import nào sử dụng
- **Các hàm**: `getAll`, `getById`, `create`, `update`, `delete`

### 2. `services/actorService.ts` - **TOÀN BỘ FILE**

- **Trạng thái**: Không có import nào sử dụng
- **Các hàm**: `getAll`, `getById`, `create`, `update`, `delete`

### 3. `services/billService.ts` - **TOÀN BỘ FILE**

- **Trạng thái**: Không có import nào sử dụng
- **Các hàm**: `getAll`, `getById`, `getByUser`, `getByDateRange`, `create`, `update`, `delete`

### 4. `services/ticketService.ts` - **TOÀN BỘ FILE**

- **Trạng thái**: Không có import nào sử dụng
- **Các hàm**: `getAll`, `getById`, `getByBill`, `getByShowtime`, `create`, `update`, `delete`

### 5. `services/staffService.ts` - **CHỈ DÙNG MỘT PHẦN**

- ✅ **Được dùng**: `getAll` (trong `app/admin/staff/page.tsx`)
- ❌ **Không dùng**: `getById`, `getByCinema`, `create`, `update`, `delete`

---

## 🔧 Các Hàm Không Sử Dụng Trong Services Đang Hoạt Động

### `accountService.ts`

❌ **Tất cả hàm không được sử dụng**:

- `getByPhone`
- `getMembership`
- `updateMembershipPoints`
- `getOrderHistory`
- `getAll`
- `update`
- `delete`

### `authService.ts`

- ✅ **Được dùng**: `login`, `register`, `logout`, `getCurrentUser`
- ⚠️ **Có dùng nhưng chưa implement backend**: `updateProfile` (dùng trong `lib/auth-context.tsx`)
- ❌ **Không dùng**: `changePassword`

### `bookingService.ts`

- ✅ **Được dùng**: `createBooking`, `getMyBookings`
- ❌ **Các hàm commented out không dùng**: `getBookingById`, `cancelBooking`, `getAllBookings`, `getBookingsByDateRange`

### `cinemaService.ts`

- ✅ **Được dùng**: `getAll`, `getById`
- ❌ **Không dùng**: `getActive`, `create`, `update`, `delete`

### `eventService.ts`

- ✅ **Được dùng**: `getAll`, `getById`
- ❌ **Không dùng**: `getActive`, `getUpcoming`, `create`, `update`, `delete`

### `foodService.ts`

- ✅ **Được dùng**: `getAllMenuItems`, `getAvailableItems`
- ❌ **Không dùng**: `getByCategory`, `getByBill`, `createMenuItem`, `updateMenuItem`, `deleteMenuItem`

### `membershipService.ts`

- ✅ **Được dùng**: `getAllLevels`, `getProgress` (trong `components/membership-benefits.tsx`)
- ❌ **Không dùng**: `getLevelByPoints`

### `movieService.ts`

- ✅ **Được dùng**: `getAll`, `getById`, `getUpcoming`
- ❌ **Không dùng**: `getByStatus`, `create`, `update`, `delete`

### `promotionalService.ts`

- ✅ **Được dùng**: `getByEvent` (trong `app/events/[id]/page.tsx`)
- ❌ **Không dùng**: `getAll`, `getById`, `getByMemberLevel`, `getActive`, `getDiscounts`, `getGifts`, `create`, `update`, `delete`

### `reviewService.ts`

- ✅ **Được dùng**: `getByMovie`, `create`
- ❌ **Không dùng**: `getAll`, `getByUser`, `getReview`, `getAverageRating`, `update`, `delete`

### `roomService.ts`

- ✅ **Được dùng**: `getAll`, `getByCinema`
- ❌ **Không dùng**: `getById`, `create`, `update`, `delete`

### `seatService.ts`

- ✅ **Được dùng**: `getByShowtime`
- ❌ **Không dùng**: `getByRoom`, `getSeatLayout`, `getSeat`, `updateSeatState`, `createSeats`

### `showtimeService.ts`

- ✅ **Được dùng**: `getAll`, `getById`, `getByMovie`, `getByCinema`, `getAvailableSeats`
- ❌ **Không dùng**: `getByRoom`, `getByDate`, `getWithDetails`, `create`, `update`, `delete`

### `voucherService.ts`

- ✅ **Được dùng**: `validateByCode`, `getDetailByCode`
- ❌ **Các hàm commented out không dùng**: `getAll`, `getByUser`, `getByCode`, `getActiveVouchers`, `validateVoucher`, `applyVoucher`, `create`, `updateState`, `delete`

### `adminService.ts`

- ✅ **Được dùng**:
  - `getAllMovies`, `createMovie`, `updateMovie`, `deleteMovie`
  - `getAllCinemas`, `getCinemaById`, `createCinema`, `updateCinema`, `deleteCinema`
  - `getAllShowtimes`, `getShowtimeById`, `createShowtime`, `updateShowtime`, `deleteShowtime`
  - `getDashboardStats`
- ❌ **Không dùng**: `getMovieById`

---

## 📈 Thống Kê

### Files Không Dùng Hoàn Toàn: 4

1. `directorService.ts`
2. `actorService.ts`
3. `billService.ts`
4. `ticketService.ts`

### Services Đang Hoạt Động Nhưng Có Hàm Không Dùng

| Service            | Tổng Hàm         | Đang Dùng | Không Dùng | % Không Dùng |
| ------------------ | ---------------- | --------- | ---------- | ------------ |
| accountService     | 7                | 0         | 7          | 100%         |
| authService        | 6                | 4         | 2          | 33%          |
| cinemaService      | 6                | 2         | 4          | 67%          |
| eventService       | 7                | 2         | 5          | 71%          |
| foodService        | 7                | 2         | 5          | 71%          |
| membershipService  | 3                | 2         | 1          | 33%          |
| movieService       | 7                | 3         | 4          | 57%          |
| promotionalService | 10               | 1         | 9          | 90%          |
| reviewService      | 8                | 2         | 6          | 75%          |
| roomService        | 6                | 2         | 4          | 67%          |
| seatService        | 6                | 1         | 5          | 83%          |
| showtimeService    | 11               | 5         | 6          | 55%          |
| voucherService     | 2 (+9 commented) | 2         | 9          | -            |
| adminService       | 22               | 21        | 1          | 5%           |
| staffService       | 6                | 1         | 5          | 83%          |

---

## 💡 Khuyến Nghị

### 1. **Xóa Ngay** (HIGH PRIORITY)

Các file này hoàn toàn không được sử dụng:

- ✅ `services/directorService.ts`
- ✅ `services/actorService.ts`
- ✅ `services/billService.ts`
- ✅ `services/ticketService.ts`

### 2. **Xem Xét Xóa** (MEDIUM PRIORITY)

Các service có > 70% hàm không dùng:

- ⚠️ `accountService.ts` - 100% không dùng
- ⚠️ `promotionalService.ts` - 90% không dùng
- ⚠️ `staffService.ts` - 83% không dùng (chỉ dùng `getAll`)
- ⚠️ `seatService.ts` - 83% không dùng (chỉ dùng `getByShowtime`)
- ⚠️ `reviewService.ts` - 75% không dùng

### 3. **Giữ Lại Nhưng Dọn Dẹp** (LOW PRIORITY)

Các service có nhiều hàm admin CRUD không dùng - có thể giữ cho tương lai:

- `cinemaService.ts` - Giữ create/update/delete cho admin
- `eventService.ts` - Giữ create/update/delete cho admin
- `foodService.ts` - Giữ create/update/delete cho admin
- `movieService.ts` - Giữ create/update/delete cho admin
- `roomService.ts` - Giữ create/update/delete cho admin
- `showtimeService.ts` - Giữ create/update/delete cho admin

### 4. **Cần Implement Backend**

- `authService.updateProfile` - Đang dùng nhưng backend chưa có
- `authService.changePassword` - Cần cho chức năng user

---

## 🎯 Kế Hoạch Dọn Dẹp

### Bước 1: Xóa Files Không Dùng

```bash
rm services/directorService.ts
rm services/actorService.ts
rm services/billService.ts
rm services/ticketService.ts
```

### Bước 2: Update `services/index.ts`

Xóa các export:

```typescript
// XÓA các dòng này:
export { default as billService } from "./billService";
export { default as ticketService } from "./ticketService";
export { default as staffService } from "./staffService";
export { default as directorService } from "./directorService";
export { default as actorService } from "./actorService";
```

### Bước 3: Xóa Hàm Không Dùng

Review và xóa các hàm không dùng trong các services còn lại, ưu tiên:

1. `accountService.ts` - Xóa toàn bộ hoặc implement nếu cần
2. `promotionalService.ts` - Chỉ giữ `getByEvent`
3. `staffService.ts` - Chỉ giữ `getAll` hoặc xóa file

---

**Ngày tạo báo cáo**: 2025-12-02
**Tổng số hàm phân tích**: ~130 hàm
**Tổng số hàm không dùng**: ~80 hàm (~62%)
