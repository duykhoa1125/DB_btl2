# Backup Plan: Direct MySQL Connection

## Kế hoạch dự phòng cho trường hợp Backend API không sẵn sàng

---

## 📊 Tình huống

**Vấn đề**: Backend team không kịp hoàn thành API hoặc thiếu chức năng quan trọng.

**Giải pháp**: Frontend sẽ kết nối **trực tiếp** với MySQL database thông qua Next.js API Routes, bỏ qua việc gọi external backend API.

---

## 🏗️ Kiến trúc hiện tại vs Backup

### Kiến trúc mong muốn (với Backend API)

```
Frontend (Next.js)
  → Internal API Routes (BFF)
    → External Backend API (Express/NestJS)
      → MySQL Database
```

### Kiến trúc Backup (Direct MySQL)

```
Frontend (Next.js)
  → Internal API Routes
    → MySQL Database (Direct Connection)
```

**Ưu điểm**:

- ✅ Không phụ thuộc vào backend team
- ✅ Dễ deploy và quản lý
- ✅ Performance tốt hơn (ít hop)
- ✅ Full control trên data

**Nhược điểm**:

- ⚠️ Security risk nếu không cấu hình đúng
- ⚠️ Logic business phức tạp nằm trong Next.js
- ⚠️ Khó scale horizontally
- ⚠️ Phải migration lại khi có backend API thật

---

## 🛠️ Tech Stack

### Dependencies cần cài đặt

```bash
npm install mysql2
npm install -D @types/mysql
```

**Giải thích**:

- `mysql2`: MySQL client cho Node.js (hỗ trợ async/await, prepared statements)
- `@types/mysql`: TypeScript definitions

---

## 📁 Cấu trúc thư mục mới

```
DB_btl2/
├── lib/
│   ├── db/
│   │   ├── connection.ts        # Database connection pool
│   │   ├── queries.ts            # Reusable SQL queries
│   │   └── utils.ts              # Database utilities
├── app/
│   ├── api/
│   │   ├── movies/
│   │   │   ├── route.ts          # GET /api/movies (fetch từ MySQL)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/movies/[id]
│   │   ├── showtimes/
│   │   │   └── route.ts          # GET /api/showtimes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── booking/
│   │   │   └── route.ts          # POST /api/booking
│   │   └── account/
│   │       └── profile/route.ts
├── services/
│   ├── movieService.ts           # Không thay đổi (vẫn gọi API routes)
│   ├── showtimeService.ts
│   └── types.ts                  # Đã có sẵn
└── .env.local                    # MySQL credentials
```

---

## 🔐 Environment Variables

### `.env.local`

```env
# MySQL Database Connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=TicketBookingSystem

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_key_change_this_in_production

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

⚠️ **QUAN TRỌNG**: Thêm `.env.local` vào `.gitignore` để không commit passwords!

---

## 💻 Implementation

### 1. Database Connection Pool

**File**: `lib/db/connection.ts`

```typescript
import mysql from "mysql2/promise";

// Singleton pattern để tránh tạo nhiều connections
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "TicketBookingSystem",
      waitForConnections: true,
      connectionLimit: 10, // Max 10 concurrent connections
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Charset để hỗ trợ tiếng Việt
      charset: "utf8mb4",
    });

    console.log("✅ MySQL connection pool created");
  }

  return pool;
}

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("❌ MySQL connection pool closed");
  }
}

// Helper function để execute queries
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T> {
  const pool = getDbPool();
  const [rows] = await pool.execute(query, params);
  return rows as T;
}
```

---

### 2. Database Queries

**File**: `lib/db/queries.ts`

```typescript
/**
 * Centralized SQL queries
 * Sử dụng prepared statements để tránh SQL injection
 */

