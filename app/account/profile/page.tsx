"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    avatar: "",
  });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        phoneNumber: currentUser.phoneNumber,
        birthDate: currentUser.birthDate,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser, authLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
        avatar: formData.avatar,
      });
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Hồ sơ của bạn đã được cập nhật.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 bg-background">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="text-sm text-red-600 hover:underline">
            Quay lại trang chủ
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ của tôi</CardTitle>
            <CardDescription>
              Quản lý thông tin tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={formData.avatar || "/placeholder.svg"}
                  alt={formData.fullName}
                />
                <AvatarFallback>
                  {formData.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="0912345678"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày sinh</label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
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
            <Link href="/account/order-history">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                Xem lịch sử đơn hàng
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
