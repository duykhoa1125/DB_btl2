"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { mockDat_ve, mockSuat_chieu, mockPhim, mockRap_phim } from "@/lib/mock-data"

export default function OrderHistoryPage() {
  const { currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("tat-ca")

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/tai-khoan/dang-nhap")
    }
  }, [currentUser, authLoading, router])

  if (authLoading || !currentUser) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p>Đang tải...</p>
        </div>
      </>
    )
  }

  const userOrders = mockDat_ve.filter((order) => order.Id_nguoi_dung === currentUser.Id_nguoi_dung)

  const filteredOrders = userOrders.filter((order) => {
    if (activeFilter === "tat-ca") return true
    return order.Trang_thai === activeFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Da_xac_nhan":
        return <Badge className="bg-green-600">Đã xác nhận</Badge>
      case "Cho_xac_nhan":
        return <Badge className="bg-yellow-600">Chờ xác nhận</Badge>
      case "Da_huy":
        return <Badge className="bg-red-600">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getShowtimeInfo = (suatChieuId: string) => {
    const suat = mockSuat_chieu.find((s) => s.Id_suat_chieu === suatChieuId)
    if (!suat) return null

    const phim = mockPhim.find((p) => p.Id_phim === suat.Id_phim)
    const rap = mockRap_phim.find((r) => r.Id_rap === suat.Id_rap)

    return { suat, phim, rap }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-12 bg-background">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/tai-khoan/ho-so" className="text-sm text-red-600 hover:underline">
              ← Quay lại hồ sơ
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
            <p className="text-muted-foreground">Quản lý và xem chi tiết các đơn đặt vé của bạn</p>
          </div>

          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="tat-ca">Tất cả ({userOrders.length})</TabsTrigger>
              <TabsTrigger value="Da_xac_nhan">
                Đã xác nhận ({userOrders.filter((o) => o.Trang_thai === "Da_xac_nhan").length})
              </TabsTrigger>
              <TabsTrigger value="Cho_xac_nhan">
                Chờ xác nhận ({userOrders.filter((o) => o.Trang_thai === "Cho_xac_nhan").length})
              </TabsTrigger>
              <TabsTrigger value="Da_huy">
                Đã hủy ({userOrders.filter((o) => o.Trang_thai === "Da_huy").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Không có đơn hàng nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const info = getShowtimeInfo(order.Id_suat_chieu)
                if (!info) return null

                const { phim, suat, rap } = info
                const orderDate = new Date(order.Ngay_dat)

                return (
                  <Card key={order.Id_dat_ve} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Phim</p>
                          <p className="font-medium">{phim?.Ten_phim}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rạp</p>
                          <p className="font-medium">{rap?.Ten_rap}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày giờ</p>
                          <p className="font-medium">
                            {new Date(suat?.Thoi_gian_bat_dau || "").toLocaleString("vi-VN", {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Trạng thái</p>
                            {getStatusBadge(order.Trang_thai)}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Mã vé</p>
                            <p className="font-mono text-sm font-medium">{order.Ma_ve}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Ghế</p>
                            <p className="font-medium">{order.Danh_sach_ghe.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phòng</p>
                            <p className="font-medium">{suat?.Phong_chieu}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tổng tiền</p>
                            <p className="font-bold text-red-600">{order.Tong_tien.toLocaleString("vi-VN")}₫</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Đặt lúc</p>
                            <p className="font-medium text-xs">{orderDate.toLocaleDateString("vi-VN")}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
