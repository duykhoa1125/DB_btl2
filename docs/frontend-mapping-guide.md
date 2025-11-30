# Frontend Mapping Guide - Backend API Integration

> **Tình huống**: Backend API sẽ trả về data với field names **tiếng Việt (snake_case)**. Frontend cần **tự mapping** sang TypeScript types hiện tại (English camelCase).

## 🎯 Tổng quan

### Backend Response Format (Vietnamese)

```json
{
  "Id_phim": "MOV00001",
  "Ten_phim": "Avengers: Endgame",
  "Thoi_luong": 181,
  "Ngay_khoi_chieu": "2024-04-26"
}
```

### Frontend Expected Format (English)

```typescript
{
  movie_id: "MOV00001",
  name: "Avengers: Endgame",
  duration: 181,
  release_date: "2024-04-26"
}
```

---

## 📋 Field Mapping Reference

### 1. Movie (PHIM)

**Backend Response → Frontend Interface**

| Backend Field (VN)    | Frontend Field (EN) | Type   | Notes                          |
| --------------------- | ------------------- | ------ | ------------------------------ |
| `Id_phim`             | `movie_id`          | string | PK                             |
| `Ten_phim`            | `name`              | string |                                |
| `Thoi_luong`          | `duration`          | number | Minutes                        |
| `Ngay_khoi_chieu`     | `release_date`      | string | YYYY-MM-DD                     |
| `Ngay_ket_thuc_chieu` | `end_date`          | string | YYYY-MM-DD                     |
| `Gioi_han_tuoi`       | `age_rating`        | number |                                |
| `Trailer`             | `trailer`           | string | nullable                       |
| `Ngon_ngu`            | `language`          | string | 'vi', 'en', 'ko', 'ja'         |
| `Trang_thai`          | `status`            | string | 'upcoming', 'showing', 'ended' |
| `Noi_dung`            | `synopsis`          | string | nullable                       |

### 2. Cinema (RAP_CHIEU_PHIM)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_rap`           | `cinema_id`         | string |
| `Ten_rap`          | `name`              | string |
| `Trang_thai`       | `state`             | string |
| `Dia_chi`          | `address`           | string |

### 3. Room (PHONG)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_phong`         | `room_id`           | string |
| `Id_rap`           | `cinema_id`         | string |
| `Ten`              | `name`              | string |
| `Trang_thai`       | `state`             | string |

### 4. Seat (GHE)

| Backend Field (VN) | Frontend Field (EN) | Type   | Notes                                              |
| ------------------ | ------------------- | ------ | -------------------------------------------------- |
| `Id_phong`         | `room_id`           | string | Composite PK part 1                                |
| `So_hang`          | `seat_row`          | string | Composite PK part 2                                |
| `So_cot`           | `seat_column`       | number | Composite PK part 3                                |
| `Loai_ghe`         | `seat_type`         | string | 'normal', 'vip', 'couple'                          |
| `Trang_thai`       | `state`             | string | 'available', 'occupied', 'unavailable', 'reserved' |

### 5. Showtime (CA_CHIEU)

| Backend Field (VN)   | Frontend Field (EN) | Type   |
| -------------------- | ------------------- | ------ |
| `Id_ca_chieu`        | `showtime_id`       | string |
| `Id_phong`           | `room_id`           | string |
| `Id_phim`            | `movie_id`          | string |
| `Ngay_chieu`         | `start_date`        | string |
| `Thoi_gian_bat_dau`  | `start_time`        | string |
| `Thoi_gian_ket_thuc` | `end_time`          | string |

### 6. Account (TAI_KHOAN)

| Backend Field (VN) | Frontend Field (EN) | Type   | Notes        |
| ------------------ | ------------------- | ------ | ------------ |
| `So_dien_thoai`    | `phone_number`      | string | PK           |
| `Email`            | `email`             | string |              |
| `Ho_va_ten`        | `fullname`          | string |              |
| `Ngay_sinh`        | `birth_date`        | string | YYYY-MM-DD   |
| `Gioi_tinh`        | `gender`            | string | Gender enum  |
| `Anh_dai_dien`     | `avatar`            | string | nullable     |
| `Diem_tich_luy`    | `membership_points` | number |              |
| `Ngay_dang_ki`     | `registration_date` | string | ISO DateTime |

