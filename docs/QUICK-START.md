# 🚀 Quick Start - Backend Integration

## ✅ ĐÃ HOÀN THÀNH

1. ✅ `lib/axiosClient.ts` - Updated với response unwrapper
2. ✅ `.env.local` - Đã tạo với backend URL
3. ✅ Test script - `test-integration.ps1`

## 🎯 KHỞI ĐỘNG

### Bước 1: Start Backend (giả sử đã fix xong)

```bash
# Terminal 1
cd server
npm start
```

Verify: `http://localhost:5000/movies` có response

### Bước 2: Start Frontend

```bash
# Terminal 2 (hoặc PowerShell mới)
cd c:\Users\Khoa\Desktop\DB_btl2
npm run dev
```

### Bước 3: Test

Mở browser: `http://localhost:3000`

**DevTools Console → Network tab:**

- Filter: `localhost:5000`
- Should see requests to backend!

## 🧪 TEST FLOW

### Test 1: Login (QUAN TRỌNG NHẤT!)

1. Vào: `http://localhost:3000/account/login`
2. Nhập credentials
3. **Check Console:**
   - Request: `POST http://localhost:5000/auth/login`
   - Response: `{ token: "...", user: {...} }`
   - localStorage: Check `token` được lưu
4. **Verify:** Redirect về homepage

### Test 2: Homepage

1. Should see movies từ backend
2. **Check Console:**
   - Request: `GET http://localhost:5000/movies`
   - Movies có `image` field

### Test 3: Booking

1. Click phim → Detail
2. Chọn suất chiếu
3. Chọn ghế
4. **Check Console:**
   - Request: `GET http://localhost:5000/showtimes/:id/seats`
   - Seats có `price` và `is_booked`

## ⚠️ NẾU CÓ LỖI

### CORS Error?

→ Backend cần enable CORS cho `http://localhost:3000`

### Connection Refused?

→ Backend chưa chạy, check port 5000

### 401 Unauthorized?

→ Token không được attach, check localStorage

### Response format error?

→ axiosClient đã unwrap tự động rồi, check backend response

## 📂 FILES ĐÃ TẠO

- ✅ `.env.local` - Backend configuration
- ✅ `docs/integration-complete.md` - Full guide
- ✅ `docs/integration-guide.md` - Troubleshooting
- ✅ `test-integration.ps1` - Test script

## 🎉 DONE!

Tất cả đã sẵn sàng. Chỉ cần:

1. Backend team fix critical issues
2. Start backend server
3. Start frontend
4. Test!

**Không cần sửa code frontend thêm!**
