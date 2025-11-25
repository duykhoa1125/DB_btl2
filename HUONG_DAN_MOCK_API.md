# Hướng Dẫn Áp Dụng Service Layer và Mock API

## Tổng Quan

Tài liệu này hướng dẫn cách áp dụng mô hình **Service Layer** kết hợp **Environment Variables** để xây dựng kiến trúc Frontend linh hoạt, giúp dễ dàng chuyển đổi giữa Mock API (Next.js Route Handlers) và Real Backend API mà không cần sửa code UI.

## Tại Sao Cần Service Layer?

### Vấn Đề
- Khi gọi trực tiếp `fetch('/api/movies')` trong Component, bạn sẽ gặp khó khăn khi cần chuyển sang Backend thực tế
- Phải sửa code ở nhiều nơi khi Backend URL thay đổi
- Khó kiểm soát lỗi và xử lý response một cách đồng nhất

### Giải Pháp
- **Component**: Chỉ gọi hàm logic (ví dụ: `movieService.getAll()`)
- **Service Layer**: Chứa các hàm gọi API
- **API Client**: Nơi cấu hình Base URL tập trung
- **Environment Variable**: "Công tắc" để chuyển hướng gọi API

---

## Bước 1: Cấu Hình Biến Môi Trường

### Tạo File `.env.local`

Tạo file `.env.local` ở thư mục root của dự án (cùng cấp với `package.json`):

```bash
# Môi trường phát triển: Sử dụng Next.js API Routes (Mock API)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Môi trường production: Sẽ trỏ sang Backend thực tế
# NEXT_PUBLIC_API_URL=https://api.your-backend.com/v1
```

### Lưu Ý Quan Trọng
- ✅ Biến phải bắt đầu bằng `NEXT_PUBLIC_` để có thể sử dụng ở Client Component
- ✅ File `.env.local` không được commit lên Git (đã có trong `.gitignore`)
- ✅ Khi deploy lên Vercel/Netlify, bạn sẽ cấu hình biến môi trường trên dashboard

---

## Bước 2: Tạo API Client (Instance)

### File: `lib/axiosClient.ts`

Tạo một instance Axios để quản lý Base URL và xử lý response/error tập trung:

```typescript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Tự động lấy từ .env
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout 10 giây
});

// Response Interceptor: Xử lý response chung
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp, giúp code gọn hơn
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Ví dụ: Tự động logout khi token hết hạn
      console.error('Unauthorized! Redirecting to login...');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Request Interceptor: Thêm token vào header (nếu có)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
```

### Giải Thích
- `baseURL`: Tự động lấy từ biến môi trường, không cần hard-code
- `interceptors.response`: Tự động unwrap `response.data`, xử lý lỗi 401
- `interceptors.request`: Tự động thêm JWT token vào header

---

## Bước 3: Xây Dựng Service Layer

### Cấu Trúc Thư Mục Đề Xuất

```
services/
├── movieService.ts      # Quản lý API liên quan đến phim
├── bookingService.ts    # Quản lý API đặt vé
├── authService.ts       # Quản lý đăng nhập/đăng ký
├── showtimeService.ts   # Quản lý suất chiếu
└── types.ts             # Định nghĩa TypeScript interfaces
```

### File: `services/types.ts`

Định nghĩa các interface để đồng bộ với Backend:

```typescript
// Định nghĩa các kiểu dữ liệu (rất quan trọng!)
export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  posterUrl: string;
  trailerUrl?: string;
  rating?: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

### File: `services/movieService.ts`

```typescript
import axiosClient from '@/lib/axiosClient';
import { Movie } from './types';

const movieService = {
  // Lấy danh sách phim
  getAll: (): Promise<Movie[]> => {
    return axiosClient.get('/movies');
  },

  // Lấy chi tiết phim theo ID
  getById: (id: string): Promise<Movie> => {
    return axiosClient.get(`/movies/${id}`);
  },

  // Tìm kiếm phim
  search: (keyword: string): Promise<Movie[]> => {
    return axiosClient.get('/movies/search', {
      params: { q: keyword }
    });
  },

  // Lấy phim đang chiếu
  getNowPlaying: (): Promise<Movie[]> => {
    return axiosClient.get('/movies/now-playing');
  },

  // Lấy phim sắp chiếu
  getUpcoming: (): Promise<Movie[]> => {
    return axiosClient.get('/movies/upcoming');
  },
};

export default movieService;
```

### File: `services/bookingService.ts`

```typescript
import axiosClient from '@/lib/axiosClient';
import { Booking, Showtime } from './types';

interface CreateBookingPayload {
  showtimeId: string;
  seats: string[];
  paymentMethod: string;
}

