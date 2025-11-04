"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import Link from "next/link"

export default function ProfilePage() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    ngaySinh: "",
    avatar: "",
  })

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/tai-khoan/dang-nhap")
    } else if (currentUser) {
      setFormData({
        hoTen: currentUser.Ho_ten,
        soDienThoai: currentUser.So_dien_thoai,
        ngaySinh: currentUser.Ngay_sinh,
        avatar: currentUser.Avatar,
      })
    }
  }, [currentUser, authLoading, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updateProfile({
        Ho_ten: formData.hoTen,
        So_dien_thoai: formData.soDienThoai,
        Ngay_sinh: formData.ngaySinh,
        Avatar: formData.avatar,
      })
      setIsEditing(false)
      toast({
        title: "Cập nhật thành công",
        description: "Hồ sơ của bạn đã được cập nhật.",
      })
    } finally {
      setIsSaving(false)
    }
  }

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

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-12 bg-background">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/" className="text-sm text-red-600 hover:underline">
              ← Quay lại trang chủ
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ của tôi</CardTitle>
              <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.hoTen} />
                  <AvatarFallback>{formData.hoTen.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentUser.Email}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ tên</label>
                  <Input
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <Input
                    type="tel"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    placeholder="0912345678"
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày sinh</label>
                  <Input
                    type="date"
                    value={formData.ngaySinh}
                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://avatar.vercel.sh/username"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Quản lý tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/tai-khoan/lich-su-don">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Xem lịch sử đơn hàng
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
