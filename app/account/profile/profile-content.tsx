"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  mockBookings, 
  mockShowtimes, 
  mockMovies, 
  mockSeats, 
  mockFoods,
  mockAccountMemberships,
  getMembershipProgress,
} from "@/lib/mock-data";
import { ChevronDown, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";
import { MembershipBenefits } from "@/components/membership-benefits";

export function ProfileContent() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
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

  // Get user bookings (filter by current user)
  const userBookings = mockBookings.filter((b) => b.userId === currentUser.userId);
  
  // Get user membership history
  const userMembershipHistory = mockAccountMemberships.filter(
    (m) => m.phone_number === currentUser.phoneNumber
  );
  
  // Get membership progress
  const membershipPoints = (currentUser as any).membershipPoints || 0;
  const { currentTier } = getMembershipProgress(membershipPoints);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb 
            items={[
              { label: "Tài khoản", href: "/" },
              { label: "Hồ sơ" }
            ]} 
          />
        </div>
      </div>

      <div className="px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="mb-2 text-4xl font-bold">Hồ sơ của tôi</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin cá nhân, hạng thành viên và lịch sử đặt vé
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* LEFT COLUMN: Profile Info */}
            <div className="space-y-6">
              {/* Profile Card with Avatar */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage
                      src={formData.avatar || "/placeholder.svg"}
                      alt={formData.fullName}
                    />
                    <AvatarFallback className="text-xl">
                      {formData.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{formData.fullName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="text-sm font-semibold capitalize"
                        style={{ color: currentTier.color }}
                      >
                        {currentTier.badge_icon} {currentTier.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info Display */}
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Email</p>
                        <p className="font-medium break-all">{currentUser.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Số điện thoại</p>
                        <p className="font-medium">{formData.phoneNumber || "Chưa cập nhật"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Ngày sinh</p>
                        <p className="font-medium">
                          {formData.birthDate 
                            ? new Date(formData.birthDate).toLocaleDateString("vi-VN") 
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Giới tính</p>
                        <p className="font-medium capitalize">
                          {(currentUser as any).gender === "male" 
                            ? "Nam" 
                            : (currentUser as any).gender === "female" 
                            ? "Nữ" 
                            : "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Ngày tham gia</p>
                        <p className="font-medium">
                          {new Date((currentUser as any).registrationDate || currentUser.createdDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Điểm tích lũy</p>
                        <p className="font-bold text-primary text-lg">{membershipPoints}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                ) : (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Họ tên</label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input value={currentUser.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Số điện thoại</label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="0912345678"
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
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {isSaving ? "Đang lưu..." : "Lưu"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-bold text-lg">Thống kê</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                    <span className="text-sm text-muted-foreground">Tổng đặt vé</span>
                    <span className="text-2xl font-bold text-primary">{userBookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                    <span className="text-sm text-muted-foreground">Điểm tích lũy</span>
                    <span className="text-2xl font-bold" style={{ color: currentTier.color }}>
                      {membershipPoints}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN: Membership Benefits */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Hạng thành viên</h2>
                <MembershipBenefits
                  membershipPoints={membershipPoints}
                  phoneNumber={currentUser.phoneNumber}
                  membershipHistory={userMembershipHistory}
                />
              </div>

              {/* Booking History */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Lịch sử đặt vé</h2>
                <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border p-6">
                    <p className="text-sm text-muted-foreground">
                      {userBookings.length} đơn đặt vé
                    </p>
                  </div>

                  <div className="divide-y divide-border">
                    {userBookings.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground">
                        Bạn chưa có đơn đặt vé nào.
                      </div>
                    ) : (
                      userBookings.map((booking) => {
                        const showtime = mockShowtimes.find(
                          (s) => s.showtimeId === booking.showtimeId
                        );
                        const movie = showtime
                          ? mockMovies.find((m) => m.movieId === showtime.movieId)
                          : null;
                        const isExpanded = expandedBooking === booking.bookingId;

                        return (
                          <div key={booking.bookingId} className="p-6">
                            <button
                              onClick={() =>
                                setExpandedBooking(
                                  isExpanded ? null : booking.bookingId
                                )
                              }
                              className="flex w-full items-center justify-between text-left transition-colors hover:text-primary"
                            >
                              <div className="flex-1">
                                <h3 className="font-bold">{movie?.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    booking.bookingDate
                                  ).toLocaleDateString("vi-VN", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-bold">
                                  ₫{(booking.totalAmount).toLocaleString("vi-VN")}
                                </span>
                                <ChevronDown
                                  className={cn(
                                    "h-5 w-5 transition-transform",
                                    isExpanded && "rotate-180"
                                  )}
                                />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="mt-4 space-y-4 border-t border-border pt-4">
                                {/* Ticket Details */}
                                <div>
                                  <p className="mb-2 text-sm font-semibold">
                                    Chi tiết vé ({booking.seatList.length})
                                  </p>
                                  <div className="space-y-1">
                                    {booking.seatList.map((seatId) => {
                                      const seat = mockSeats.find(
                                        (s) => s.seatId === seatId
                                      );
                                      return (
                                        <div
                                          key={seatId}
                                          className="flex justify-between text-sm"
                                        >
                                          <span className="text-muted-foreground">
                                            Ghế {seat?.seatName},{" "}
                                            {seat?.seatType}
                                          </span>
                                          <span>
                                            ₫{((showtime?.ticketPrice || 0)).toLocaleString("vi-VN")}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Concessions */}
                                {booking.foodList.length > 0 && (
                                  <div>
                                    <p className="mb-2 text-sm font-semibold">
                                      Đồ ăn ({booking.foodList.length})
                                    </p>
                                    <div className="space-y-1">
                                      {booking.foodList.map((item) => {
                                        const food = mockFoods.find(
                                          (f) => f.foodId === item.foodId
                                        );
                                        return (
                                          <div
                                            key={item.foodId}
                                            className="flex justify-between text-sm"
                                          >
                                            <span className="text-muted-foreground">
                                              {item.quantity}x {food?.foodName}
                                            </span>
                                            <span>
                                              ₫{((food?.price || 0) * item.quantity).toLocaleString("vi-VN")}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Status Badge */}
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                  <span
                                    className={cn(
                                      "rounded-full px-3 py-1 text-xs font-medium",
                                      booking.status === "Confirmed"
                                        ? "bg-green-500/10 text-green-600"
                                        : "bg-yellow-500/10 text-yellow-600"
                                    )}
                                  >
                                    {booking.status.replace("_", " ")}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Mã vé: {booking.ticketCode}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
