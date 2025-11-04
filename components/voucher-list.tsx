"use client"

import { type Khuyen_mai, mockKhuyen_mai } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function VoucherList() {
  const activeVouchers = mockKhuyen_mai.filter((v) => v.Trang_thai === "Hoat_dong")

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const formatDiscountValue = (voucher: Khuyen_mai) => {
    if (voucher.Loai_giam_gia === "Phan_tram") {
      return `${voucher.Gia_tri_giam}%`
    }
    return `₫${voucher.Gia_tri_giam.toLocaleString("vi-VN")}`
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Khuyến mại khả dụng</h3>
      <div className="grid gap-3">
        {activeVouchers.map((voucher) => {
          const daysLeft = getDaysUntilExpiry(voucher.Ngay_ket_thuc)
          const isExpiringSoon = daysLeft <= 3

          return (
            <div
              key={voucher.Id_khuyen_mai}
              className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg">{formatDiscountValue(voucher)}</span>
                    <Badge variant="secondary">{voucher.Ma_khuyen_mai}</Badge>
                    {isExpiringSoon && (
                      <Badge variant="destructive" className="text-xs">
                        Sắp hết hạn
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{voucher.Ten_khuyen_mai}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      {voucher.Pham_vi === "Ca_rut_phim"
                        ? "Tất cả phim"
                        : voucher.Pham_vi === "Rut_phim_chi_dinh"
                          ? "Phim chỉ định"
                          : "Đồ ăn"}
                    </Badge>
                    {voucher.Khu_vuc.length < 3 && (
                      <Badge variant="outline" className="text-xs">
                        {voucher.Khu_vuc.join(", ")}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      Còn {voucher.So_luong_con}
                    </Badge>
                    {daysLeft > 0 && (
                      <Badge variant="outline" className={`text-xs ${isExpiringSoon ? "text-red-600" : ""}`}>
                        {daysLeft} ngày nữa
                      </Badge>
                    )}
                  </div>
                </div>
                <Link href={`/dat-ve/sc_001?voucher=${voucher.Ma_khuyen_mai}`}>
                  <Button size="sm">Dùng ngay</Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