### 7. Staff (NHAN_VIEN)

| Backend Field (VN) | Frontend Field (EN) | Type   | Notes    |
| ------------------ | ------------------- | ------ | -------- |
| `ID_nhan_vien`     | `staff_id`          | string | PK       |
| `Ten`              | `name`              | string |          |
| `So_dien_thoai`    | `phone_number`      | string |          |
| `ID_quan_ly`       | `manage_id`         | string | nullable |
| `Id_rap`           | `cinema_id`         | string |          |

### 8. Ticket (VE)

| Backend Field (VN)  | Frontend Field (EN) | Type   |
| ------------------- | ------------------- | ------ |
| `Id_ve`             | `ticket_id`         | string |
| `Ten_phim`          | `movie_name`        | string |
| `Gia_ve`            | `price`             | number |
| `Thoi_gian_mua`     | `purchase_date`     | string |
| `Thoi_gian_het_han` | `expiration_date`   | string |
| `Id_hoa_don`        | `bill_id`           | string |
| `Id_phong`          | `room_id`           | string |
| `So_hang`           | `seat_row`          | string |
| `So_cot`            | `seat_column`       | number |
| `Id_ca_chieu`       | `showtime_id`       | string |

### 9. Bill (HOA_DON)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_hoa_don`       | `bill_id`           | string |
| `So_dien_thoai`    | `phone_number`      | string |
| `Ngay_khoi_tao`    | `creation_date`     | string |
| `Tong_tien`        | `total_price`       | number |

### 10. Food (DO_AN)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_do_an`         | `food_id`           | string |
| `Id_hoa_don`       | `bill_id`           | string |
| `Ten_do_an`        | `name`              | string |
| `Mo_ta`            | `description`       | string |
| `Gia_tien`         | `price`             | number |
| `Ngay_san_xuat`    | `production_date`   | string |
| `Ngay_het_han`     | `expiration_date`   | string |

### 11. Event (SU_KIEN)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_su_kien`       | `event_id`          | string |
| `Ten_su_kien`      | `name`              | string |
| `Mo_ta`            | `description`       | string |
| `Ngay_bat_dau`     | `start_date`        | string |
| `Ngay_ket_thuc`    | `end_date`          | string |

### 12. Promotional (KHUYEN_MAI)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_khuyen_mai`    | `promotional_id`    | string |
| `Id_su_kien`       | `event_id`          | string |
| `Mo_ta`            | `description`       | string |
| `Ngay_bat_dau`     | `start_date`        | string |
| `Ngay_ket_thuc`    | `end_date`          | string |
| `Loai_cap_bac`     | `level`             | string |

### 13. Voucher (VOUCHER)

| Backend Field (VN)       | Frontend Field (EN) | Type   |
| ------------------------ | ------------------- | ------ |
| `Ma_code`                | `code`              | string |
| `Id_khuyen_mai_giam_gia` | `promotional_id`    | string |
| `Ngay_bat_dau`           | `start_date`        | string |
| `Ngay_het_han`           | `end_date`          | string |
| `Trang_thai`             | `state`             | string |
| `So_dien_thoai`          | `phone_number`      | string |

### 14. Discount (GIAM_GIA)

| Backend Field (VN) | Frontend Field (EN)    | Type   |
| ------------------ | ---------------------- | ------ |
| `Id_khuyen_mai`    | `promotional_id`       | string |
| `Phan_tram_giam`   | `percent_reduce`       | number |
| `Max_so_tien_giam` | `max_price_can_reduce` | number |

### 15. Gift (QUA_TANG)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_khuyen_mai`    | `promotional_id`    | string |
| `Ten_qua_tang`     | `name`              | string |
| `So_luong`         | `quantity`          | number |

