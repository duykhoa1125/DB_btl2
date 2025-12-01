# Kế Hoạch Tích Hợp Backend-Frontend

## 📌 Tổng Quan

Kế hoạch này sẽ khắc phục các vấn đề không tương thích giữa backend và frontend, chia thành 4 Phases với mức độ ưu tiên từ cao xuống thấp.

**Chiến lược:** Hybrid Approach

- Backend sửa/thêm endpoints cho critical features
- Frontend adapt cho các tính năng optional
- Mock data cho low-priority features

---

## 🔴 PHASE 1: CRITICAL FIXES (Tuần 1)

### 1.1 Fix Route Base Paths

#### A. Voucher Routes

**Vấn đề hiện tại:**

- Backend: `/other/vouchers/check/:code`
- Frontend: `/vouchers/*` với nhiều endpoints

**Giải pháp:**

**Option 1: Backend tạo route mới `/vouchers`** (Khuyến nghị)

```javascript
// server/src/routes/voucher_route.js (NEW)
const express = require("express");
const voucherRouter = express.Router();
const voucherController = require("../controllers/voucher_controller");

voucherRouter.get("/check/:code", voucherController.validateVoucher);
voucherRouter.get("/", voucherController.getAll); // NEW
voucherRouter.get("/:code", voucherController.getByCode); // NEW
voucherRouter.post("/validate", voucherController.validate); // NEW
voucherRouter.post("/apply", voucherController.apply); // NEW

module.exports = voucherRouter;

// server/src/routes/main.js
app.use("/vouchers", voucherRouter);
```

**Option 2: Frontend adapt** (Nhanh hơn nhưng kém nhất quán)

```typescript
// services/voucherService.ts
validateVoucher: (code: string, phoneNumber: string) => {
  return axiosClient.get(`/other/vouchers/check/${code}`, {
    params: { phone_number: phoneNumber },
  });
};
```

**Chọn:** Option 1

---

#### B. Food Routes

**Vấn đề hiện tại:**

- Backend: `/other/foods/menu`
- Frontend: `/foods/menu`

**Giải pháp:**

**Option 1: Backend tạo route mới `/foods`**

```javascript
// server/src/routes/food_route.js (NEW)
const express = require("express");
const foodRouter = express.Router();
const foodController = require("../controllers/food_controller");

foodRouter.get("/menu", foodController.getMenu);
foodRouter.post("/menu", foodController.createMenuItem); // Admin
foodRouter.put("/menu/:id", foodController.updateMenuItem); // Admin
foodRouter.delete("/menu/:id", foodController.deleteMenuItem); // Admin

module.exports = foodRouter;

// server/src/routes/main.js
app.use("/foods", foodRouter);
```

**Option 2: Frontend adapt**

```typescript
// services/foodService.ts
getAllMenuItems: (): Promise<FoodMenuItem[]> => {
  return axiosClient.get("/other/foods/menu");
};
```

**Chọn:** Option 1 (nhất quán hơn)

---

### 1.2 Fix Admin CRUD Routes

**Vấn đề:**

- Backend: `POST /admin/movies`, `PUT /admin/cinemas/:id`
- Frontend: `POST /movies`, `PUT /cinemas/:id` (expects admin calls to use same routes)

**Giải pháp:**

**Option 1: Backend cho phép CRUD trực tiếp trên resource routes** (Khuyến nghị)

```javascript
// server/src/routes/movie_route.js
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// Public routes
movieRouter.get("/", movieController.getAll);
movieRouter.get("/:id", movieController.getById);

// Admin routes (require auth & admin role)
movieRouter.post("/", authenticateToken, requireAdmin, movieController.create);
movieRouter.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  movieController.update
);
movieRouter.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  movieController.delete
);
```

Tạo middleware mới:

```javascript
// server/src/middlewares/auth.js
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
};

module.exports = { authenticateToken, requireAdmin };
```

**Option 2: Frontend gọi `/admin/*` routes**

```typescript
// services/adminService.ts
createMovie: (data: Omit<Movie, "movie_id">): Promise<Movie> => {
  return axiosClient.post("/admin/movies", data);
};
```

**Chọn:** Option 1 (RESTful hơn, middleware tốt hơn)

**Áp dụng tương tự cho:**

- `/cinemas` - POST, PUT, DELETE với `requireAdmin`
- `/showtimes` - POST, PUT, DELETE với `requireAdmin`