export const QUERIES = {
  // ============ MOVIES ============
  GET_ALL_MOVIES: `
    SELECT 
      m.*,
      GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') as directors,
      GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as actors,
      AVG(mr.star_rating) as avg_rating,
      COUNT(DISTINCT mr.phone_number) as review_count
    FROM MOVIE m
    LEFT JOIN DIRECTOR d ON m.movie_id = d.movie_id
    LEFT JOIN ACTOR a ON m.movie_id = a.movie_id
    LEFT JOIN MOVIE_REVIEW mr ON m.movie_id = mr.movie_id
    GROUP BY m.movie_id
    ORDER BY m.release_date DESC
  `,

  GET_MOVIE_BY_ID: `
    SELECT 
      m.*,
      GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') as directors,
      GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') as actors,
      AVG(mr.star_rating) as avg_rating,
      COUNT(DISTINCT mr.phone_number) as review_count
    FROM MOVIE m
    LEFT JOIN DIRECTOR d ON m.movie_id = d.movie_id
    LEFT JOIN ACTOR a ON m.movie_id = a.movie_id
    LEFT JOIN MOVIE_REVIEW mr ON m.movie_id = mr.movie_id
    WHERE m.movie_id = ?
    GROUP BY m.movie_id
  `,

  GET_MOVIES_BY_STATUS: `
    SELECT 
      m.*,
      AVG(mr.star_rating) as avg_rating
    FROM MOVIE m
    LEFT JOIN MOVIE_REVIEW mr ON m.movie_id = mr.movie_id
    WHERE m.status = ?
    GROUP BY m.movie_id
    ORDER BY m.release_date DESC
  `,

  // ============ SHOWTIMES ============
  GET_SHOWTIMES_BY_MOVIE: `
    SELECT 
      s.*,
      c.name as cinema_name,
      c.address as cinema_address,
      r.name as room_name,
      m.name as movie_name,
      m.duration as movie_duration
    FROM SHOWTIME s
    JOIN ROOM r ON s.room_id = r.room_id
    JOIN CINEMA c ON r.cinema_id = c.cinema_id
    JOIN MOVIE m ON s.movie_id = m.movie_id
    WHERE s.movie_id = ?
      AND s.start_date >= CURDATE()
    ORDER BY s.start_date, s.start_time
  `,

  GET_SHOWTIME_BY_ID: `
    SELECT 
      s.*,
      c.cinema_id,
      c.name as cinema_name,
      c.address as cinema_address,
      r.name as room_name,
      m.name as movie_name,
      m.duration as movie_duration,
      m.age_rating
    FROM SHOWTIME s
    JOIN ROOM r ON s.room_id = r.room_id
    JOIN CINEMA c ON r.cinema_id = c.cinema_id
    JOIN MOVIE m ON s.movie_id = m.movie_id
    WHERE s.showtime_id = ?
  `,

  // ============ SEATS ============
  GET_SEATS_BY_ROOM: `
    SELECT 
      s.*,
      CASE 
        WHEN t.ticket_id IS NOT NULL THEN 1
        ELSE 0
      END as is_booked
    FROM SEAT s
    LEFT JOIN TICKET t ON s.room_id = t.room_id 
      AND s.seat_row = t.seat_row 
      AND s.seat_column = t.seat_column
      AND t.showtime_id = ?
    WHERE s.room_id = ?
    ORDER BY s.seat_row, s.seat_column
  `,

  // ============ REVIEWS ============
  GET_REVIEWS_BY_MOVIE: `
    SELECT 
      mr.*,
      a.fullname as user_name,
      a.avatar as user_avatar
    FROM MOVIE_REVIEW mr
    JOIN ACCOUNT a ON mr.phone_number = a.phone_number
    WHERE mr.movie_id = ?
    ORDER BY mr.date_written DESC
  `,

  // ============ CINEMAS ============
  GET_ALL_CINEMAS: `
    SELECT * FROM CINEMA
    WHERE state = 'active'
    ORDER BY name
  `,

  GET_CINEMA_BY_ID: `
    SELECT 
      c.*,
      COUNT(DISTINCT r.room_id) as total_rooms
    FROM CINEMA c
    LEFT JOIN ROOM r ON c.cinema_id = r.cinema_id
    WHERE c.cinema_id = ?
    GROUP BY c.cinema_id
  `,

  // ============ EVENTS ============
  GET_ACTIVE_EVENTS: `
    SELECT * FROM EVENT
    WHERE end_date >= CURDATE()
    ORDER BY start_date DESC
  `,

  // ============ VOUCHERS ============
  GET_VOUCHER_BY_CODE: `
    SELECT 
      v.*,
      p.description as promotional_description,
      d.percent_reduce,
      d.max_price_can_reduce
    FROM VOUCHER v
    JOIN PROMOTIONAL p ON v.promotional_id = p.promotional_id
    LEFT JOIN DISCOUNT d ON p.promotional_id = d.promotional_id
    WHERE v.code = ?
      AND v.state = 'active'
      AND v.start_date <= CURDATE()
      AND v.end_date >= CURDATE()
  `,

  // ============ AUTH ============
  GET_ACCOUNT_BY_PHONE: `
    SELECT * FROM ACCOUNT
    WHERE phone_number = ?
  `,

  GET_ACCOUNT_BY_EMAIL: `
    SELECT * FROM ACCOUNT
    WHERE email = ?
  `,

  GET_STAFF_BY_PHONE: `
    SELECT * FROM STAFF
    WHERE phone_number = ?
  `,

  CREATE_ACCOUNT: `
    INSERT INTO ACCOUNT (
      phone_number, email, password, fullname, 
      birth_date, gender, avatar, membership_points
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `,

  // ============ BOOKING ============
  CREATE_BILL: `
    INSERT INTO BILL (bill_id, phone_number, total_price)
    VALUES (NULL, ?, ?)
  `,

  CREATE_TICKET: `
    INSERT INTO TICKET (
      ticket_id, movie_name, price, expiration_date,
      bill_id, room_id, seat_row, seat_column, showtime_id
    ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  UPDATE_SEAT_STATE: `
    UPDATE SEAT 
    SET state = ?
    WHERE room_id = ? AND seat_row = ? AND seat_column = ?
  `,
};
```

---

### 3. API Route Examples

#### A. Movies API

**File**: `app/api/movies/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db/connection";
import { QUERIES } from "@/lib/db/queries";
import type { MovieDetail } from "@/services/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    let movies: any[];

    if (status) {
      movies = await executeQuery(QUERIES.GET_MOVIES_BY_STATUS, [status]);
    } else {
      movies = await executeQuery(QUERIES.GET_ALL_MOVIES);
    }

    // Transform database result to frontend types
    const moviesWithDetails: MovieDetail[] = movies.map((movie) => ({
      movie_id: movie.movie_id,
      image: movie.image || "/placeholder-movie.jpg",
      name: movie.name,
      duration: movie.duration,
      release_date: movie.release_date,
      end_date: movie.end_date,
      age_rating: movie.age_rating,
      trailer: movie.trailer,
      language: movie.language,
      status: movie.status,
      synopsis: movie.synopsis,
      directors: movie.directors ? movie.directors.split(", ") : [],
      actors: movie.actors ? movie.actors.split(", ") : [],
      avg_rating: movie.avg_rating ? parseFloat(movie.avg_rating) : undefined,
    }));

    return NextResponse.json(moviesWithDetails, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
```

#### B. Authentication API

**File**: `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db/connection";
import { QUERIES } from "@/lib/db/queries";
import type { Account, Staff, AuthResponse } from "@/services/types";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    // Try to find account by email or phone
    let account: Account[] = [];

    if (identifier.includes("@")) {
      account = await executeQuery(QUERIES.GET_ACCOUNT_BY_EMAIL, [identifier]);
    } else {
      account = await executeQuery(QUERIES.GET_ACCOUNT_BY_PHONE, [identifier]);
    }

    // If not found in accounts, try staff
    if (account.length === 0) {
      const staff: Staff[] = await executeQuery(QUERIES.GET_STAFF_BY_PHONE, [
        identifier,
      ]);

      if (staff.length > 0) {
        // Check password (in real app, use bcrypt)
        // For now, assume password is stored as plain text (NOT RECOMMENDED!)

        return NextResponse.json({
          token: "mock-jwt-token", // Replace with real JWT
          user: {
            ...staff[0],
            role: "admin",
          },
        } as AuthResponse);
      }
    } else {
      // Check password
      const user = account[0];

      // In production, use: await bcrypt.compare(password, user.password)
      if (user.password !== password) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Don't send password to frontend
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        token: "mock-jwt-token", // Replace with real JWT
        user: {
          ...userWithoutPassword,
          role: "user",
        },
      } as AuthResponse);
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
```

#### C. Booking API

**File**: `app/api/booking/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db/connection";
import { QUERIES } from "@/lib/db/queries";
import type { BookingRequest } from "@/services/types";

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  const connection = await pool.getConnection();

  try {
    // Start transaction
    await connection.beginTransaction();

    const bookingData: BookingRequest = await request.json();
    const { showtime_id, seats, phone_number } = bookingData;

    // 1. Calculate total price
    const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);

    // 2. Create bill
    const [billResult]: any = await connection.execute(QUERIES.CREATE_BILL, [
      phone_number,
      totalPrice,
    ]);
    const billId = `BIL${String(billResult.insertId).padStart(5, "0")}`;

    // 3. Get showtime details for movie name
    const [showtimeRows]: any = await connection.execute(
      QUERIES.GET_SHOWTIME_BY_ID,
      [showtime_id]
    );
    const showtime = showtimeRows[0];

    // 4. Create tickets and update seat states
    for (const seat of seats) {
      // Create ticket
      await connection.execute(QUERIES.CREATE_TICKET, [
        showtime.movie_name,
        seat.price,
        showtime.start_date + " " + showtime.end_time, // expiration
        billId,
        showtime.room_id,
        seat.row,
        seat.col,
        showtime_id,
      ]);

      // Update seat state to occupied
      await connection.execute(QUERIES.UPDATE_SEAT_STATE, [
        "occupied",
        showtime.room_id,
        seat.row,
        seat.col,
      ]);
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({
      success: true,
      bill_id: billId,
      total_price: totalPrice,
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  } finally {
    connection.release();
  }
}
```

---

## 🔄 Migration Strategy

### Bước 1: Setup Database Connection

1. Cài đặt `mysql2` package
2. Tạo `lib/db/connection.ts`
3. Test connection với simple query

### Bước 2: Migrate API Routes (Priority Order)

**Phase 1: Critical APIs** (3-4 giờ)

- [ ] `GET /api/movies` - Danh sách phim
- [ ] `GET /api/movies/[id]` - Chi tiết phim
- [ ] `GET /api/showtimes` - Danh sách suất chiếu
- [ ] `POST /api/auth/login` - Đăng nhập

**Phase 2: Booking Flow** (4-5 giờ)

- [ ] `GET /api/showtimes/[id]` - Chi tiết suất chiếu
- [ ] `GET /api/seats` - Danh sách ghế
- [ ] `POST /api/booking` - Đặt vé
- [ ] `GET /api/account/profile` - Thông tin user

**Phase 3: Additional Features** (2-3 giờ)

- [ ] `GET /api/cinemas` - Danh sách rạp
- [ ] `GET /api/events` - Sự kiện
- [ ] `POST /api/reviews` - Đánh giá phim
- [ ] `GET /api/vouchers/validate` - Validate voucher

### Bước 3: Update Service Layer

**KHÔNG CẦN THAY ĐỔI** `services/*Service.ts`!

Vì các service đang gọi `/api/*` routes, chúng ta chỉ cần thay đổi implementation bên trong API routes. Frontend code không cần động đến.

```typescript
// services/movieService.ts - KHÔNG THAY ĐỔI
export async function getAllWithDetails(): Promise<MovieDetail[]> {
  const response = await axiosClient.get("/movies");
  return response.data; // Vẫn hoạt động bình thường
}
```

### Bước 4: Testing

```bash
# 1. Test database connection
npm run dev
# Check console for "✅ MySQL connection pool created"

# 2. Test API endpoints
curl http://localhost:3000/api/movies
curl http://localhost:3000/api/showtimes?movie_id=MOV00001

# 3. Test booking flow
# Sử dụng Postman hoặc Thunder Client
```

---

## 🔒 Security Considerations

### 1. Environment Variables

```env
# NEVER commit these to git!
DB_PASSWORD=super_secret_password
JWT_SECRET=another_secret_key
```

### 2. SQL Injection Prevention

```typescript
// ❌ DANGEROUS - Never do this
const query = `SELECT * FROM ACCOUNT WHERE email = '${email}'`;

// ✅ SAFE - Always use prepared statements
const query = "SELECT * FROM ACCOUNT WHERE email = ?";
await executeQuery(query, [email]);
```

### 3. Password Hashing

```typescript
import bcrypt from "bcryptjs";

// When registering
const hashedPassword = await bcrypt.hash(password, 10);

// When logging in
const isValid = await bcrypt.compare(password, user.password);
```

**Install bcrypt**:

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 4. JWT Authentication

```typescript
import jwt from "jsonwebtoken";

// Generate token
const token = jwt.sign(
  { userId: user.phone_number, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
```

**Install JWT**:

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

---

## 📊 Database Indexes (Performance)

Để tăng performance khi query, thêm indexes vào database:

```sql
-- Thêm vào mysql_Ticket_Booking_System.sql

-- Movies
CREATE INDEX idx_movie_status ON MOVIE(status);
CREATE INDEX idx_movie_release_date ON MOVIE(release_date DESC);

-- Showtimes
CREATE INDEX idx_showtime_movie_date ON SHOWTIME(movie_id, start_date);
CREATE INDEX idx_showtime_room ON SHOWTIME(room_id, start_date);

-- Seats
CREATE INDEX idx_seat_room ON SEAT(room_id);

-- Tickets
CREATE INDEX idx_ticket_showtime ON TICKET(showtime_id);
CREATE INDEX idx_ticket_seat ON TICKET(room_id, seat_row, seat_column);

-- Reviews
CREATE INDEX idx_review_movie ON MOVIE_REVIEW(movie_id, date_written DESC);

-- Accounts
CREATE INDEX idx_account_email ON ACCOUNT(email);
```

---

## 🚀 Deployment

### Vercel Deployment with MySQL

**Option 1: PlanetScale (Recommended)**

- Free MySQL database compatible với Vercel
- Prisma-compatible
- Automatic backups

**Option 2: Railway**

- Deploy MySQL database
- Copy connection string to Vercel env vars

**Option 3: Existing MySQL Server**

- Ensure IP whitelist includes Vercel IPs
- Use connection pooling

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`

---

## ⚠️ Limitations & Trade-offs

### Limitations

1. **No horizontal scaling**: Mỗi Next.js instance connect riêng
2. **Connection pool limits**: Max 10 connections mỗi instance
3. **No caching layer**: Không có Redis
4. **Complex transactions**: Khó xử lý business logic phức tạp
5. **No WebSocket**: Real-time features hạn chế

### When to Switch to Real Backend API

Nên chuyển sang backend API thật khi:

- [ ] User base > 1000 concurrent users
- [ ] Cần real-time features (WebSockets)
- [ ] Business logic phức tạp (payment gateway, inventory)
- [ ] Cần microservices architecture
- [ ] Multiple clients (Mobile app, Admin dashboard)

---

## 📝 Checklist

### Pre-Migration

- [ ] Backup database
- [ ] Document all current API endpoints
- [ ] Review database schema
- [ ] Setup `.env.local`

### Migration

- [ ] Install `mysql2` package
- [ ] Create `lib/db/connection.ts`
- [ ] Create `lib/db/queries.ts`
- [ ] Migrate critical API routes
- [ ] Test booking flow end-to-end
- [ ] Add error handling
- [ ] Add logging

### Post-Migration

- [ ] Performance testing
- [ ] Security audit
- [ ] Add monitoring (Sentry)
- [ ] Document for future backend migration

---

## 🎯 Timeline

**Total Expected Time: 12-15 hours**

| Phase   | Task                                    | Time |
| ------- | --------------------------------------- | ---- |
| Setup   | Database connection + queries           | 2h   |
| Phase 1 | Critical APIs (movies, showtimes, auth) | 4h   |
| Phase 2 | Booking flow                            | 5h   |
| Phase 3 | Additional features                     | 3h   |
| Testing | E2E testing + bug fixes                 | 2h   |

---

## 🔄 Future Migration Path

Khi backend API thật đã sẵn sàng:

### Step 1: Create Adapter Layer

```typescript
// lib/api-adapter.ts
const USE_EXTERNAL_API = process.env.USE_EXTERNAL_API === "true";

export function getApiClient() {
  if (USE_EXTERNAL_API) {
    return externalApiClient; // Call backend API
  } else {
    return internalDbClient; // Direct MySQL
  }
}
```

### Step 2: Gradual Migration

```typescript
// Migrate từng API route một
// Bật external API cho từng feature
USE_EXTERNAL_MOVIES_API = true;
USE_EXTERNAL_BOOKING_API = false;
```

### Step 3: Complete Switch

```env
USE_EXTERNAL_API=true
```

---

## 📚 Resources

- [mysql2 Documentation](https://github.com/sidorares/node-mysql2)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## ✅ Conclusion

Kế hoạch backup này đảm bảo:

- ✅ **Dự án không bị block** bởi backend team
- ✅ **Có thể demo đầy đủ chức năng** với data thật
- ✅ **Dễ dàng migrate** sang backend API sau này
- ✅ **Security và performance** được đảm bảo

**Recommended**: Implement ngay Phase 1 để test, sau đó quyết định có cần tiếp tục không dựa trên tình hình backend team.
