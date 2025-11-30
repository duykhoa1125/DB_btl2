# Hướng Dẫn Tích Hợp Backend

**Trạng thái:** ✅ Ready to integrate  
**Thời gian thực hiện:** 5-10 phút  
**Yêu cầu:** Backend server đã fix các critical issues và đang chạy ở port 5000

---

## 🚀 Các Bước Tích Hợp

### Step 1: Tạo file `.env.local`

Tạo file `.env.local` ở root project với nội dung:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_BACKEND=true
NEXT_PUBLIC_DEBUG_API=true
```

**Lưu ý:** File `.env.local` đã có trong `.gitignore` nên sẽ không bị commit lên Git.

**Cách tạo:**

```bash
# Windows PowerShell
cd c:\Users\Khoa\Desktop\DB_btl2
New-Item -Path ".env.local" -ItemType File -Force
```

Sau đó copy nội dung trên vào file.

---

### Step 2: Verify axiosClient Configuration

File `lib/axiosClient.ts` đã được update với:

✅ **Response Interceptor** - Unwrap `{ success, data }` format:

```typescript
if (response.data?.success && response.data?.data) {
  return response.data.data; // Unwrap
}
return response.data;
```

✅ **Request Interceptor** - Auto-attach JWT token

✅ **401 Error Handler** - Auto redirect to login

**Không cần sửa gì thêm!**

---

### Step 3: Kiểm tra Backend Endpoints Mapping

Frontend services đang call các endpoints sau:

| Service                                 | Method | Expected Backend Endpoint |
| --------------------------------------- | ------ | ------------------------- |
| `authService.login()`                   | POST   | `/auth/login`             |
| `authService.register()`                | POST   | `/auth/register`          |
| `authService.getCurrentUser()`          | GET    | `/auth/me`                |
| `movieService.getAll()`                 | GET    | `/movies`                 |
| `movieService.getById(id)`              | GET    | `/movies/:id`             |
| `showtimeService.getAll()`              | GET    | `/showtimes`              |
| `showtimeService.getAvailableSeats(id)` | GET    | `/showtimes/:id/seats`    |
| `bookingService.createBooking()`        | POST   | `/booking`                |
| `cinemaService.getAll()`                | GET    | `/cinemas`                |

**Verify:** Backend đã implement các endpoints này với đúng format!

---

### Step 4: Test Backend Connectivity

#### Option A: Chạy thủ công

1. **Start Backend Server:**

```bash
cd c:\Users\Khoa\Desktop\DB_btl2\server
npm start
```

Backend sẽ chạy ở `http://localhost:5000`

2. **Start Frontend:**

```bash
cd c:\Users\Khoa\Desktop\DB_btl2
npm run dev
```

Frontend sẽ chạy ở `http://localhost:3000`

3. **Test Login:**

- Mở browser: `http://localhost:3000/account/login`
- Nhập credentials
- Mở DevTools Console để xem API calls
- Verify request gửi đến `http://localhost:5000/auth/login`

#### Option B: Test với curl

```bash
# Test backend health
curl http://localhost:5000/movies

# Test login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"password123"}'
```

---

## 🎯 Troubleshooting

### Vấn đề 1: CORS Error

**Triệu chứng:**

```
Access to XMLHttpRequest at 'http://localhost:5000/movies'
from origin 'http://localhost:3000' has been blocked by CORS
```

**Giải pháp:**
Backend cần có CORS config (đã có trong `server/src/app.js`):

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

Verify file `server/.env` có:

```env
FRONTEND_URL=http://localhost:3000
```

---

### Vấn đề 2: Connection Refused

**Triệu chứng:**

```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Giải pháp:**

1. Check backend có đang chạy không: `netstat -an | findstr 5000`
2. Restart backend server
3. Verify port 5000 không bị process khác chiếm

---

### Vấn đề 3: Response Format Error

**Triệu chứng:**

```
Cannot read property 'token' of undefined
```

**Nguyên nhân:** Backend trả về `{ success: true, data: { token, user } }`

**Giải pháp:**
Response interceptor trong `axiosClient.ts` đã unwrap tự động! Nếu vẫn lỗi:

1. Check console log để xem response thực tế
2. Verify backend đã sửa response format

---

### Vấn đề 4: Token Not Attached

**Triệu chứng:**

```
401 Unauthorized on protected routes
```

**Giải pháp:**

1. Check localStorage có token không:

```javascript
console.log(localStorage.getItem("token"));
```

2. Verify `authService.login()` có lưu token:

```typescript
// Should have:
localStorage.setItem("token", response.token);
```

---

## ✅ Verification Checklist

Sau khi integrate, test các flow sau:

- [ ] **Login Flow**

  - [ ] Login với email/phone thành công
  - [ ] Token được lưu vào localStorage
  - [ ] User được redirect về homepage
  - [ ] Token được attach vào subsequent requests

- [ ] **Movie Listing**

  - [ ] Homepage hiển thị danh sách phim
  - [ ] Phim có đầy đủ thông tin (image, name, duration, v.v.)
  - [ ] Click vào phim → navigate đến detail page

- [ ] **Movie Detail**

  - [ ] Hiển thị đầy đủ thông tin phim
  - [ ] Directors và Actors được hiển thị
  - [ ] Rating được tính đúng

- [ ] **Booking Flow**

  - [ ] Chọn suất chiếu
  - [ ] Load seat map
  - [ ] Chọn ghế (ghế đã đặt bị disable)
  - [ ] Tính giá đúng
  - [ ] Tạo booking thành công
  - [ ] Redirect đến ticket/confirmation page

- [ ] **Protected Routes**
  - [ ] Chưa login → auto redirect đến login page
  - [ ] Đã login → access được booking history
  - [ ] Token expired → auto redirect đến login

---

## 📊 Monitoring

Khi develop, mở DevTools Console để monitor:

1. **Network Tab:**

   - Filter: `localhost:5000`
   - Check request/response format
   - Verify status codes (200, 401, v.v.)

2. **Console Tab:**

   - Check for errors
   - Verify data được unwrap đúng

3. **Application Tab > Local Storage:**
   - Verify `token` được lưu
   - Verify `currentUser` được lưu

---

## 🔄 Rollback Plan

Nếu backend có vấn đề, tạm thời switch về mock data:

1. Comment dòng `NEXT_PUBLIC_API_URL` trong `.env.local`
2. Restart Next.js dev server
3. Frontend sẽ tự động dùng Next.js API routes (mock data)

---

**Generated:** 2025-11-30 22:56  
**Status:** Ready to integrate
