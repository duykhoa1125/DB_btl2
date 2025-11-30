# Backend API Mapping Plan

> [!IMPORTANT] > **Mục tiêu chính**: Backend team sử dụng cấu trúc database với tên tiếng Việt snake_case, trong khi frontend tiếp tục sử dụng TypeScript types với tên tiếng Anh camelCase **KHÔNG CẦN SỬA CODE FRONTEND**.

## 1. Tổng quan chiến lược

### 1.1. Vấn đề

- **Backend Database** (mới): Sử dụng tên tiếng Việt snake_case (VD: `Id_phim`, `Ten_phim`, `Ngay_khoi_chieu`)
- **Frontend Types** (hiện tại): Sử dụng tên tiếng Anh camelCase (VD: `movie_id`, `name`, `release_date`)
- **Yêu cầu**: Thêm trường `hinh_anh` vào table `PHIM`

### 1.2. Giải pháp

Tạo **API Adapter Layer** ở backend để:

- Nhận data từ database (Vietnamese snake_case)
- Transform sang format frontend mong đợi (English camelCase)
- Trả về response theo đúng TypeScript interface của frontend

### 1.3. Ưu điểm

✅ Frontend không cần thay đổi code  
✅ Type safety được giữ nguyên  
✅ Backend có thể sử dụng tên tiếng Việt dễ hiểu  
✅ Dễ dàng thêm field mới (VD: `hinh_anh`)  
✅ Tách biệt logic frontend/backend

---

## 2. Schema Mapping Chi Tiết

### 2.1. Table PHIM → Movie Interface

#### Database Schema (Vietnamese)

```sql
CREATE TABLE PHIM (
    Id_phim VARCHAR(8) PRIMARY KEY,
    Ten_phim NVARCHAR(50) NOT NULL,
    Thoi_luong INT NOT NULL,
    Ngay_khoi_chieu DATE NOT NULL,
    Ngay_ket_thuc_chieu DATE NOT NULL,
    Gioi_han_tuoi INT NOT NULL DEFAULT(0),
    Trailer VARCHAR(500),
    Ngon_ngu VARCHAR(10) NOT NULL DEFAULT('vi'),
    Trang_thai VARCHAR(15) DEFAULT('upcoming'),
    Noi_dung NVARCHAR(500),
    Hinh_anh VARCHAR(500)  -- ⚠️ FIELD MỚI SẼ THÊM
);
```

#### Frontend Interface (English)

```typescript
export interface Movie {
  movie_id: string;
  image: string; // ← Map từ Hinh_anh
  name: string;
  duration: number;
  release_date: string;
  end_date: string;
  age_rating: number;
  trailer?: string | null;
  language: MovieLanguage;
  status: MovieStatus;
  synopsis?: string | null;
}
```

#### Field Mapping Table

| Database Column (VN)  | Frontend Field (EN) | Data Type      | Notes                             |
| --------------------- | ------------------- | -------------- | --------------------------------- |
| `Id_phim`             | `movie_id`          | string         | Primary key                       |
| `Hinh_anh`            | `image`             | string         | **NEW FIELD** - URL hình ảnh phim |
| `Ten_phim`            | `name`              | string         | Tên phim                          |
| `Thoi_luong`          | `duration`          | number         | Thời lượng (phút)                 |
| `Ngay_khoi_chieu`     | `release_date`      | string         | Format: "YYYY-MM-DD"              |
| `Ngay_ket_thuc_chieu` | `end_date`          | string         | Format: "YYYY-MM-DD"              |
| `Gioi_han_tuoi`       | `age_rating`        | number         | Độ tuổi tối thiểu                 |
| `Trailer`             | `trailer`           | string \| null | URL trailer                       |
| `Ngon_ngu`            | `language`          | string         | 'vi', 'en', 'ko', 'ja'            |
| `Trang_thai`          | `status`            | string         | 'upcoming', 'showing', 'ended'    |
| `Noi_dung`            | `synopsis`          | string \| null | Tóm tắt nội dung                  |

---

### 2.2. Table RAP_CHIEU_PHIM → Cinema Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                |
| -------------------- | ------------------- | --------- | -------------------- |
| `Id_rap`             | `cinema_id`         | string    | PK: CIN00001         |
| `Ten_rap`            | `name`              | string    | Tên rạp              |
| `Trang_thai`         | `state`             | string    | 'active', 'inactive' |
| `Dia_chi`            | `address`           | string    | Địa chỉ              |

---