const bookingService = {
  // Lấy suất chiếu theo phim
  getShowtimes: (movieId: string): Promise<Showtime[]> => {
    return axiosClient.get(`/showtimes?movieId=${movieId}`);
  },

  // Tạo đơn đặt vé
  create: (data: CreateBookingPayload): Promise<Booking> => {
    return axiosClient.post('/bookings', data);
  },

  // Lấy lịch sử đặt vé
  getMyBookings: (): Promise<Booking[]> => {
    return axiosClient.get('/bookings/me');
  },

  // Hủy đặt vé
  cancel: (bookingId: string): Promise<void> => {
    return axiosClient.delete(`/bookings/${bookingId}`);
  },
};

export default bookingService;
```

### File: `services/authService.ts`

```typescript
import axiosClient from '@/lib/axiosClient';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const authService = {
  login: (data: LoginPayload): Promise<AuthResponse> => {
    return axiosClient.post('/auth/login', data);
  },

  register: (data: RegisterPayload): Promise<AuthResponse> => {
    return axiosClient.post('/auth/register', data);
  },

  logout: (): void => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export default authService;
```

---

## Bước 4: Viết Mock API Bằng Next.js Route Handlers

### Tại Sao Cần Mock API?
- Phát triển Frontend độc lập, không phụ thuộc tiến độ Backend
- Dễ dàng test các trường hợp: loading, error, edge cases
- Giả lập độ trễ mạng để test UX

### File: `app/api/movies/route.ts`

```typescript
import { NextResponse } from 'next/server';

// Mock data giả lập
const mockMovies = [
  {
    id: '1',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family...',
    duration: 192,
    releaseDate: '2022-12-16',
    posterUrl: '/posters/avatar.jpg',
    rating: 7.9,
  },
  {
    id: '2',
    title: 'Everything Everywhere All at Once',
    description: 'An aging Chinese immigrant is swept up...',
    duration: 139,
    releaseDate: '2022-03-25',
    posterUrl: '/posters/eeaao.jpg',
    rating: 8.1,
  },
];

export async function GET() {
  // Giả lập độ trễ mạng (network delay)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Có thể giả lập lỗi để test error handling
  // return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

  return NextResponse.json(mockMovies);
}
```

### File: `app/api/movies/[id]/route.ts`

```typescript
import { NextResponse } from 'next/server';

const mockMovies = {
  '1': {
    id: '1',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora...',
    duration: 192,
    releaseDate: '2022-12-16',
    posterUrl: '/posters/avatar.jpg',
    trailerUrl: 'https://youtube.com/watch?v=...',
    rating: 7.9,
  },
  // Thêm các phim khác...
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const movie = mockMovies[params.id as keyof typeof mockMovies];

  if (!movie) {
    return NextResponse.json(
      { error: 'Movie not found' },
      { status: 404 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(movie);
}
```

### File: `app/api/bookings/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // Validation
  if (!body.showtimeId || !body.seats || body.seats.length === 0) {
    return NextResponse.json(
      { error: 'Invalid booking data' },
      { status: 400 }
    );
  }

  // Giả lập tạo booking
  const mockBooking = {
    id: `booking-${Date.now()}`,
    ...body,
    status: 'confirmed',
    totalPrice: body.seats.length * 120000,
    createdAt: new Date().toISOString(),
  };

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return NextResponse.json(mockBooking, { status: 201 });
}
```

---

## Bước 5: Sử Dụng Service Trong Component

### Component: `app/movies/page.tsx`

```typescript
'use client';
import { useEffect, useState } from 'react';
import movieService from '@/services/movieService';
import { Movie } from '@/services/types';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Gọi qua service layer - KHÔNG biết data từ đâu!
        const data = await movieService.getAll();
        setMovies(data);
      } catch (err) {
        setError('Không thể tải danh sách phim');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img src={movie.posterUrl} alt={movie.title} />
          <h3>{movie.title}</h3>
          <p>⭐ {movie.rating}</p>
        </div>
      ))}
    </div>
  );
}
```

### Component: `app/book-ticket/[id]/page.tsx`

```typescript
'use client';
import { useState } from 'react';
import bookingService from '@/services/bookingService';

export default function BookTicketPage({ params }: { params: { id: string } }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const booking = await bookingService.create({
        showtimeId: params.id,
        seats: selectedSeats,
        paymentMethod: 'credit_card',
      });
      
      console.log('Đặt vé thành công:', booking);
      // Redirect đến trang confirmation
      window.location.href = `/confirmation/${booking.id}`;
    } catch (error) {
      alert('Đặt vé thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* UI chọn ghế */}
      <button onClick={handleBooking} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
      </button>
    </div>
  );
}
```

---

## Bước 6: Kế Hoạch Chuyển Đổi Sang Real Backend

### Khi Backend Team Hoàn Thành API

#### Bước 1: Cập Nhật Biến Môi Trường

Chỉ cần sửa file `.env.local`:

```bash
# Trước (Mock API)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Sau (Real Backend)
NEXT_PUBLIC_API_URL=https://api.your-backend.com/v1
```

Hoặc trên Vercel/Netlify Dashboard:
- Vào **Settings** → **Environment Variables**
- Thêm hoặc sửa `NEXT_PUBLIC_API_URL`

#### Bước 2: Kiểm Tra "Hợp Đồng" (Contract)

**Trường hợp lý tưởng**: Backend trả về đúng cấu trúc bạn đã mock.

**Trường hợp thực tế**: Backend có thể khác một chút:

```typescript
// Mock của bạn
{
  "showtimeId": "123",
  "totalPrice": 240000
}

