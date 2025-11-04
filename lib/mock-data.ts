// Movie types and mock data for the cinema ticket booking system

export interface Phim {
  Id_phim: string
  Ten_phim: string
  Mota: string
  Hinh_anh: string
  Trang_thai: "Đang chiếu" | "Sắp chiếu"
  Nha_san_xuat: string
  Dao_dien: string
  Dien_vien: string[]
  The_loai: string[]
  Thoi_luong: number // minutes
  Nam_phat_hanh: number
  Diem_danh_gia: number // 0-10
  Trailer_url: string
}

export interface Suat_chieu {
  Id_suat_chieu: string
  Id_phim: string
  Id_rap: string
  Thoi_gian_bat_dau: string // ISO datetime
  Thoi_gian_ket_thuc: string // ISO datetime
  Phong_chieu: string
  Gia_ve: number
  Trang_thai: "Sap_chieu" | "Co_ve" | "Het_ve" | "Dang_chieu" | "Ket_thuc"
}

export interface Ghe {
  Id_ghe: string
  Ten_ghe: string // A1, A2, B1, etc.
  Hang: string // A, B, C, D, etc.
  Cot: number // 1, 2, 3, etc.
  Loai_ghe: "Thuong" | "VIP" | "Couple" | "Khuyat_tac"
}

export interface Dat_ghe {
  Id_dat_ghe: string
  Id_suat_chieu: string
  Id_ghe: string
  Trang_thai: "Trong" | "Da_dat" | "Da_ban"
}

export interface Do_an {
  Id_do_an: string
  Ten_do_an: string
  Danh_muc: "Bap" | "Nuoc" | "Dac_biet"
  Gia: number
  Hinh_anh: string
}

export interface Hoa_don {
  Id_hoa_don: string
  Id_dat_ve: string
  Ngay_tao: string // ISO date
  Tong_tien: number
  Trang_thai: "Chua_thanh_toan" | "Da_thanh_toan" | "Huy"
  Phuong_thuc_thanh_toan: "The_ttin" | "Tien_mat" | "Vi_dien_tu"
}

export interface Rap_phim {
  Id_rap: string
  Ten_rap: string
  Dia_chi: string
  Thanh_pho: string
  So_phong_chieu: number
}