### 2.3. Table PHONG → Room Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                        |
| -------------------- | ------------------- | --------- | ---------------------------- |
| `Id_phong`           | `room_id`           | string    | PK: ROO00001                 |
| `Id_rap`             | `cinema_id`         | string    | FK to Cinema                 |
| `Ten`                | `name`              | string    | Tên phòng (R01, R02)         |
| `Trang_thai`         | `state`             | string    | 'active', 'inactive', 'full' |

---

### 2.4. Table GHE → Seat Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                                              |
| -------------------- | ------------------- | --------- | -------------------------------------------------- |
| `Id_phong`           | `room_id`           | string    | Composite PK part 1                                |
| `So_hang`            | `seat_row`          | string    | Composite PK part 2 (CHAR: 'A', 'B')               |
| `So_cot`             | `seat_column`       | number    | Composite PK part 3 (INT: 1, 2, 3)                 |
| `Loai_ghe`           | `seat_type`         | string    | 'normal', 'vip', 'couple'                          |
| `Trang_thai`         | `state`             | string    | 'available', 'occupied', 'unavailable', 'reserved' |

---

### 2.5. Table CA_CHIEU → Showtime Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                |
| -------------------- | ------------------- | --------- | -------------------- |
| `Id_ca_chieu`        | `showtime_id`       | string    | PK: SHO00001         |
| `Id_phong`           | `room_id`           | string    | FK to Room           |
| `Id_phim`            | `movie_id`          | string    | FK to Movie          |
| `Ngay_chieu`         | `start_date`        | string    | Format: "YYYY-MM-DD" |
| `Thoi_gian_bat_dau`  | `start_time`        | string    | Format: "HH:mm:ss"   |
| `Thoi_gian_ket_thuc` | `end_time`          | string    | Format: "HH:mm:ss"   |

---

### 2.6. Table TAI_KHOAN → Account Interface

| Database Column (VN) | Frontend Field (EN) | Data Type      | Notes                        |
| -------------------- | ------------------- | -------------- | ---------------------------- |
| `So_dien_thoai`      | `phone_number`      | string         | PK (10 digits)               |
| `Email`              | `email`             | string         | Unique                       |
| `Mat_khau`           | `password`          | string         | **Never return to frontend** |
| `Ho_va_ten`          | `fullname`          | string         | Họ và tên                    |
| `Ngay_sinh`          | `birth_date`        | string         | Format: "YYYY-MM-DD"         |
| `Gioi_tinh`          | `gender`            | string         | 'male', 'female', 'unknown'  |
| `Anh_dai_dien`       | `avatar`            | string \| null | URL avatar                   |
| `Diem_tich_luy`      | `membership_points` | number         | Điểm tích lũy                |
| `Ngay_dang_ki`       | `registration_date` | string         | Format: ISO DateTime         |

---

### 2.7. Table NHAN_VIEN → Staff Interface

| Database Column (VN) | Frontend Field (EN) | Data Type      | Notes                        |
| -------------------- | ------------------- | -------------- | ---------------------------- |
| `ID_nhan_vien`       | `staff_id`          | string         | PK: STA00001                 |
| `Ten`                | `name`              | string         | Tên nhân viên                |
| `So_dien_thoai`      | `phone_number`      | string         | Unique (10 digits)           |
| `ID_quan_ly`         | `manage_id`         | string \| null | FK to Staff (self-reference) |
| `Id_rap`             | `cinema_id`         | string         | FK to Cinema                 |

---

### 2.8. Table VE → Ticket Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                   |
| -------------------- | ------------------- | --------- | ----------------------- |
| `Id_ve`              | `ticket_id`         | string    | PK: TIC00001            |
| `Ten_phim`           | `movie_name`        | string    | Tên phim (denormalized) |
| `Gia_ve`             | `price`             | number    | Giá vé (VNĐ)            |
| `Thoi_gian_mua`      | `purchase_date`     | string    | ISO DateTime            |
| `Thoi_gian_het_han`  | `expiration_date`   | string    | ISO DateTime            |
| `Id_hoa_don`         | `bill_id`           | string    | FK to Bill              |
| `Id_phong`           | `room_id`           | string    | FK to Seat (part 1)     |
| `So_hang`            | `seat_row`          | string    | FK to Seat (part 2)     |
| `So_cot`             | `seat_column`       | number    | FK to Seat (part 3)     |
| `Id_ca_chieu`        | `showtime_id`       | string    | FK to Showtime          |

---