### 16. Movie Review (DANH_GIA)

| Backend Field (VN)  | Frontend Field (EN) | Type   |
| ------------------- | ------------------- | ------ |
| `So_dien_thoai`     | `phone_number`      | string |
| `Id_phim`           | `movie_id`          | string |
| `Ngay_viet`         | `date_written`      | string |
| `So_sao`            | `star_rating`       | number |
| `Noi_dung_danh_gia` | `review_content`    | string |

### 17. Director (DAO_DIEN)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_phim`          | `movie_id`          | string |
| `Ten_dao_dien`     | `name`              | string |

### 18. Actor (DIEN_VIEN)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `Id_phim`          | `movie_id`          | string |
| `Ten_dien_vien`    | `name`              | string |

### 19. Member Level (LOAI_THANH_VIEN)

| Backend Field (VN)        | Frontend Field (EN) | Type   |
| ------------------------- | ------------------- | ------ |
| `Loai_cap_bac`            | `level`             | string |
| `Diem_tich_luy_toi_thieu` | `minimum_point`     | number |

### 20. Account Membership (TAI_KHOAN_THANH_VIEN)

| Backend Field (VN) | Frontend Field (EN) | Type   |
| ------------------ | ------------------- | ------ |
| `So_dien_thoai`    | `phone_number`      | string |
| `Loai_cap_bac`     | `level`             | string |
| `Ngay_tham_gia`    | `join_date`         | string |

### 21. Promotional Bill (HOA_DON_KHUYEN_MAI)

| Backend Field (VN) | Frontend Field (EN)   | Type   |
| ------------------ | --------------------- | ------ |
| `Id_khuyen_mai`    | `promotional_bill_id` | string |
| `Id_hoa_don`       | `bill_id`             | string |

---

## 💻 Implementation - Frontend Mappers

### Bước 1: Tạo Mapper Configuration

Tạo file `services/api-mappers.ts`:

```typescript
// services/api-mappers.ts
import type {
  Movie,
  Cinema,
  Showtime,
  Seat,
  Account,
  Ticket,
  Bill,
} from "./types";

// Field mapping config
const FIELD_MAPPINGS = {
  PHIM: {
    Id_phim: "movie_id",
    Ten_phim: "name",
    Thoi_luong: "duration",
    Ngay_khoi_chieu: "release_date",
    Ngay_ket_thuc_chieu: "end_date",
    Gioi_han_tuoi: "age_rating",
    Trailer: "trailer",
    Ngon_ngu: "language",
    Trang_thai: "status",
    Noi_dung: "synopsis",
  },
  RAP_CHIEU_PHIM: {
    Id_rap: "cinema_id",
    Ten_rap: "name",
    Trang_thai: "state",
    Dia_chi: "address",
  },
  CA_CHIEU: {
    Id_ca_chieu: "showtime_id",
    Id_phong: "room_id",
    Id_phim: "movie_id",
    Ngay_chieu: "start_date",
    Thoi_gian_bat_dau: "start_time",
    Thoi_gian_ket_thuc: "end_time",
  },
  GHE: {
    Id_phong: "room_id",
    So_hang: "seat_row",
    So_cot: "seat_column",
    Loai_ghe: "seat_type",
    Trang_thai: "state",
  },
  TAI_KHOAN: {
    So_dien_thoai: "phone_number",
    Email: "email",
    Ho_va_ten: "fullname",
    Ngay_sinh: "birth_date",
    Gioi_tinh: "gender",
    Anh_dai_dien: "avatar",
    Diem_tich_luy: "membership_points",
    Ngay_dang_ki: "registration_date",
  },
  VE: {
    Id_ve: "ticket_id",
    Ten_phim: "movie_name",
    Gia_ve: "price",
    Thoi_gian_mua: "purchase_date",
    Thoi_gian_het_han: "expiration_date",
    Id_hoa_don: "bill_id",
    Id_phong: "room_id",
    So_hang: "seat_row",
    So_cot: "seat_column",
    Id_ca_chieu: "showtime_id",
  },
  HOA_DON: {
    Id_hoa_don: "bill_id",
    So_dien_thoai: "phone_number",
    Ngay_khoi_tao: "creation_date",
    Tong_tien: "total_price",
  },
  // Add more as needed
} as const;

// Generic mapper function
export function mapBackendToFrontend<T>(
  entityType: keyof typeof FIELD_MAPPINGS,
  backendData: Record<string, any>
): T {
  const mapping = FIELD_MAPPINGS[entityType];
  const result: Record<string, any> = {};

  for (const [backendField, frontendField] of Object.entries(mapping)) {
    if (backendField in backendData) {
      result[frontendField] = backendData[backendField];
    }
  }

  return result as T;
}

// Specific mapper functions
export function mapMovie(backendMovie: any): Movie {
  return mapBackendToFrontend<Movie>("PHIM", backendMovie);
}

export function mapCinema(backendCinema: any): Cinema {
  return mapBackendToFrontend<Cinema>("RAP_CHIEU_PHIM", backendCinema);
}

export function mapShowtime(backendShowtime: any): Showtime {
  return mapBackendToFrontend<Showtime>("CA_CHIEU", backendShowtime);
}

export function mapSeat(backendSeat: any): Seat {
  return mapBackendToFrontend<Seat>("GHE", backendSeat);
}

export function mapAccount(backendAccount: any): Account {
  return mapBackendToFrontend<Account>("TAI_KHOAN", backendAccount);
}

export function mapTicket(backendTicket: any): Ticket {
  return mapBackendToFrontend<Ticket>("VE", backendTicket);
}

export function mapBill(backendBill: any): Bill {
  return mapBackendToFrontend<Bill>("HOA_DON", backendBill);
}
```

