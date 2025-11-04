// Data types for cinema booking app
export interface Phim {
  Id_phim: number
  Ten_phim: string
  Noi_dung: string
  Thoi_luong: number // in minutes
  Trailer: string // YouTube URL
  Ngay_khoi_chieu: string // YYYY-MM-DD
  Trang_thai: "Đang chiếu" | "Sắp chiếu"
  Ten_dao_dien: string[]
  Ten_dien_vien: string[]
  Poster: string
}

export interface Rap {
  Id_rap: number
  Ten_rap: string
  Dia_chi: string
  Phong: Phong[]
}

export interface Phong {
  Id_phong: number
  Ten_phong: string
}

export interface CaChieu {
  Id_ca_chieu: number
  Id_phim: number
  Id_phong: number
  Ngay_chieu: string // YYYY-MM-DD
  Thoi_gian_bat_dau: string // HH:mm
  Gia_tien: number
}

export interface Ghe {
  Id_phong: number
  So_hang: string
  So_cot: number
  Loai_ghe: "Thường" | "VIP"
  Trang_thai: "Trống" | "Đã đặt"
}

export interface DoAn {
  Id_do_an: number
  Ten_do_an: string
  Mo_ta: string
  Gia_tien: number
  Hinh_anh: string
}

export interface BookingState {
  phim: Phim | null
  caChieu: CaChieu | null
  phong: Phong | null
  gheDaChon: Array<{ So_hang: string; So_cot: number }>
  doAnDaChon: Array<{ id: number; tenDoAn: string; soLuong: number; gia: number }>
  tongTien: number
}