### 2.9. Table HOA_DON → Bill Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes           |
| -------------------- | ------------------- | --------- | --------------- |
| `Id_hoa_don`         | `bill_id`           | string    | PK: BIL00001    |
| `So_dien_thoai`      | `phone_number`      | string    | FK to Account   |
| `Ngay_khoi_tao`      | `creation_date`     | string    | ISO DateTime    |
| `Tong_tien`          | `total_price`       | number    | Tổng tiền (VNĐ) |

---

### 2.10. Table DO_AN → Food Interface

| Database Column (VN) | Frontend Field (EN) | Data Type      | Notes                |
| -------------------- | ------------------- | -------------- | -------------------- |
| `Id_do_an`           | `food_id`           | string         | PK: FOO00001         |
| `Id_hoa_don`         | `bill_id`           | string         | FK to Bill           |
| `Ten_do_an`          | `name`              | string         | Tên đồ ăn            |
| `Mo_ta`              | `description`       | string \| null | Mô tả                |
| `Gia_tien`           | `price`             | number         | Giá tiền             |
| `Ngay_san_xuat`      | `production_date`   | string         | Format: "YYYY-MM-DD" |
| `Ngay_het_han`       | `expiration_date`   | string         | Format: "YYYY-MM-DD" |

---

### 2.11. Table SU_KIEN → Event Interface

| Database Column (VN) | Frontend Field (EN) | Data Type      | Notes                |
| -------------------- | ------------------- | -------------- | -------------------- |
| `Id_su_kien`         | `event_id`          | string         | PK: EVE00001         |
| `Ten_su_kien`        | `name`              | string         | Tên sự kiện          |
| `Mo_ta`              | `description`       | string \| null | Mô tả                |
| `Ngay_bat_dau`       | `start_date`        | string         | Format: "YYYY-MM-DD" |
| `Ngay_ket_thuc`      | `end_date`          | string         | Format: "YYYY-MM-DD" |

---

### 2.12. Table KHUYEN_MAI → Promotional Interface

| Database Column (VN) | Frontend Field (EN) | Data Type      | Notes                              |
| -------------------- | ------------------- | -------------- | ---------------------------------- |
| `Id_khuyen_mai`      | `promotional_id`    | string         | PK: PRO00001                       |
| `Id_su_kien`         | `event_id`          | string         | FK to Event                        |
| `Mo_ta`              | `description`       | string \| null | Mô tả                              |
| `Ngay_bat_dau`       | `start_date`        | string         | Format: "YYYY-MM-DD"               |
| `Ngay_ket_thuc`      | `end_date`          | string         | Format: "YYYY-MM-DD"               |
| `Loai_cap_bac`       | `level`             | string         | 'copper', 'gold', 'diamond', 'vip' |

---

### 2.13. Table VOUCHER → Voucher Interface

| Database Column (VN)     | Frontend Field (EN) | Data Type | Notes                       |
| ------------------------ | ------------------- | --------- | --------------------------- |
| `Ma_code`                | `code`              | string    | PK: VOU00001                |
| `Id_khuyen_mai_giam_gia` | `promotional_id`    | string    | FK to Promotional           |
| `Ngay_bat_dau`           | `start_date`        | string    | Format: "YYYY-MM-DD"        |
| `Ngay_het_han`           | `end_date`          | string    | Format: "YYYY-MM-DD"        |
| `Trang_thai`             | `state`             | string    | 'active', 'used', 'expired' |
| `So_dien_thoai`          | `phone_number`      | string    | FK to Account               |

---

### 2.14. Table GIAM_GIA → Discount Interface

| Database Column (VN) | Frontend Field (EN)    | Data Type | Notes                |
| -------------------- | ---------------------- | --------- | -------------------- |
| `Id_khuyen_mai`      | `promotional_id`       | string    | PK/FK to Promotional |
| `Phan_tram_giam`     | `percent_reduce`       | number    | DECIMAL(5,2): 0-100  |
| `Max_so_tien_giam`   | `max_price_can_reduce` | number    | Số tiền giảm tối đa  |

---

### 2.15. Table QUA_TANG → Gift Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                |
| -------------------- | ------------------- | --------- | -------------------- |
| `Id_khuyen_mai`      | `promotional_id`    | string    | PK/FK to Promotional |
| `Ten_qua_tang`       | `name`              | string    | Tên quà tặng         |
| `So_luong`           | `quantity`          | number    | Số lượng             |

---