export const mockPhim: Phim[] = [
  {
    Id_phim: "phim_001",
    Ten_phim: "Avengers: Endgame",
    Mota: "Các siêu anh hùng Avengers phải đối mặt với Thanos trong trận chiến cuối cùng để cứu thế giới.",
    Hinh_anh: "/avengers-endgame-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Marvel Studios",
    Dao_dien: "Anthony Russo, Joe Russo",
    Dien_vien: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    The_loai: ["Hành động", "Viễn tưởng", "Phiêu lưu"],
    Thoi_luong: 181,
    Nam_phat_hanh: 2019,
    Diem_danh_gia: 8.4,
    Trailer_url: "https://www.youtube.com/embed/TcMBFSGVi1c",
  },
  {
    Id_phim: "phim_002",
    Ten_phim: "The Shawshank Redemption",
    Mota: "Một người tù bị kết án chung thân lên kế hoạch trốn thoát trong khi giúp đỡ những tù nhân khác.",
    Hinh_anh: "/shawshank-redemption-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Castle Rock Entertainment",
    Dao_dien: "Frank Darabont",
    Dien_vien: ["Tim Robbins", "Morgan Freeman"],
    The_loai: ["Drama", "Tội phạm"],
    Thoi_luong: 142,
    Nam_phat_hanh: 1994,
    Diem_danh_gia: 9.3,
    Trailer_url: "https://www.youtube.com/embed/NmzuHjWmXOc",
  },
  {
    Id_phim: "phim_003",
    Ten_phim: "Inception",
    Mota: "Một tên trộm chuyên biệt trong ăn cắp từ các giấc mơ phải thực hiện nhiệm vụ đặc biệt: nhồi nộ ý tưởng.",
    Hinh_anh: "/inception-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Warner Bros.",
    Dao_dien: "Christopher Nolan",
    Dien_vien: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page"],
    The_loai: ["Viễn tưởng", "Tâm lý", "Hành động"],
    Thoi_luong: 148,
    Nam_phat_hanh: 2010,
    Diem_danh_gia: 8.8,
    Trailer_url: "https://www.youtube.com/embed/YoHD_XwIlf8",
  },
  {
    Id_phim: "phim_004",
    Ten_phim: "The Dark Knight",
    Mota: "Batman phải chống lại Joker, một tên tội phạm có khả năng tạo ra hỗn loạn trong Gotham.",
    Hinh_anh: "/dark-knight-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Legendary Pictures",
    Dao_dien: "Christopher Nolan",
    Dien_vien: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    The_loai: ["Hành động", "Tội phạm", "Drama"],
    Thoi_luong: 152,
    Nam_phat_hanh: 2008,
    Diem_danh_gia: 9.0,
    Trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
  },
  {
    Id_phim: "phim_005",
    Ten_phim: "Interstellar",
    Mota: "Một nhóm nhà du hành vũ trụ phải vượt qua lỗ sâu không gian để cứu nhân loại.",
    Hinh_anh: "/interstellar-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Paramount Pictures",
    Dao_dien: "Christopher Nolan",
    Dien_vien: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    The_loai: ["Viễn tưởng", "Drama", "Phiêu lưu"],
    Thoi_luong: 169,
    Nam_phat_hanh: 2014,
    Diem_danh_gia: 8.6,
    Trailer_url: "https://www.youtube.com/embed/zSID6PrCR74",
  },
  {
    Id_phim: "phim_006",
    Ten_phim: "Forrest Gump",
    Mota: "Cuộc sống của Forrest Gump, một người bình thường nhưng lại tham gia vào những sự kiện lịch sử quan trọng.",
    Hinh_anh: "/forrest-gump-movie-poster.jpg",
    Trang_thai: "Đang chiếu",
    Nha_san_xuat: "Paramount Pictures",
    Dao_dien: "Robert Zemeckis",
    Dien_vien: ["Tom Hanks", "Sally Field", "Gary Sinise"],
    The_loai: ["Drama", "Lãng mạn"],
    Thoi_luong: 142,
    Nam_phat_hanh: 1994,
    Diem_danh_gia: 8.8,
    Trailer_url: "https://www.youtube.com/embed/bLvqoByHw20",
  },
  {
    Id_phim: "phim_007",
    Ten_phim: "Dune",
    Mota: "Một người trẻ phải đối mặt với vận mệnh của mình khi phải bảo vệ một hành tinh sa mạc giàu tài nguyên.",
    Hinh_anh: "/dune-part-one-movie-poster.jpg",
    Trang_thai: "Sắp chiếu",
    Nha_san_xuat: "Warner Bros.",
    Dao_dien: "Denis Villeneuve",
    Dien_vien: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    The_loai: ["Viễn tưởng", "Phiêu lưu"],
    Thoi_luong: 156,
    Nam_phat_hanh: 2021,
    Diem_danh_gia: 8.0,
    Trailer_url: "https://www.youtube.com/embed/n9xhJsAgZmE",
  },
  {
    Id_phim: "phim_008",
    Ten_phim: "Avatar: The Way of Water",
    Mota: "Jake Sully phải bảo vệ gia đình của mình khỏi những kẻ thù trong một thế giới hoàn toàn khác.",
    Hinh_anh: "/avatar-way-of-water-movie-poster.jpg",
    Trang_thai: "Sắp chiếu",
    Nha_san_xuat: "20th Century Studios",
    Dao_dien: "James Cameron",
    Dien_vien: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    The_loai: ["Viễn tưởng", "Phiêu lưu"],
    Thoi_luong: 192,
    Nam_phat_hanh: 2022,
    Diem_danh_gia: 7.6,
    Trailer_url: "https://www.youtube.com/embed/d9MyW72EhRE",
  },
  {
    Id_phim: "phim_009",
    Ten_phim: "Oppenheimer",
    Mota: "Câu chuyện về J. Robert Oppenheimer và sự phát triển của bom nguyên tử trong Thế chiến II.",
    Hinh_anh: "/oppenheimer-movie-poster.jpg",
    Trang_thai: "Sắp chiếu",
    Nha_san_xuat: "Universal Pictures",
    Dao_dien: "Christopher Nolan",
    Dien_vien: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    The_loai: ["Drama", "Lịch sử"],
    Thoi_luong: 180,
    Nam_phat_hanh: 2023,
    Diem_danh_gia: 8.1,
    Trailer_url: "https://www.youtube.com/embed/bK6DsqIvgIU",
  },
  {
    Id_phim: "phim_010",
    Ten_phim: "Pulp Fiction",
    Mota: "Một bộ phim gồm nhiều câu chuyện liên kết với nhau về các nhân vật trong thế giới Mafia.",
    Hinh_anh: "/pulp-fiction-movie-poster.jpg",
    Trang_thai: "Sắp chiếu",
    Nha_san_xuat: "Miramax",
    Dao_dien: "Quentin Tarantino",
    Dien_vien: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    The_loai: ["Tội phạm", "Drama"],
    Thoi_luong: 154,
    Nam_phat_hanh: 1994,
    Diem_danh_gia: 8.9,
    Trailer_url: "https://www.youtube.com/embed/s7EdQ4FqSTM",
  },
]