---

### 1.3 Fix Booking Routes

**Vấn đề:**

- Backend: `GET /booking/history` (uses JWT token)
- Frontend: Nhiều endpoints khác nhau

**Giải pháp Backend:**

```javascript
// server/src/routes/booking_route.js
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// User routes (authenticated)
bookingRouter.post("/", authenticateToken, bookingController.createBooking);
bookingRouter.get("/history", authenticateToken, bookingController.getHistory);
bookingRouter.get("/:id", authenticateToken, bookingController.getById); // NEW
bookingRouter.delete(
  "/:id",
  authenticateToken,
  bookingController.cancelBooking
); // NEW

// Admin routes
bookingRouter.get(
  "/",
  authenticateToken,
  requireAdmin,
  bookingController.getAll
); // NEW
```

**Controllers cần implement:**

```javascript
// server/src/controllers/booking_controller.js

// GET /booking/:id - Get booking by ID (check ownership)
exports.getById = async (req, res) => {
  const { id } = req.params;
  const phone_number = req.user.phone_number;

  // Fetch booking and verify ownership (unless admin)
  // Return booking with tickets and foods
};

// DELETE /booking/:id - Cancel booking (check ownership)
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const phone_number = req.user.phone_number;

  // Verify ownership, check cancellation policy
  // Update bill status, release seats
};

// GET /booking - Get all bookings (admin only)
exports.getAll = async (req, res) => {
  const { start_date, end_date } = req.query;

  // Return all bookings with optional date filtering
};
```

**Frontend adapt:**

```typescript
// services/bookingService.ts
getMyBookings: (): Promise<BookingResponse[]> => {
    return axiosClient.get(`/booking/history`); // Use history endpoint
},

getBookingById: (billId: string): Promise<BookingResponse> => {
    return axiosClient.get(`/booking/${billId}`);
},

cancelBooking: (billId: string): Promise<void> => {
    return axiosClient.delete(`/booking/${billId}`);
},

getAllBookings: (): Promise<BookingResponse[]> => {
    return axiosClient.get('/booking'); // Admin only
}
```

---

## 🟡 PHASE 2: HIGH PRIORITY (Tuần 2)

### 2.1 Add Movie Filtering & Search

**Backend changes:**

```javascript
// server/src/routes/movie_route.js
movieRouter.get("/", movieController.getAll); // Update to support query params
movieRouter.get("/search", movieController.search); // NEW
movieRouter.get("/now-showing", movieController.getNowShowing); // NEW
movieRouter.get("/upcoming", movieController.getUpcoming); // NEW
movieRouter.get("/:id/details", movieController.getWithDetails); // NEW
movieRouter.get("/:id", movieController.getById);
```

**Controllers:**

```javascript
// server/src/controllers/movie_controller.js

exports.getAll = async (req, res) => {
  const { status } = req.query; // 'showing', 'upcoming', 'ended'

  let whereClause = {};
  if (status === "showing") {
    whereClause = { Trang_thai: "Đang chiếu" };
  } else if (status === "upcoming") {
    whereClause = { Trang_thai: "Sắp chiếu" };
  } else if (status === "ended") {
    whereClause = { Trang_thai: "Đã kết thúc" };
  }

  const movies = await movieService.getAll(whereClause);
  res.json({ success: true, data: movies });
};

exports.search = async (req, res) => {
  const { q } = req.query; // Search keyword

  const movies = await movieService.search(q);
  res.json({ success: true, data: movies });
};

exports.getNowShowing = async (req, res) => {
  const movies = await movieService.getByStatus("Đang chiếu");
  res.json({ success: true, data: movies });
};

exports.getUpcoming = async (req, res) => {
  const movies = await movieService.getByStatus("Sắp chiếu");
  res.json({ success: true, data: movies });
};

exports.getWithDetails = async (req, res) => {
  const { id } = req.params;

  // Get movie with actors, directors, reviews (if implemented)
  const movie = await movieService.getWithDetails(id);
  res.json({ success: true, data: movie });
};
```

**Service layer:**