### 2.16. Table DANH_GIA → MovieReview Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                             |
| -------------------- | ------------------- | --------- | --------------------------------- |
| `So_dien_thoai`      | `phone_number`      | string    | Composite PK part 1               |
| `Id_phim`            | `movie_id`          | string    | Composite PK part 2               |
| `Ngay_viet`          | `date_written`      | string    | Composite PK part 3, ISO DateTime |
| `So_sao`             | `star_rating`       | number    | 1-5                               |
| `Noi_dung_danh_gia`  | `review_content`    | string    | Nội dung đánh giá                 |

---

### 2.17. Table DAO_DIEN → Director Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes               |
| -------------------- | ------------------- | --------- | ------------------- |
| `Id_phim`            | `movie_id`          | string    | Composite PK part 1 |
| `Ten_dao_dien`       | `name`              | string    | Composite PK part 2 |

---

### 2.18. Table DIEN_VIEN → Actor Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes               |
| -------------------- | ------------------- | --------- | ------------------- |
| `Id_phim`            | `movie_id`          | string    | Composite PK part 1 |
| `Ten_dien_vien`      | `name`              | string    | Composite PK part 2 |

---

### 2.19. Table LOAI_THANH_VIEN → Member Interface

| Database Column (VN)      | Frontend Field (EN) | Data Type | Notes                                  |
| ------------------------- | ------------------- | --------- | -------------------------------------- |
| `Loai_cap_bac`            | `level`             | string    | PK: 'copper', 'gold', 'diamond', 'vip' |
| `Diem_tich_luy_toi_thieu` | `minimum_point`     | number    | Điểm tối thiểu                         |

---

### 2.20. Table TAI_KHOAN_THANH_VIEN → AccountMembership Interface

| Database Column (VN) | Frontend Field (EN) | Data Type | Notes                |
| -------------------- | ------------------- | --------- | -------------------- |
| `So_dien_thoai`      | `phone_number`      | string    | Composite PK part 1  |
| `Loai_cap_bac`       | `level`             | string    | Composite PK part 2  |
| `Ngay_tham_gia`      | `join_date`         | string    | Format: "YYYY-MM-DD" |

---

### 2.21. Table HOA_DON_KHUYEN_MAI → PromotionalBill Interface

| Database Column (VN) | Frontend Field (EN)   | Data Type | Notes               |
| -------------------- | --------------------- | --------- | ------------------- |
| `Id_khuyen_mai`      | `promotional_bill_id` | string    | PK: PRO00001        |
| `Id_hoa_don`         | `bill_id`             | string    | FK to Bill (Unique) |

---

## 3. Implementation Guide

### 3.1. Backend API Adapter Layer (Node.js/Express Example)

Backend team cần tạo **mapper functions** để transform data:

```typescript
// backend/mappers/movieMapper.ts

interface PhimDB {
  Id_phim: string;
  Ten_phim: string;
  Thoi_luong: number;
  Ngay_khoi_chieu: string;
  Ngay_ket_thuc_chieu: string;
  Gioi_han_tuoi: number;
  Trailer: string | null;
  Ngon_ngu: string;
  Trang_thai: string;
  Noi_dung: string | null;
  Hinh_anh: string | null; // ← NEW FIELD
}

interface MovieAPI {
  movie_id: string;
  image: string;
  name: string;
  duration: number;
  release_date: string;
  end_date: string;
  age_rating: number;
  trailer?: string | null;
  language: string;
  status: string;
  synopsis?: string | null;
}

export function mapPhimToMovie(phim: PhimDB): MovieAPI {
  return {
    movie_id: phim.Id_phim,
    image: phim.Hinh_anh || "/default-poster.jpg", // Default nếu null
    name: phim.Ten_phim,
    duration: phim.Thoi_luong,
    release_date: phim.Ngay_khoi_chieu,
    end_date: phim.Ngay_ket_thuc_chieu,
    age_rating: phim.Gioi_han_tuoi,
    trailer: phim.Trailer,
    language: phim.Ngon_ngu,
    status: phim.Trang_thai,
    synopsis: phim.Noi_dung,
  };
}

// Sử dụng trong API route
app.get("/api/movies", async (req, res) => {
  const phimList = await db.query("SELECT * FROM PHIM");
  const movieList = phimList.map(mapPhimToMovie);
  res.json(movieList);
});

app.get("/api/movies/:id", async (req, res) => {
  const phim = await db.query("SELECT * FROM PHIM WHERE Id_phim = ?", [
    req.params.id,
  ]);
  const movie = mapPhimToMovie(phim);
  res.json(movie);
});
```

---

### 3.2. Generic Mapper Pattern (Khuyến nghị)

Để tránh viết mapper thủ công cho từng table, có thể dùng **field mapping config**:

```typescript
// backend/config/fieldMappings.ts

export const FIELD_MAPPINGS = {
  PHIM: {
    Id_phim: "movie_id",
    Hinh_anh: "image",
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
  PHONG: {
    Id_phong: "room_id",
    Id_rap: "cinema_id",
    Ten: "name",
    Trang_thai: "state",
  },
  GHE: {
    Id_phong: "room_id",
    So_hang: "seat_row",
    So_cot: "seat_column",
    Loai_ghe: "seat_type",
    Trang_thai: "state",
  },
  CA_CHIEU: {
    Id_ca_chieu: "showtime_id",
    Id_phong: "room_id",
    Id_phim: "movie_id",
    Ngay_chieu: "start_date",
    Thoi_gian_bat_dau: "start_time",
    Thoi_gian_ket_thuc: "end_time",
  },
  TAI_KHOAN: {
    So_dien_thoai: "phone_number",
    Email: "email",
    Mat_khau: "password",
    Ho_va_ten: "fullname",
    Ngay_sinh: "birth_date",
    Gioi_tinh: "gender",
    Anh_dai_dien: "avatar",
    Diem_tich_luy: "membership_points",
    Ngay_dang_ki: "registration_date",
  },
  NHAN_VIEN: {
    ID_nhan_vien: "staff_id",
    Ten: "name",
    So_dien_thoai: "phone_number",
    ID_quan_ly: "manage_id",
    Id_rap: "cinema_id",
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
  DO_AN: {
    Id_do_an: "food_id",
    Id_hoa_don: "bill_id",
    Ten_do_an: "name",
    Mo_ta: "description",
    Gia_tien: "price",
    Ngay_san_xuat: "production_date",
    Ngay_het_han: "expiration_date",
  },
  SU_KIEN: {
    Id_su_kien: "event_id",
    Ten_su_kien: "name",
    Mo_ta: "description",
    Ngay_bat_dau: "start_date",
    Ngay_ket_thuc: "end_date",
  },
  KHUYEN_MAI: {
    Id_khuyen_mai: "promotional_id",
    Id_su_kien: "event_id",
    Mo_ta: "description",
    Ngay_bat_dau: "start_date",
    Ngay_ket_thuc: "end_date",
    Loai_cap_bac: "level",
  },
  VOUCHER: {
    Ma_code: "code",
    Id_khuyen_mai_giam_gia: "promotional_id",
    Ngay_bat_dau: "start_date",
    Ngay_het_han: "end_date",
    Trang_thai: "state",
    So_dien_thoai: "phone_number",
  },
  GIAM_GIA: {
    Id_khuyen_mai: "promotional_id",
    Phan_tram_giam: "percent_reduce",
    Max_so_tien_giam: "max_price_can_reduce",
  },
  QUA_TANG: {
    Id_khuyen_mai: "promotional_id",
    Ten_qua_tang: "name",
    So_luong: "quantity",
  },
  DANH_GIA: {
    So_dien_thoai: "phone_number",
    Id_phim: "movie_id",
    Ngay_viet: "date_written",
    So_sao: "star_rating",
    Noi_dung_danh_gia: "review_content",
  },
  DAO_DIEN: {
    Id_phim: "movie_id",
    Ten_dao_dien: "name",
  },
  DIEN_VIEN: {
    Id_phim: "movie_id",
    Ten_dien_vien: "name",
  },
  LOAI_THANH_VIEN: {
    Loai_cap_bac: "level",
    Diem_tich_luy_toi_thieu: "minimum_point",
  },
  TAI_KHOAN_THANH_VIEN: {
    So_dien_thoai: "phone_number",
    Loai_cap_bac: "level",
    Ngay_tham_gia: "join_date",
  },
  HOA_DON_KHUYEN_MAI: {
    Id_khuyen_mai: "promotional_bill_id",
    Id_hoa_don: "bill_id",
  },
};

// Generic mapper function
export function mapDbToApi<T extends Record<string, any>>(
  tableName: keyof typeof FIELD_MAPPINGS,
  dbRow: Record<string, any>
): T {
  const mapping = FIELD_MAPPINGS[tableName];
  const result: any = {};

  for (const [dbField, apiField] of Object.entries(mapping)) {
    if (dbField in dbRow) {
      result[apiField] = dbRow[dbField];
    }
  }

  return result as T;
}

// Usage example
const phimRow = await db.query("SELECT * FROM PHIM WHERE Id_phim = ?", [
  "MOV00001",
]);
const movie = mapDbToApi("PHIM", phimRow[0]);
// movie = { movie_id: 'MOV00001', name: 'Avengers', image: '...', ... }
```

