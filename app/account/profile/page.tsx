"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { mockBookings, mockShowtimes, mockMovies, mockSeats, mockFoods } from "@/lib/mock-data";
import { ChevronDown, Trophy, Edit2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";

export default function ProfilePage() {
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

  // Mock user loyalty points
  const userPoints = 2580;
  const currentTier = "Gold Tier";
  const nextTier = "Platinum";
  const pointsToNextTier = 430;
  const totalPointsForNextTier = 3010;
  const progress = (userPoints / totalPointsForNextTier) * 100;

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
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View your membership status and booking history.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile & Loyalty */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage
                    src={formData.avatar || "/placeholder.svg"}
                    alt={formData.fullName}
                  />
                  <AvatarFallback className="text-lg">
                    {formData.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{formData.fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Welcome back!
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="mt-6 space-y-4 border-t border-border pt-6">
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Loyalty Card */}
            <div className="relative overflow-hidden rounded-xl border border-yellow-600/20 bg-gradient-to-br from-yellow-600/10 via-yellow-500/5 to-transparent p-6">
              {/* Decorative sparkles */}
              <div className="absolute right-4 top-4 opacity-50">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600/20">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Loại cao cấp</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {currentTier}
                  </p>
                </div>
              </div>

              {/* Shimmer effect background */}
              <div className="relative mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500/10 via-yellow-400/20 to-yellow-500/10 p-6">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30" />
                <div className="relative">
                  <p className="text-sm text-muted-foreground">
                    Điểm tích lũy
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight">
                    {userPoints.toLocaleString()} Points
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Progress to {nextTier}</span>
                  <span className="text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {pointsToNextTier} points to {nextTier} Tier
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking History */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-6">
                <h2 className="text-2xl font-bold">Booking History</h2>
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
                              ${(booking.totalAmount / 1000).toFixed(2)}
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
                                Ticket Details ({booking.seatList.length})
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
                                        Seat {seat?.seatName},{" "}
                                        {seat?.seatType} Recliner
                                      </span>
                                      <span>
                                        $
                                        {(
                                          (showtime?.ticketPrice || 0) / 1000
                                        ).toFixed(2)}
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
                                  Concessions ({booking.foodList.length})
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
                                          $
                                          {(
                                            ((food?.price || 0) *
                                              item.quantity) /
                                            1000
                                          ).toFixed(2)}
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
                                Ticket Code: {booking.ticketCode}
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
  );
}