```javascript
// server/src/services/movie_service.js

exports.search = async (keyword) => {
  const { Op } = require("sequelize");

  return await Movie.findAll({
    where: {
      [Op.or]: [
        { Ten_phim: { [Op.like]: `%${keyword}%` } },
        { Tom_tat: { [Op.like]: `%${keyword}%` } },
      ],
    },
  });
};

exports.getWithDetails = async (id) => {
  const movie = await Movie.findByPk(id);

  // TODO: Join with actors, directors, reviews if those tables exist
  // For now, return basic movie info

  return {
    ...movie.toJSON(),
    actors: [], // Placeholder
    directors: [], // Placeholder
    reviews: [], // Placeholder
  };
};
```

---

### 2.2 Add Showtime Filtering

**Backend changes:**

```javascript
// server/src/routes/showtime_route.js
showtimeRouter.get("/", showtimeController.getAll); // Update to support query params
showtimeRouter.get("/:id/details", showtimeController.getWithDetails); // NEW
showtimeRouter.get("/:id/seats", showtimeController.getById);
```

**Controller:**

```javascript
// server/src/controllers/showtime_controller.js

exports.getAll = async (req, res) => {
  const { movie_id, cinema_id, room_id, date } = req.query;

  let whereClause = {};

  if (movie_id) whereClause.Ma_phim = movie_id;
  if (cinema_id) {
    // Need to join with PHONG to filter by cinema
  }
  if (room_id) whereClause.Ma_phong = room_id;
  if (date) {
    // Filter by Ngay_chieu
    whereClause.Ngay_chieu = date;
  }

  const showtimes = await showtimeService.getAll(whereClause);
  res.json({ success: true, data: showtimes });
};

exports.getWithDetails = async (req, res) => {
  const { id } = req.params;

  // Get showtime with cinema, room, movie info joined
  const showtime = await showtimeService.getWithDetails(id);
  res.json({ success: true, data: showtime });
};
```

---

### 2.3 Add Auth Update Endpoints

**Backend changes:**

```javascript
// server/src/routes/login_route.js
loginRouter.post("/login", loginController.login);
loginRouter.post("/register", loginController.register);
loginRouter.get("/me", authenticateToken, loginController.getMyInfo);
loginRouter.put("/profile", authenticateToken, loginController.updateProfile); // NEW
loginRouter.put("/password", authenticateToken, loginController.changePassword); // NEW
```

**Controllers:**

```javascript
// server/src/controllers/login_controller.js

exports.updateProfile = async (req, res) => {
  const phone_number = req.user.phone_number;
  const { Ho_ten, Email, Ngay_sinh, Gioi_tinh, Dia_chi } = req.body;

  // Cannot change phone_number
  const updated = await accountService.updateProfile(phone_number, {
    Ho_ten,
    Email,
    Ngay_sinh,
    Gioi_tinh,
    Dia_chi,
  });

  res.json({ success: true, data: updated });
};

exports.changePassword = async (req, res) => {
  const phone_number = req.user.phone_number;
  const { old_password, new_password } = req.body;

  // Verify old password, hash new password, update
  await accountService.changePassword(phone_number, old_password, new_password);

  res.json({ success: true, message: "Password updated successfully" });
};
```

---

### 2.4 Add Cinema Filtering

**Backend changes:**

```javascript
// server/src/controllers/cinema_controller.js

exports.getAll = async (req, res) => {
  const { state } = req.query; // 'active' or undefined

  let whereClause = {};
  if (state === "active") {
    whereClause.Trang_thai = "Hoạt động"; // or 'active' depending on DB
  }

  const cinemas = await cinemaService.getAll(whereClause);
  res.json({ success: true, data: cinemas });
};
```

---

## 🟢 PHASE 3: MEDIUM PRIORITY (Tuần 3)

### 3.1 Add Admin Stats Endpoints

**Backend changes:**

```javascript
// server/src/routes/admin_route.js
adminRouter.get("/stats", adminController.getStats);
adminRouter.get("/stats/monthly-revenue", adminController.getMonthlyRevenue); // NEW
adminRouter.get(
  "/stats/bookings-this-month",
  adminController.getBookingsThisMonth
); // NEW
adminRouter.get("/stats/top-movies", adminController.getTopMovies); // NEW
```

**Controllers:**