---

### 3.3. Reverse Mapping (API → Database)

Khi frontend gửi data lên (VD: Create/Update), cần reverse mapping:

```typescript
export function mapApiToDb<T extends Record<string, any>>(
  tableName: keyof typeof FIELD_MAPPINGS,
  apiData: Record<string, any>
): T {
  const mapping = FIELD_MAPPINGS[tableName];
  const result: any = {};

  // Reverse the mapping
  const reverseMapping = Object.fromEntries(
    Object.entries(mapping).map(([db, api]) => [api, db])
  );

  for (const [apiField, dbField] of Object.entries(reverseMapping)) {
    if (apiField in apiData) {
      result[dbField] = apiData[apiField];
    }
  }

  return result as T;
}

// Example: Create new movie
app.post("/api/movies", async (req, res) => {
  const movieData = req.body; // { name: 'New Movie', duration: 120, ... }
  const phimData = mapApiToDb("PHIM", movieData);
  // phimData = { Ten_phim: 'New Movie', Thoi_luong: 120, ... }

  await db.query("INSERT INTO PHIM SET ?", phimData);
  res.json({ success: true });
});
```

---

## 4. Cách thêm field mới `Hinh_anh`

### 4.1. Bước 1: Alter table

```sql
ALTER TABLE PHIM ADD COLUMN Hinh_anh VARCHAR(500);
```

### 4.2. Bước 2: Update mapping config

Đã có trong `FIELD_MAPPINGS.PHIM`:

```typescript
PHIM: {
  // ... existing fields
  Hinh_anh: 'image',  // ← Thêm dòng này
}
```

### 4.3. Bước 3: Test API response

```bash
GET /api/movies/MOV00001
```

Response sẽ tự động bao gồm field `image`:

```json
{
  "movie_id": "MOV00001",
  "image": "https://cdn.example.com/poster.jpg",  // ← Tự động có
  "name": "Avengers: Endgame",
  "duration": 181,
  ...
}
```

### 4.4. Frontend KHÔNG CẦN THAY ĐỔI

Frontend đã có sẵn field `image` trong `Movie` interface:

```typescript
export interface Movie {
  movie_id: string;
  image: string; // ← Đã có sẵn
  name: string;
  // ...
}
```

✅ **Kết quả**: Frontend tiếp tục hoạt động bình thường!

---

## 5. API Endpoints cần implement

### 5.1. Movies

| Method | Endpoint          | Response Type          | Mapping Required                  |
| ------ | ----------------- | ---------------------- | --------------------------------- |
| GET    | `/api/movies`     | `Movie[]`              | `PHIM` → `Movie`                  |
| GET    | `/api/movies/:id` | `MovieDetail`          | `PHIM` + `DAO_DIEN` + `DIEN_VIEN` |
| POST   | `/api/movies`     | `{ success: boolean }` | Reverse: `Movie` → `PHIM`         |
| PUT    | `/api/movies/:id` | `{ success: boolean }` | Reverse: `Movie` → `PHIM`         |
| DELETE | `/api/movies/:id` | `{ success: boolean }` | -                                 |

### 5.2. Cinemas & Rooms

| Method | Endpoint                 | Response Type | Mapping Required            |
| ------ | ------------------------ | ------------- | --------------------------- |
| GET    | `/api/cinemas`           | `Cinema[]`    | `RAP_CHIEU_PHIM` → `Cinema` |
| GET    | `/api/cinemas/:id/rooms` | `Room[]`      | `PHONG` → `Room`            |

### 5.3. Showtimes

| Method | Endpoint                    | Response Type      | Mapping Required  |
| ------ | --------------------------- | ------------------ | ----------------- |
| GET    | `/api/showtimes?movie_id=X` | `ShowtimeDetail[]` | `CA_CHIEU` + JOIN |
| GET    | `/api/showtimes/:id`        | `ShowtimeDetail`   | `CA_CHIEU` + JOIN |

### 5.4. Seats

| Method | Endpoint                   | Response Type      | Mapping Required          |
| ------ | -------------------------- | ------------------ | ------------------------- |
| GET    | `/api/showtimes/:id/seats` | `SeatLayoutItem[]` | `GHE` + logic `is_booked` |

### 5.5. Authentication