export const mockSuat_chieu: Suat_chieu[] = [
  {
    Id_suat_chieu: "sc_001",
    Id_phim: "phim_001",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T09:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T10:54:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 80000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_002",
    Id_phim: "phim_001",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T13:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T14:54:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 80000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_003",
    Id_phim: "phim_001",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T16:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T17:54:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 100000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_004",
    Id_phim: "phim_001",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T19:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T20:54:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 120000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_005",
    Id_phim: "phim_002",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T09:30:00",
    Thoi_gian_ket_thuc: "2025-11-01T11:00:00",
    Phong_chieu: "Phòng 2",
    Gia_ve: 80000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_006",
    Id_phim: "phim_002",
    Id_rap: "rap_001",
    Thoi_gian_bat_dau: "2025-11-01T14:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T15:30:00",
    Phong_chieu: "Phòng 2",
    Gia_ve: 80000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_007",
    Id_phim: "phim_003",
    Id_rap: "rap_002",
    Thoi_gian_bat_dau: "2025-11-01T10:00:00",
    Thoi_gian_ket_thuc: "2025-11-01T11:48:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 90000,
    Trang_thai: "Co_ve",
  },
  {
    Id_suat_chieu: "sc_008",
    Id_phim: "phim_003",
    Id_rap: "rap_002",
    Thoi_gian_bat_dau: "2025-11-01T15:30:00",
    Thoi_gian_ket_thuc: "2025-11-01T17:18:00",
    Phong_chieu: "Phòng 1",
    Gia_ve: 100000,
    Trang_thai: "Co_ve",
  },
]

export const mockGhe: Ghe[] = [
  // Row A
  ...Array.from({ length: 10 }, (_, i) => ({
    Id_ghe: `ghe_A${i + 1}`,
    Ten_ghe: `A${i + 1}`,
    Hang: "A",
    Cot: i + 1,
    Loai_ghe: "Thuong" as const,
  })),
  // Row B (with couple seats)
  ...Array.from({ length: 10 }, (_, i) => ({
    Id_ghe: `ghe_B${i + 1}`,
    Ten_ghe: `B${i + 1}`,
    Hang: "B",
    Cot: i + 1,
    Loai_ghe: i >= 4 && i <= 5 ? ("Couple" as const) : ("Thuong" as const),
  })),
  // Row C (VIP)
  ...Array.from({ length: 10 }, (_, i) => ({
    Id_ghe: `ghe_C${i + 1}`,
    Ten_ghe: `C${i + 1}`,
    Hang: "C",
    Cot: i + 1,
    Loai_ghe: "VIP" as const,
  })),
  // Row D (VIP)
  ...Array.from({ length: 10 }, (_, i) => ({
    Id_ghe: `ghe_D${i + 1}`,
    Ten_ghe: `D${i + 1}`,
    Hang: "D",
    Cot: i + 1,
    Loai_ghe: "VIP" as const,
  })),
  // Row E (Accessible)
  ...Array.from({ length: 10 }, (_, i) => ({
    Id_ghe: `ghe_E${i + 1}`,
    Ten_ghe: `E${i + 1}`,
    Hang: "E",
    Cot: i + 1,
    Loai_ghe: i <= 1 ? ("Khuyat_tac" as const) : ("Thuong" as const),
  })),
]