### Bước 2: Sử dụng trong Services

Update các service files để dùng mappers:

```typescript
// services/movieService.ts
import axios from "axios";
import { mapMovie } from "./api-mappers";
import type { Movie } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class MovieService {
  static async getMovies(): Promise<Movie[]> {
    const response = await axios.get(`${API_BASE_URL}/api/movies`);
    // Backend returns array with Vietnamese field names
    return response.data.map(mapMovie);
  }

  static async getMovieById(id: string): Promise<Movie> {
    const response = await axios.get(`${API_BASE_URL}/api/movies/${id}`);
    // Backend returns object with Vietnamese field names
    return mapMovie(response.data);
  }
}
```

```typescript
// services/showtimeService.ts
import axios from "axios";
import { mapShowtime } from "./api-mappers";
import type { Showtime } from "./types";

export class ShowtimeService {
  static async getShowtimesByMovie(movieId: string): Promise<Showtime[]> {
    const response = await axios.get(`${API_BASE_URL}/api/showtimes`, {
      params: { movie_id: movieId },
    });
    return response.data.map(mapShowtime);
  }
}
```

### Bước 3: Reverse Mapping (Frontend → Backend)

Khi gửi data lên backend (create/update), cần reverse mapping:

```typescript
// services/api-mappers.ts

// Reverse mapping function
export function mapFrontendToBackend<T>(
  entityType: keyof typeof FIELD_MAPPINGS,
  frontendData: Record<string, any>
): T {
  const mapping = FIELD_MAPPINGS[entityType];
  const result: Record<string, any> = {};

  // Reverse the mapping
  const reverseMapping = Object.fromEntries(
    Object.entries(mapping).map(([backend, frontend]) => [frontend, backend])
  );

  for (const [frontendField, backendField] of Object.entries(reverseMapping)) {
    if (frontendField in frontendData) {
      result[backendField] = frontendData[frontendField];
    }
  }

  return result as T;
}

// Example: Create movie review
export async function createReview(review: {
  phone_number: string;
  movie_id: string;
  star_rating: number;
  review_content: string;
}) {
  // Map to backend format
  const backendReview = mapFrontendToBackend("DANH_GIA", review);
  // backendReview = {
  //   So_dien_thoai: '0912345678',
  //   Id_phim: 'MOV00001',
  //   So_sao: 5,
  //   Noi_dung_danh_gia: 'Great movie!'
  // }

  await axios.post(`${API_BASE_URL}/api/reviews`, backendReview);
}
```