| Method | Endpoint             | Request Type      | Response Type       | Mapping Required                                 |
| ------ | -------------------- | ----------------- | ------------------- | ------------------------------------------------ |
| POST   | `/api/auth/login`    | `LoginRequest`    | `AuthResponse`      | `TAI_KHOAN` or `NHAN_VIEN` → `AuthenticatedUser` |
| POST   | `/api/auth/register` | `RegisterRequest` | `AuthResponse`      | Reverse + Create                                 |
| GET    | `/api/auth/profile`  | -                 | `AuthenticatedUser` | `TAI_KHOAN` or `NHAN_VIEN`                       |

### 5.6. Booking

| Method | Endpoint        | Request Type     | Response Type          | Mapping Required            |
| ------ | --------------- | ---------------- | ---------------------- | --------------------------- |
| POST   | `/api/bookings` | `BookingRequest` | `{ bill_id, tickets }` | Multi-table reverse mapping |

### 5.7. Reviews

| Method | Endpoint                  | Response Type          | Mapping Required           |
| ------ | ------------------------- | ---------------------- | -------------------------- |
| GET    | `/api/movies/:id/reviews` | `MovieReview[]`        | `DANH_GIA` → `MovieReview` |
| POST   | `/api/reviews`            | `{ success: boolean }` | Reverse                    |

### 5.8. Vouchers

| Method | Endpoint                 | Response Type                  | Mapping Required       |
| ------ | ------------------------ | ------------------------------ | ---------------------- |
| GET    | `/api/vouchers?user=X`   | `Voucher[]`                    | `VOUCHER` → `Voucher`  |
| POST   | `/api/vouchers/validate` | `{ valid: boolean, discount }` | `VOUCHER` + `GIAM_GIA` |

---

## 6. Testing Strategy

### 6.1. Unit Tests (Backend)

Test từng mapper function:

```typescript
describe('mapPhimToMovie', () => {
  it('should correctly map all fields', () => {
    const phim: PhimDB = {
      Id_phim: 'MOV00001',
      Ten_phim: 'Test Movie',
      Hinh_anh: 'http://image.jpg',
      Thoi_luong: 120,
      // ...
    };

    const movie = mapPhimToMovie(phim);

    expect(movie.movie_id).toBe('MOV00001');
    expect(movie.name).toBe('Test Movie');
    expect(movie.image).toBe('http://image.jpg');
    expect(movie.duration).toBe(120);
  });

  it('should handle null image with default', () => {
    const phim: PhimDB = { /* ... */, Hinh_anh: null };
    const movie = mapPhimToMovie(phim);
    expect(movie.image).toBe('/default-poster.jpg');
  });
});
```

### 6.2. Integration Tests

Test API endpoints trả về đúng format:

```typescript
describe("GET /api/movies/:id", () => {
  it("should return movie in frontend format", async () => {
    const response = await request(app).get("/api/movies/MOV00001");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      movie_id: expect.any(String),
      image: expect.any(String),
      name: expect.any(String),
      duration: expect.any(Number),
      release_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      // ... validate all required fields
    });

    // Ensure no Vietnamese fields leak to frontend
    expect(response.body.Id_phim).toBeUndefined();
    expect(response.body.Ten_phim).toBeUndefined();
    expect(response.body.Hinh_anh).toBeUndefined();
  });
});
```

### 6.3. Contract Testing

Verify API contract matches frontend types:

```typescript
import { Movie } from "@frontend/services/types";

describe("API Contract", () => {
  it("should match Movie interface", async () => {
    const response = await request(app).get("/api/movies/MOV00001");
    const movie: Movie = response.body; // TypeScript will error if mismatch

    // If this compiles, contract is valid
    expect(movie).toBeDefined();
  });
});
```

---

## 7. Migration Timeline

### Phase 1: Setup (Week 1)

- [ ] Create `FIELD_MAPPINGS` config
- [ ] Implement `mapDbToApi` and `mapApiToDb` generic functions
- [ ] Add `Hinh_anh` column to `PHIM` table
- [ ] Write unit tests for mappers

### Phase 2: API Implementation (Week 2-3)

- [ ] Implement all `/api/movies` endpoints with mapping
- [ ] Implement `/api/cinemas` and `/api/showtimes`
- [ ] Implement `/api/auth` endpoints
- [ ] Write integration tests

### Phase 3: Advanced Features (Week 4)

- [ ] Implement booking flow endpoints
- [ ] Implement voucher/promotion endpoints
- [ ] Implement review endpoints
- [ ] Full E2E testing

### Phase 4: Deployment (Week 5)

- [ ] Deploy backend API
- [ ] Update frontend API base URL (no code changes needed)
- [ ] Monitor for any mapping errors
- [ ] Performance optimization

---

## 8. Troubleshooting

### Issue 1: Field bị null trong response