export const mockDo_an: Do_an[] = [
  {
    Id_do_an: "doan_001",
    Ten_do_an: "Bắp mặn vừa",
    Danh_muc: "Bap",
    Gia: 45000,
    Hinh_anh: "/popcorn-salty.jpg",
  },
  {
    Id_do_an: "doan_002",
    Ten_do_an: "Bắp mặn lớn",
    Danh_muc: "Bap",
    Gia: 65000,
    Hinh_anh: "/popcorn-large-salty.jpg",
  },
  {
    Id_do_an: "doan_003",
    Ten_do_an: "Bắp bơ vừa",
    Danh_muc: "Bap",
    Gia: 50000,
    Hinh_anh: "/popcorn-butter.jpg",
  },
  {
    Id_do_an: "doan_004",
    Ten_do_an: "Bắp bơ lớn",
    Danh_muc: "Bap",
    Gia: 70000,
    Hinh_anh: "/popcorn-large-butter.jpg",
  },
  {
    Id_do_an: "doan_005",
    Ten_do_an: "Nước cam vừa",
    Danh_muc: "Nuoc",
    Gia: 35000,
    Hinh_anh: "/vibrant-orange-juice.png",
  },
  {
    Id_do_an: "doan_006",
    Ten_do_an: "Nước cam lớn",
    Danh_muc: "Nuoc",
    Gia: 45000,
    Hinh_anh: "/orange-juice-large.jpg",
  },
  {
    Id_do_an: "doan_007",
    Ten_do_an: "Coca-Cola vừa",
    Danh_muc: "Nuoc",
    Gia: 30000,
    Hinh_anh: "/classic-coca-cola.png",
  },
  {
    Id_do_an: "doan_008",
    Ten_do_an: "Coca-Cola lớn",
    Danh_muc: "Nuoc",
    Gia: 40000,
    Hinh_anh: "/coca-cola-large.jpg",
  },
  {
    Id_do_an: "doan_009",
    Ten_do_an: "Combo tiết kiệm",
    Danh_muc: "Dac_biet",
    Gia: 120000,
    Hinh_anh: "/combo-popcorn-drink.jpg",
  },
  {
    Id_do_an: "doan_010",
    Ten_do_an: "Combo VIP",
    Danh_muc: "Dac_biet",
    Gia: 180000,
    Hinh_anh: "/vip-combo.jpg",
  },
]

export const mockRap_phim: Rap_phim[] = [
  {
    Id_rap: "rap_001",
    Ten_rap: "CinemaHub - Tân Bình",
    Dia_chi: "123 Nguyễn Hữu Cảnh, Quận Tân Bình",
    Thanh_pho: "TP. Hồ Chí Minh",
    So_phong_chieu: 4,
  },
  {
    Id_rap: "rap_002",
    Ten_rap: "CinemaHub - Bình Thạnh",
    Dia_chi: "456 Nguyễn Văn Trỗi, Quận Bình Thạnh",
    Thanh_pho: "TP. Hồ Chí Minh",
    So_phong_chieu: 3,
  },
  {
    Id_rap: "rap_003",
    Ten_rap: "CinemaHub - Quận 1",
    Dia_chi: "789 Lê Lợi, Quận 1",
    Thanh_pho: "TP. Hồ Chí Minh",
    So_phong_chieu: 5,
  },
  {
    Id_rap: "rap_004",
    Ten_rap: "CinemaHub - Hà Nội",
    Dia_chi: "321 Tô Vĩ Tử, Quận Đống Đa",
    Thanh_pho: "Hà Nội",
    So_phong_chieu: 3,
  },
]