```javascript
// server/src/controllers/admin_controller.js

exports.getMonthlyRevenue = async (req, res) => {
  const { year, month } = req.query;

  const revenue = await adminService.getMonthlyRevenue(year, month);
  res.json({ success: true, data: revenue });
};

exports.getBookingsThisMonth = async (req, res) => {
  const count = await adminService.getBookingsThisMonth();
  res.json({ success: true, data: count });
};

exports.getTopMovies = async (req, res) => {
  const { limit = 5 } = req.query;

  const topMovies = await adminService.getTopMoviesByRevenue(limit);
  res.json({ success: true, data: topMovies });
};
```

---

### 3.2 Mock Data for Actors/Directors/Reviews

**Frontend approach:**

```typescript
// services/movieService.ts

getWithDetails: async (id: string): Promise<MovieDetail> => {
  const movie = await axiosClient.get(`/movies/${id}/details`);

  // Backend might return empty arrays for actors/directors/reviews
  // Frontend can mock or display "No data available"

  return {
    ...movie,
    actors: movie.actors || [],
    directors: movie.directors || [],
    reviews: movie.reviews || [],
  };
};
```

**Alternative: Backend embed dummy data**

```javascript
// server/src/services/movie_service.js

exports.getWithDetails = async (id) => {
  const movie = await Movie.findByPk(id);

  // Mock data until proper tables are created
  return {
    ...movie.toJSON(),
    actors: [{ name: "Diễn viên 1" }, { name: "Diễn viên 2" }],
    directors: [{ name: "Đạo diễn 1" }],
    reviews: [],
  };
};
```

---

### 3.3 Optional: Account Service

**If needed, implement basic account endpoints:**

```javascript
// server/src/routes/account_route.js (NEW)
const express = require("express");
const accountRouter = express.Router();
const accountController = require("../controllers/account_controller");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// User can only access their own account
accountRouter.get("/:phone", authenticateToken, accountController.getByPhone);
accountRouter.get(
  "/:phone/membership",
  authenticateToken,
  accountController.getMembership
);

// Admin can access all accounts
accountRouter.get(
  "/",
  authenticateToken,
  requireAdmin,
  accountController.getAll
);
accountRouter.put(
  "/:phone",
  authenticateToken,
  requireAdmin,
  accountController.update
);

module.exports = accountRouter;

// server/src/routes/main.js
app.use("/accounts", accountRouter);
```

---

## ⚪ PHASE 4: LOW PRIORITY (Tương lai)

### 4.1 Room Service (Optional)

Nếu cần CRUD rooms:

```javascript
// server/src/routes/room_route.js (NEW)
roomRouter.get("/", roomController.getAll); // Support ?cinema_id=
roomRouter.get("/:id", roomController.getById);
roomRouter.post("/", authenticateToken, requireAdmin, roomController.create);
roomRouter.put("/:id", authenticateToken, requireAdmin, roomRouter.update);
roomRouter.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  roomController.delete
);
```

### 4.2 Seat CRUD (Optional)

Hiện tại backend chỉ có GET seats trong showtime. Nếu cần CRUD:

```javascript
// server/src/routes/seat_route.js (NEW)
seatRouter.get("/", seatController.getByRoom); // ?room_id=
seatRouter.get("/layout", seatController.getSeatLayout); // ?room_id=&showtime_id=
seatRouter.post(
  "/",
  authenticateToken,
  requireAdmin,
  seatController.createSeats
);
seatRouter.put(
  "/:roomId/:row/:col",
  authenticateToken,
  requireAdmin,
  seatController.updateSeatState
);
```

### 4.3 Staff Service (Optional)

Nếu cần quản lý nhân viên:

```javascript
// server/src/routes/staff_route.js (NEW)
staffRouter.get("/", staffController.getAll); // Support ?cinema_id=, ?manage_id=
staffRouter.get("/:id", staffController.getById);
staffRouter.post("/", authenticateToken, requireAdmin, staffController.create);
staffRouter.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  staffController.update
);
staffRouter.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  staffController.delete
);
```

### 4.4 Membership Service (Optional)

```javascript
// server/src/routes/membership_route.js (NEW)
membershipRouter.get("/", membershipController.getAllLevels);
membershipRouter.get("/progress", membershipController.getProgress); // ?points=
membershipRouter.get("/level", membershipController.getLevelByPoints); // ?points=
```

---

## 📋 Checklist Tổng Hợp

### Phase 1 - Critical (Tuần 1)

