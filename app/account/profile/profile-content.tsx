"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  billService,
  ticketService,
  showtimeService,
  movieService,
  membershipService,
} from "@/services";
import { ChevronDown, Edit2, User, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";
import { MembershipBenefits } from "@/components/membership-benefits";
import { VoucherWallet } from "@/components/voucher-wallet";
import { AccountWithRole } from "@/services/types";

// Type for bill with enriched data
interface EnrichedBill {
  bill_id: string;
  total_price: number;
  creation_date: string;
  tickets: any[];
  showtime: any;
  movie: any;
}

export function ProfileContent() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [userBills, setUserBills] = useState<EnrichedBill[]>([]);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    birth_date: "",
    avatar: "",
  });

  // Derived user
  const user =
    currentUser && currentUser.role === "user"
      ? (currentUser as AccountWithRole)
      : null;

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (!authLoading && currentUser && currentUser.role === "admin") {
      // Admin should use admin dashboard, not user profile
      router.push("/admin/dashboard");
    } else if (user) {
      setFormData({
        fullname: user.fullname,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        avatar: user.avatar || "",
      });

      // Load user data: bills and membership
      const loadUserData = async () => {
        try {
          setDataLoading(true);

          // Load membership data
          const membershipPoints = user.membership_points || 0;
          const membership = await membershipService.getProgress(
            membershipPoints
          );
          setMembershipData(membership);

          // Load bills
          const bills = await billService.getByUser(user.phone_number);

          // Enrich each bill with tickets, showtime, and movie data
          const enrichedBills: EnrichedBill[] = [];
          for (const bill of bills) {
            try {
              const tickets = await ticketService.getByBill(bill.bill_id);
              if (tickets.length > 0) {
                const firstTicket = tickets[0];
                const showtime = await showtimeService.getById(
                  firstTicket.showtime_id
                );
                if (showtime) {
                  const movie = await movieService.getWithDetails(
                    showtime.movie_id
                  );
                  enrichedBills.push({
                    bill_id: bill.bill_id,
                    total_price: bill.total_price,
                    creation_date: bill.creation_date,
                    tickets,
                    showtime,
                    movie,
                  });
                }
              }
            } catch (error) {
              console.error(`Error loading bill ${bill.bill_id}:`, error);
            }
          }

          setUserBills(enrichedBills);
          setDataLoading(false);
        } catch (error) {
          console.error("Error loading user data:", error);
          setDataLoading(false);
        }
      };

      loadUserData();
    }
  }, [currentUser, authLoading, router, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
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

  if (authLoading || !currentUser || dataLoading || !membershipData || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Get membership info from loaded data
  const membershipPoints = user.membership_points || 0;
  const { currentTier } = membershipData;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb
            items={[{ label: "Tài khoản", href: "/" }, { label: "Hồ sơ" }]}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm group hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6 group/avatar">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur transition duration-500 group-hover/avatar:opacity-100" />
                  <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                    <AvatarImage
                      src={user.avatar || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                      {(user.fullname || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2.5 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-primary/30">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <h1 className="mb-1 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  {user.fullname}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                  <User className="w-3 h-3" />
                  {user.email}
                </div>

                <div className="grid w-full grid-cols-2 gap-4 border-t border-border/50 py-6">
                  <div className="p-3 rounded-2xl bg-background/50 border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-primary" /> Thành viên
                    </p>
                    <p className="font-black text-lg text-primary capitalize">
                      {currentTier.level}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-background/50 border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-primary" /> Điểm tích lũy
                    </p>
                    <p className="font-black text-lg text-primary">
                      {membershipPoints}
                    </p>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                    <span>Ngày tham gia</span>
                    <span className="font-medium text-foreground">
                      {new Date(user.registration_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Card - Enhanced */}
            <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-card/50 to-muted/30 p-8 shadow-lg backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Hạng thành viên
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Hạng hiện tại
                    </p>
                    <p className="font-bold text-2xl text-primary capitalize">
                      {currentTier.level}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                    {currentTier.level.charAt(0).toUpperCase()}
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
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Thông tin cá nhân
                </h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
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
                      className="bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Họ và tên
                  </label>
                  <Input
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Ngày sinh
                  </label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Avatar URL
                  </label>
                  <Input
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Membership Benefits */}
            <MembershipBenefits
              membershipPoints={membershipPoints}
              phoneNumber={user.phone_number}
            />

            {/* Voucher Wallet */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
              <VoucherWallet phoneNumber={user.phone_number} />
            </div>

            {/* Booking History */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Lịch sử đặt vé
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
                <div className="border-b border-border/50 p-4 bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {userBills.length} đơn đặt vé gần đây
                  </p>
                </div>

                <div className="divide-y divide-border/50">
                  {userBills.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      Bạn chưa có đơn đặt vé nào.
                    </div>
                  ) : (
                    userBills.map((bill) => {
                      const { tickets, movie } = bill;
                      const isExpanded = expandedBill === bill.bill_id;

                      return (
                        <div
                          key={bill.bill_id}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <button
                            onClick={() =>
                              setExpandedBill(isExpanded ? null : bill.bill_id)
                            }
                            className="flex w-full items-center justify-between p-6 text-left"
                          >
                            <div className="flex-1 pr-4">
                              <h3 className="font-bold text-lg text-foreground mb-1 hover:text-primary transition-colors">
                                {movie?.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                {new Date(
                                  bill.creation_date
                                ).toLocaleDateString("vi-VN", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-lg font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                ₫{bill.total_price.toLocaleString("vi-VN")}
                              </span>
                              <div
                                className={`p-2 rounded-full bg-muted/50 transition-transform duration-300 ${
                                  isExpanded
                                    ? "rotate-180 bg-primary/10 text-primary"
                                    : ""
                                }`}
                              >
                                <ChevronDown className="h-5 w-5" />
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                              <div className="rounded-xl bg-background/50 border border-border/50 p-4 space-y-4">
                                {/* Ticket Details */}
                                <div>
                                  <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Chi tiết vé ({tickets.length})
                                  </p>
                                  <div className="space-y-2">
                                    {tickets.map((ticket) => {
                                      return (
                                        <div
                                          key={ticket.ticket_id}
                                          className="flex justify-between text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                          <span className="text-muted-foreground font-medium">
                                            Ghế {ticket.seat_row}
                                            {ticket.seat_column}
                                          </span>
                                          <span className="font-mono">
                                            ₫
                                            {ticket.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="h-px w-full bg-border/50 border-dashed" />

                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground font-mono">
                                    ID: {bill.bill_id}
                                  </span>
                                  <span
                                    className={cn(
                                      "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm",
                                      "bg-green-500/10 text-green-600 border border-green-500/20"
                                    )}
                                  >
                                    Đã thanh toán
                                  </span>
                                </div>
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