export interface Nguoi_dung {
  Id_nguoi_dung: string
  Email: string
  Mat_khau_hash: string
  Ho_ten: string
  So_dien_thoai: string
  Avatar: string
  Ngay_sinh: string // ISO date
  Ngay_tao: string // ISO date
}

export interface Dat_ve {
  Id_dat_ve: string
  Id_nguoi_dung: string | null // null for guest bookings
  Id_suat_chieu: string
  Danh_sach_ghe: string[] // Array of Id_ghe
  Danh_sach_do_an: Array<{ Id_do_an: string; So_luong: number }>
  Tong_tien: number
  Trang_thai: "Cho_xac_nhan" | "Da_xac_nhan" | "Da_huy"
  Phuong_thuc_thanh_toan: "The_tin_dung" | "Tien_mat" | "Vi_dien_tu"
  Ngay_dat: string // ISO datetime
  Ma_ve: string
}

export const mockNguoi_dung: Nguoi_dung[] = [
  {
    Id_nguoi_dung: "user_001",
    Email: "john.doe@gmail.com",
    Mat_khau_hash: "hashed_password_123", // In real app, use proper hashing
    Ho_ten: "John Doe",
    So_dien_thoai: "0912345678",
    Avatar: "https://avatar.vercel.sh/john",
    Ngay_sinh: "1990-05-15",
    Ngay_tao: "2025-10-01T10:00:00",
  },
  {
    Id_nguoi_dung: "user_002",
    Email: "jane.smith@gmail.com",
    Mat_khau_hash: "hashed_password_456",
    Ho_ten: "Jane Smith",
    So_dien_thoai: "0987654321",
    Avatar: "https://avatar.vercel.sh/jane",
    Ngay_sinh: "1992-08-22",
    Ngay_tao: "2025-09-15T14:30:00",
  },
]

export const mockDat_ve: Dat_ve[] = [
  {
    Id_dat_ve: "booking_001",
    Id_nguoi_dung: "user_001",
    Id_suat_chieu: "sc_001",
    Danh_sach_ghe: ["ghe_A1", "ghe_A2"],
    Danh_sach_do_an: [
      { Id_do_an: "doan_001", So_luong: 1 },
      { Id_do_an: "doan_007", So_luong: 2 },
    ],
    Tong_tien: 185000,
    Trang_thai: "Da_xac_nhan",
    Phuong_thuc_thanh_toan: "The_tin_dung",
    Ngay_dat: "2025-10-25T15:30:00",
    Ma_ve: "CV-20251025-001",
  },
  {
    Id_dat_ve: "booking_002",
    Id_nguoi_dung: "user_001",
    Id_suat_chieu: "sc_003",
    Danh_sach_ghe: ["ghe_C5", "ghe_C6"],
    Danh_sach_do_an: [
      { Id_do_an: "doan_003", So_luong: 1 },
      { Id_do_an: "doan_006", So_luong: 1 },
    ],
    Tong_tien: 245000,
    Trang_thai: "Da_xac_nhan",
    Phuong_thuc_thanh_toan: "Vi_dien_tu",
    Ngay_dat: "2025-10-20T10:15:00",
    Ma_ve: "CV-20251020-002",
  },
  {
    Id_dat_ve: "booking_003",
    Id_nguoi_dung: "user_002",
    Id_suat_chieu: "sc_002",
    Danh_sach_ghe: ["ghe_B5", "ghe_B6"],
    Danh_sach_do_an: [{ Id_do_an: "doan_009", So_luong: 1 }],
    Tong_tien: 280000,
    Trang_thai: "Da_xac_nhan",
    Phuong_thuc_thanh_toan: "The_tin_dung",
    Ngay_dat: "2025-10-18T16:45:00",
    Ma_ve: "CV-20251018-003",
  },
  {
    Id_dat_ve: "booking_004",
    Id_nguoi_dung: "user_001",
    Id_suat_chieu: "sc_005",
    Danh_sach_ghe: ["ghe_A3"],
    Danh_sach_do_an: [],
    Tong_tien: 80000,
    Trang_thai: "Cho_xac_nhan",
    Phuong_thuc_thanh_toan: "Tien_mat",
    Ngay_dat: "2025-10-31T11:00:00",
    Ma_ve: "CV-20251031-004",
  },
]

