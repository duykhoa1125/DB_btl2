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
  mockSeats, 
  mockFoods,
  mockAccountMemberships,
  getMembershipProgress,
} from "@/lib/mock-data";
import { MOCK_SHOWTIMES, getMovieWithDetails } from "@/services/mock-data";
import { getTicketPrice } from "@/lib/pricing";
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
    fullname: "",
    phone_number: "",
    birth_date: "",
    avatar: "",
  });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (currentUser) {
      setFormData({
        fullname: currentUser.fullname,
        phone_number: currentUser.phone_number,
        birth_date: currentUser.birth_date,
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser, authLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateProfile({
        fullname: formData.fullname,
        phone_number: formData.phone_number,
        birth_date: formData.birth_date,
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

  // Get user bookings (filter by current user phone number)
  const userBookings = mockBookings.filter((b) => b.phone_number === currentUser.phone_number);
  
  // Get user membership history
  const userMembershipHistory = mockAccountMemberships.filter(
    (m) => m.phone_number === currentUser.phone_number
  );
  
  // Get membership progress
  const membershipPoints = currentUser.membership_points || 0;
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

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur transition duration-500 group-hover:opacity-100" />
                  <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                    <AvatarImage src={currentUser.avatar || ""} />
                    <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                      {(currentUser.fullname || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <h1 className="mb-2 text-2xl font-bold">{currentUser.fullname}</h1>
                <p className="mb-6 text-sm text-muted-foreground">{currentUser.email}</p>

                <div className="grid w-full grid-cols-2 gap-4 border-t border-border/50 py-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Thành viên</p>
                    <p className="mt-1 font-bold text-primary capitalize">{currentTier.level}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Điểm tích lũy</p>
                    <p className="mt-1 font-bold text-primary">{membershipPoints}</p>
                  </div>
                </div>

                <div className="w-full space-y-2 border-t border-border/50 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ngày tham gia</span>
                    <span className="font-medium">
                      {new Date(currentUser.registration_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Card */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-bold">Hạng thành viên</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-2xl text-primary capitalize">{currentTier.level}</p>
                    <p className="text-sm text-muted-foreground">Hạng hiện tại</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form & History */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Info */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Hủy
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Họ và tên</label>
                  <Input
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Ngày sinh</label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Avatar URL</label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Membership Benefits */}
            <MembershipBenefits 
              membershipPoints={membershipPoints}
              phoneNumber={currentUser.phone_number}
              membershipHistory={userMembershipHistory}
            />

            {/* Booking History */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6">Lịch sử đặt vé</h2>
              <div className="rounded-xl border border-border bg-card/50">
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
                      const showtime = MOCK_SHOWTIMES.find(
                        (s) => s.showtime_id === booking.showtime_id
                      );
                      const movie = showtime
                        ? getMovieWithDetails(showtime.movie_id)
                        : null;
                      const isExpanded = expandedBooking === booking.booking_id;

                      return (
                        <div key={booking.booking_id} className="p-6">
                          <button
                            onClick={() =>
                              setExpandedBooking(
                                isExpanded ? null : booking.booking_id
                              )
                            }
                            className="flex w-full items-center justify-between text-left transition-colors hover:text-primary"
                          >
                            <div className="flex-1">
                              <h3 className="font-bold">{movie?.name}</h3>
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
                                  {booking.seatList.map((seat_id) => {
                                    const seat = mockSeats.find(
                                      (s) => s.seat_id === seat_id
                                    );
                                    return (
                                      <div
                                        key={seat_id}
                                        className="flex justify-between text-sm"
                                      >
                                        <span className="text-muted-foreground">
                                          Ghế {seat?.seatName},{" "}
                                          {seat?.seatType}
                                        </span>
                                        <span>
                                          ₫{getTicketPrice(seat?.seatType as any).toLocaleString("vi-VN")}
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
                                        (f) => f.food_id === item.food_id
                                      );
                                      return (
                                        <div
                                          key={item.food_id}
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
  );
}