**Nguyên nhân**: Database field là `NULL` nhưng frontend expect giá trị.

**Giải pháp**: Thêm default value trong mapper:

```typescript
export function mapPhimToMovie(phim: PhimDB): MovieAPI {
  return {
    // ...
    image: phim.Hinh_anh || "/default-poster.jpg",
    synopsis: phim.Noi_dung || "",
    trailer: phim.Trailer || null,
  };
}
```

---

### Issue 2: Date format không khớp

**Nguyên nhân**: MySQL trả về format khác với frontend expect.

**Giải pháp**: Format date trong mapper:

```typescript
import { format } from "date-fns";

export function formatMySQLDate(mysqlDate: Date | string): string {
  return format(new Date(mysqlDate), "yyyy-MM-dd");
}

export function formatMySQLDateTime(mysqlDateTime: Date | string): string {
  return new Date(mysqlDateTime).toISOString();
}
```

---

### Issue 3: Composite key mapping phức tạp

**Nguyên nhân**: Seat có composite PK (`Id_phong`, `So_hang`, `So_cot`).

**Giải pháp**: Map từng field riêng biệt:

```typescript
export function mapGheToSeat(ghe: GheDB): Seat {
  return {
    room_id: ghe.Id_phong,
    seat_row: ghe.So_hang,
    seat_column: ghe.So_cot,
    seat_type: ghe.Loai_ghe,
    state: ghe.Trang_thai,
  };
}
```

---

## 9. Best Practices

### ✅ DO

1. **Luôn sử dụng mapper functions** - Không bao giờ trả raw database object
2. **Validate input** - Kiểm tra data từ frontend trước khi reverse map
3. **Handle NULL values** - Cung cấp default values hợp lý
4. **Centralize mapping config** - Dùng `FIELD_MAPPINGS` thay vì hardcode
5. **Write tests** - Test coverage > 90% cho mappers
6. **Document new fields** - Update docs khi thêm field mới

### ❌ DON'T

1. **Không expose database structure** - Frontend không được nhìn thấy `Id_phim`, `Ten_phim`
2. **Không return password field** - Luôn exclude `Mat_khau` khi trả về
3. **Không hardcode mappings** - Dùng config centralized
4. **Không skip validation** - Validate cả input và output
5. **Không ignore errors** - Log và handle mapping errors properly

---

## 10. Checklist cho Backend Team

### Database

- [ ] Thêm column `Hinh_anh VARCHAR(500)` vào table `PHIM`
- [ ] Update existing records với placeholder image URL
- [ ] Test triggers vẫn hoạt động sau khi alter table

### Code

- [ ] Tạo file `backend/config/fieldMappings.ts` với full mapping config
- [ ] Implement `mapDbToApi` generic function
- [ ] Implement `mapApiToDb` generic function
- [ ] Tạo specific mapper cho từng entity (optional, nếu cần custom logic)
- [ ] Implement tất cả API endpoints theo section 5
- [ ] Add input validation middleware
- [ ] Add error handling middleware

### Testing

- [ ] Unit tests cho tất cả mapper functions (>90% coverage)
- [ ] Integration tests cho tất cả API endpoints
- [ ] Contract tests verify response match frontend types
- [ ] Manual testing với Postman/Thunder Client

### Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Update README với API base URL
- [ ] Deployment guide
- [ ] Error code reference

### Deployment

- [ ] Deploy to staging environment
- [ ] Frontend team test trên staging
- [ ] Fix any issues discovered
- [ ] Deploy to production
- [ ] Monitor logs for mapping errors

---

## 11. Contact & Support

Nếu có vấn đề trong quá trình implement, liên hệ:

- **Frontend Lead**: [Email/Slack]
- **Backend Lead**: [Email/Slack]
- **Database Admin**: [Email/Slack]

> [!TIP]
> Tham khảo file `services/types.ts` từ frontend để biết chính xác structure của từng interface.

---

## Appendix A: Full TypeScript Types Reference

Frontend types đã có sẵn tại [services/types.ts](file:///c:/Users/Khoa/Desktop/DB_btl2/services/types.ts).

Tất cả API responses PHẢI match với các interface trong file này.

---

## Appendix B: Database Schema Reference

Database schema được định nghĩa tại [sql/create-movie_ticket_booking_system.sql](file:///c:/Users/Khoa/Desktop/DB_btl2/sql/create-movie_ticket_booking_system.sql).

---

**Tài liệu này được tạo**: 2025-11-28  
**Version**: 1.0  
**Last updated**: 2025-11-28