---

## 🧪 Testing

```typescript
// __tests__/api-mappers.test.ts
import { mapMovie, mapBackendToFrontend } from "../services/api-mappers";

describe("API Mappers", () => {
  it("should map backend movie to frontend format", () => {
    const backendMovie = {
      Id_phim: "MOV00001",
      Ten_phim: "Avengers: Endgame",
      Thoi_luong: 181,
      Ngay_khoi_chieu: "2024-04-26",
      Ngay_ket_thuc_chieu: "2024-06-26",
      Gioi_han_tuoi: 13,
      Trailer: "https://youtube.com/watch?v=...",
      Ngon_ngu: "en",
      Trang_thai: "showing",
      Noi_dung: "Epic superhero movie",
    };

    const movie = mapMovie(backendMovie);

    expect(movie).toEqual({
      movie_id: "MOV00001",
      name: "Avengers: Endgame",
      duration: 181,
      release_date: "2024-04-26",
      end_date: "2024-06-26",
      age_rating: 13,
      trailer: "https://youtube.com/watch?v=...",
      language: "en",
      status: "showing",
      synopsis: "Epic superhero movie",
    });
  });

  it("should handle missing optional fields", () => {
    const backendMovie = {
      Id_phim: "MOV00002",
      Ten_phim: "Test Movie",
      Thoi_luong: 120,
      Ngay_khoi_chieu: "2024-05-01",
      Ngay_ket_thuc_chieu: "2024-07-01",
      Gioi_han_tuoi: 16,
      Ngon_ngu: "vi",
      Trang_thai: "upcoming",
      // Trailer and Noi_dung missing
    };

    const movie = mapMovie(backendMovie);

    expect(movie.trailer).toBeUndefined();
    expect(movie.synopsis).toBeUndefined();
  });
});
```

---

## ✅ Implementation Checklist

### Setup

- [ ] Tạo file `services/api-mappers.ts`
- [ ] Add field mappings cho tất cả entities cần dùng
- [ ] Implement `mapBackendToFrontend()` và `mapFrontendToBackend()`

### Update Services

- [ ] Update `movieService.ts` để dùng `mapMovie()`
- [ ] Update `showtimeService.ts` để dùng `mapShowtime()`
- [ ] Update `accountService.ts` để dùng `mapAccount()`
- [ ] Update các services khác tương tự

### Testing

- [ ] Viết unit tests cho tất cả mapper functions
- [ ] Test với real backend API responses
- [ ] Verify TypeScript types work correctly

### Configuration

- [ ] Set `NEXT_PUBLIC_API_URL` trong `.env.local`
- [ ] Test với backend development server
- [ ] Update documentation nếu cần

---

## 📝 Quick Reference - Common Transformations

```typescript
// Backend → Frontend
Id_phim → movie_id
Ten_phim → name
So_dien_thoai → phone_number
Ngay_khoi_chieu → release_date
Thoi_gian_bat_dau → start_time
Trang_thai → state/status

// Frontend → Backend (khi gửi data)
movie_id → Id_phim
name → Ten_phim
phone_number → So_dien_thoai
release_date → Ngay_khoi_chieu
start_time → Thoi_gian_bat_dau
state/status → Trang_thai
```

---

## 🚀 Next Steps

1. **Implement mappers**: Tạo file `api-mappers.ts` với tất cả mappings
2. **Update services**: Sửa tất cả service files để use mappers
3. **Test thoroughly**: Ensure data flows correctly từ backend → frontend
4. **Handle edge cases**: Null values, missing fields, date formats
5. **Monitor production**: Log any mapping errors

**Version**: 2.0  
**Updated**: 2025-11-29  
**For**: Frontend Developers