export interface Danh_gia {
  Id_danh_gia: string
  Id_phim: string
  Id_nguoi_dung: string
  Diem: number // 1-10
  Tieu_de: string
  Noi_dung: string
  Tags: string[]
  So_tim_thich: number
  Ngay_tao: string // ISO datetime
}

export interface Khuyen_mai {
  Id_khuyen_mai: string
  Ma_khuyen_mai: string
  Ten_khuyen_mai: string
  Loai_giam_gia: "Phan_tram" | "Tien_tuyet_doi"
  Gia_tri_giam: number // percentage or fixed amount
  Gia_tri_toi_da: number // max discount
  Tien_toi_thieu: number // min purchase required
  Khu_vuc: string[] // regions where applicable
  Pham_vi: "Ca_rut_phim" | "Rut_phim_chi_dinh" | "Do_an"
  Ngay_bat_dau: string // ISO date
  Ngay_ket_thuc: string // ISO date
  So_luong_con: number
  Trang_thai: "Hoat_dong" | "Het_han" | "Het_so_luong"
}

export const mockDanh_gia: Danh_gia[] = [
  {
    Id_danh_gia: "review_001",
    Id_phim: "phim_001",
    Id_nguoi_dung: "user_001",
    Diem: 9,
    Tieu_de: "Tuyệt vời! Đáng xem",
    Noi_dung:
      "Avengers Endgame là bộ phim hoành tráng với cách kết thúc hoàn hảo cho saga Infinity Stones. Diễn xuất tuyệt vời, cốt truyện hấp dẫn.",
    Tags: ["Tuyệt vời", "Hành động", "Cảm động"],
    So_tim_thich: 245,
    Ngay_tao: "2025-10-20T10:30:00",
  },
  {
    Id_danh_gia: "review_002",
    Id_phim: "phim_001",
    Id_nguoi_dung: "user_002",
    Diem: 8,
    Tieu_de: "Rất hay nhưng hơi dài",
    Noi_dung: "Phim rất tốt nhưng độ dài 3 giờ khiến tôi hơi mệt. Tuy nhiên mọi cảnh quay đều đáng xem.",
    Tags: ["Hay", "Hành động"],
    So_tim_thich: 156,
    Ngay_tao: "2025-10-18T15:45:00",
  },
  {
    Id_danh_gia: "review_003",
    Id_phim: "phim_002",
    Id_nguoi_dung: "user_001",
    Diem: 10,
    Tieu_de: "Kiệt tác điện ảnh",
    Noi_dung:
      "Shawshank Redemption là một trong những bộ phim hay nhất mọi thời đại. Diễn xuất của Tim Robbins và Morgan Freeman đều xuất sắc.",
    Tags: ["Kiệt tác", "Drama", "Cảm động"],
    So_tim_thich: 512,
    Ngay_tao: "2025-10-15T08:00:00",
  },
  {
    Id_danh_gia: "review_004",
    Id_phim: "phim_002",
    Id_nguoi_dung: "user_002",
    Diem: 9,
    Tieu_de: "Chắc chắn xem lại",
    Noi_dung: "Câu chuyện về hy vọng và tự do rất ý nghĩa. Tôi sẽ xem lại bộ phim này nhiều lần.",
    Tags: ["Drama", "Hy vọng"],
    So_tim_thich: 389,
    Ngay_tao: "2025-10-10T14:20:00",
  },
  {
    Id_danh_gia: "review_005",
    Id_phim: "phim_003",
    Id_nguoi_dung: "user_001",
    Diem: 8,
    Tieu_de: "Hoa mắt sau khi xem",
    Noi_dung: "Inception là bộ phim đòi hỏi sự tập trung cao. Cốt truyện phức tạp nhưng logic. Xứng đáng xem lại.",
    Tags: ["Viễn tưởng", "Khó hiểu"],
    So_tim_thich: 234,
    Ngay_tao: "2025-10-08T19:00:00",
  },
]