// Backend thực tế
{
  "showtime_id": "123",
  "total_price": 240000
}
```

**Giải pháp 1**: Sửa Interface trong `services/types.ts`

**Giải pháp 2** (Khuyến nghị): Viết Adapter Function

### File: `services/adapters/bookingAdapter.ts`

```typescript
// Adapter để chuyển đổi dữ liệu từ Backend sang format của UI
export const adaptBookingFromAPI = (apiData: any) => {
  return {
    id: apiData.id,
    showtimeId: apiData.showtime_id,  // snake_case → camelCase
    totalPrice: apiData.total_price,
    status: apiData.status,
    createdAt: apiData.created_at,
  };
};

export const adaptBookingToAPI = (uiData: any) => {
  return {
    showtime_id: uiData.showtimeId,  // camelCase → snake_case
    seats: uiData.seats,
    payment_method: uiData.paymentMethod,
  };
};
```

### Sử Dụng Adapter Trong Service

```typescript
import axiosClient from '@/lib/axiosClient';
import { adaptBookingFromAPI, adaptBookingToAPI } from './adapters/bookingAdapter';

const bookingService = {
  create: async (data: CreateBookingPayload) => {
    const apiPayload = adaptBookingToAPI(data);
    const response = await axiosClient.post('/bookings', apiPayload);
    return adaptBookingFromAPI(response);
  },
};
```

---

## Lợi Ích Của Kiến Trúc Này

### ✅ Không Sửa UI
- Component Frontend **KHÔNG thay đổi một dòng code** khi chuyển sang Backend thật
- Chỉ sửa `.env` và (có thể) thêm adapter

### ✅ Linh Hoạt
- Dễ dàng test loading/error state bằng Mock API
- Thêm delay, giả lập lỗi để cải thiện UX

### ✅ Độc Lập
- Frontend không bị block bởi tiến độ Backend
- Mỗi team làm việc song song

### ✅ Bảo Trì Dễ Dàng
- Tất cả logic API tập trung ở `services/`
- Dễ debug, dễ refactor

---

## Checklist Thực Hiện

- [ ] Tạo file `.env.local` với `NEXT_PUBLIC_API_URL`
- [ ] Tạo `lib/axiosClient.ts` với interceptors
- [ ] Tạo thư mục `services/` và file `types.ts`
- [ ] Viết các service files: `movieService.ts`, `bookingService.ts`, etc.
- [ ] Tạo Mock API trong `app/api/`
- [ ] Refactor các Component để sử dụng service thay vì `fetch` trực tiếp
- [ ] Test kỹ với Mock API
- [ ] Chuẩn bị Adapter functions (nếu cần)
- [ ] Khi Backend ready: Đổi `NEXT_PUBLIC_API_URL`
- [ ] Test tích hợp với Real Backend

---

## Lưu Ý Quan Trọng

### 1. TypeScript Types
- **PHẢI** định nghĩa đầy đủ interfaces trong `services/types.ts`
- Giúp phát hiện lỗi sớm khi Backend thay đổi cấu trúc

### 2. Error Handling
- Luôn có `try-catch` khi gọi service
- Hiển thị thông báo lỗi thân thiện với người dùng

### 3. Loading States
- Mock API nên có `setTimeout` để test loading UI
- Đảm bảo UX tốt khi mạng chậm

### 4. Authentication
- Nếu cần JWT, thêm vào `interceptors.request`
- Token nên lưu trong `httpOnly cookie` (an toàn hơn localStorage)

### 5. Không Commit `.env.local`
- File này chứa thông tin nhạy cảm, đã có trong `.gitignore`
- Với mỗi môi trường (dev, staging, production), dùng biến môi trường khác nhau

---

## Kết Luận

Với kiến trúc này, bạn có thể:
1. Phát triển Frontend hoàn toàn độc lập
2. Test đầy đủ với Mock API
3. Chuyển sang Real Backend chỉ bằng cách đổi 1 dòng trong `.env`
4. Component UI **HOÀN TOÀN KHÔNG CẦN SỬA**

**Đây là best practice trong phát triển Frontend hiện đại!** 🚀