- [ ] Tạo `/vouchers` route thay `/other/vouchers`
- [ ] Tạo `/foods` route thay `/other/foods`
- [ ] Implement middleware `requireAdmin`
- [ ] Enable CRUD trực tiếp trên `/movies`, `/cinemas`, `/showtimes` với admin middleware
- [ ] Thêm `GET /booking/:id` - Get booking by ID
- [ ] Thêm `DELETE /booking/:id` - Cancel booking
- [ ] Thêm `GET /booking` - Get all bookings (admin)
- [ ] Frontend adapt `bookingService` để dùng `/booking/history`

### Phase 2 - High Priority (Tuần 2)

- [ ] Implement `GET /movies/search?q=`
- [ ] Implement `GET /movies/now-showing`
- [ ] Implement `GET /movies/upcoming`
- [ ] Implement `GET /movies/:id/details`
- [ ] Update `GET /movies` để support `?status=` query param
- [ ] Update `GET /showtimes` để support filtering query params
- [ ] Implement `GET /showtimes/:id/details`
- [ ] Implement `PUT /auth/profile`
- [ ] Implement `PUT /auth/password`
- [ ] Update `GET /cinemas` để support `?state=active`

### Phase 3 - Medium Priority (Tuần 3)

- [ ] Implement `GET /admin/stats/monthly-revenue`
- [ ] Implement `GET /admin/stats/bookings-this-month`
- [ ] Implement `GET /admin/stats/top-movies`
- [ ] Mock hoặc embed actors/directors/reviews data
- [ ] Optional: Implement `/accounts` routes

### Phase 4 - Low Priority (Khi có thời gian)

- [ ] Implement `/rooms` service
- [ ] Implement `/seats` CRUD
- [ ] Implement `/staff` service
- [ ] Implement `/memberships` service
- [ ] Implement full voucher CRUD
- [ ] Separate `/events` và `/promotionals` routes
- [ ] Implement `/reviews` system
- [ ] Implement `/actors` và `/directors` services
- [ ] Implement `/bills` và `/tickets` independent access

---

## 🎯 Timeline Ước Tính

| Phase   | Thời gian | Công việc chính                                 |
| ------- | --------- | ----------------------------------------------- |
| Phase 1 | 3-5 ngày  | Fix critical route mismatches, admin middleware |
| Phase 2 | 4-6 ngày  | Implement filtering, search, auth updates       |
| Phase 3 | 3-4 ngày  | Admin stats, mock data, optional accounts       |
| Phase 4 | Ongoing   | Optional services khi cần thiết                 |

**Tổng:** ~2-3 tuần cho Phases 1-3 (core functionality)

---

## 🚀 Bắt Đầu Từ Đâu?

### Ngay lập tức:

1. **Tạo middleware `requireAdmin`** trong `server/src/middlewares/auth.js`
2. **Refactor admin routes** để dùng middleware thay vì `/admin` prefix
3. **Tạo voucher & food routes mới** tách ra khỏi `/other`

### Tuần đầu tiên:

- Hoàn thành toàn bộ Phase 1
- Test kỹ booking flow và admin CRUD
- Deploy lên staging để kiểm tra tích hợp frontend-backend

### Tuần thứ hai:

- Implement filtering và search
- Add auth update endpoints
- Test các tính năng mới

### Tuần thứ ba:

- Admin stats và optimizations
- Mock data cho optional features
- Final testing và bug fixes

---

## 💡 Lưu Ý Quan Trọng

1. **Middleware Authentication:**

   - Tất cả routes admin cần `authenticateToken` + `requireAdmin`
   - User routes cần `authenticateToken` và verify ownership

2. **Error Handling:**

   - Return consistent error format:
     ```json
     {
       "success": false,
       "message": "Error message",
       "error": "Error details"
     }
     ```

3. **Response Format:**

   - Consistent response format:
     ```json
     {
       "success": true,
       "data": {...}
     }
     ```

4. **Database Field Mapping:**

   - Backend dùng Vietnamese snake_case (e.g., `Ma_phim`, `Ten_phim`)
   - Frontend expects English camelCase (e.g., `movie_id`, `name`)
   - Cần implement field mapping trong model `toJSON()` methods

5. **Testing:**

   - Test mỗi endpoint với Postman/Insomnia
   - Test authentication và authorization
   - Test error cases (404, 403, 401, 400)
   - Integration testing với frontend

6. **Documentation:**
   - Document API endpoints sau khi implement
   - Update API documentation với examples
   - Frontend team cần biết format response mới