export const mockKhuyen_mai: Khuyen_mai[] = [
  {
    Id_khuyen_mai: "voucher_001",
    Ma_khuyen_mai: "SUMMER20",
    Ten_khuyen_mai: "Giảm 20% giá vé",
    Loai_giam_gia: "Phan_tram",
    Gia_tri_giam: 20,
    Gia_tri_toi_da: 100000,
    Tien_toi_thieu: 100000,
    Khu_vuc: ["TP. Hồ Chí Minh", "Hà Nội"],
    Pham_vi: "Ca_rut_phim",
    Ngay_bat_dau: "2025-10-15",
    Ngay_ket_thuc: "2025-11-15",
    So_luong_con: 250,
    Trang_thai: "Hoat_dong",
  },
  {
    Id_khuyen_mai: "voucher_002",
    Ma_khuyen_mai: "POPCORN50K",
    Ten_khuyen_mai: "Giảm 50K khi mua bắp",
    Loai_giam_gia: "Tien_tuyet_doi",
    Gia_tri_giam: 50000,
    Gia_tri_toi_da: 50000,
    Tien_toi_thieu: 100000,
    Khu_vuc: ["TP. Hồ Chí Minh"],
    Pham_vi: "Do_an",
    Ngay_bat_dau: "2025-10-20",
    Ngay_ket_thuc: "2025-11-05",
    So_luong_con: 100,
    Trang_thai: "Hoat_dong",
  },
  {
    Id_khuyen_mai: "voucher_003",
    Ma_khuyen_mai: "VIPWEEKEND15",
    Ten_khuyen_mai: "Giảm 15% vé VIP cuối tuần",
    Loai_giam_gia: "Phan_tram",
    Gia_tri_giam: 15,
    Gia_tri_toi_da: 75000,
    Tien_toi_thieu: 200000,
    Khu_vuc: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"],
    Pham_vi: "Rut_phim_chi_dinh",
    Ngay_bat_dau: "2025-10-25",
    Ngay_ket_thuc: "2025-11-30",
    So_luong_con: 50,
    Trang_thai: "Hoat_dong",
  },
  {
    Id_khuyen_mai: "voucher_004",
    Ma_khuyen_mai: "AUTUMN100",
    Ten_khuyen_mai: "Giảm 100K cho đơn trên 300K",
    Loai_giam_gia: "Tien_tuyet_doi",
    Gia_tri_giam: 100000,
    Gia_tri_toi_da: 100000,
    Tien_toi_thieu: 300000,
    Khu_vuc: ["TP. Hồ Chí Minh", "Hà Nội"],
    Pham_vi: "Ca_rut_phim",
    Ngay_bat_dau: "2025-11-01",
    Ngay_ket_thuc: "2025-11-10",
    So_luong_con: 15,
    Trang_thai: "Hoat_dong",
  },
  {
    Id_khuyen_mai: "voucher_005",
    Ma_khuyen_mai: "COUPLE30",
    Ten_khuyen_mai: "Giảm 30% ghế Couple",
    Loai_giam_gia: "Phan_tram",
    Gia_tri_giam: 30,
    Gia_tri_toi_da: 60000,
    Tien_toi_thieu: 160000,
    Khu_vuc: ["TP. Hồ Chí Minh"],
    Pham_vi: "Rut_phim_chi_dinh",
    Ngay_bat_dau: "2025-10-25",
    Ngay_ket_thuc: "2025-11-25",
    So_luong_con: 5,
    Trang_thai: "Hoat_dong",
  },
]
