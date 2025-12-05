"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Gift, Calendar, Percent, Tag, Sparkles } from "lucide-react";
import { voucherService } from "@/services";
import { useAuth } from "@/lib/auth-context";
import { AccountWithRole } from "@/services/types";

// VoucherDetail type - matching mock-data structure
interface VoucherDetail {
  code: string;
  phone_number: string;
  state: "active" | "used" | "expired";
  start_date: string;
  end_date: string;
  promotional?: {
    event_id: string;
    description: string;
    level: string;
  };
  discount?: {
    percent_reduce: number;
    max_price_can_reduce: number;
  };
  gift?: {
    name: string;
  };
}

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "gift" | "discount">(
    "all"
  );
  const { currentUser } = useAuth();
  const [userVouchers, setUserVouchers] = useState<VoucherDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived user - allow admin to view but with different UI
  const user =
    currentUser && currentUser.role === "user"
      ? (currentUser as AccountWithRole)
      : null;

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (!user && !isAdmin) return; // Skip if neither user nor admin

    const fetchVouchers = async () => {
      if (!user) return; // Admin won't fetch vouchers

      try {
        setLoading(true);
        // Get basic vouchers for user
        const vouchers = await voucherService.getByUser(user.phone_number);
        const vouchersArray = Array.isArray(vouchers) ? vouchers : [];

        // Fetch details for each voucher
        const vouchersWithDetails = await Promise.all(
          vouchersArray.map(async (v) => {
            try {
              return await voucherService.getDetailByCode(v.code);
            } catch (err) {
              console.error(
                `Failed to fetch details for voucher ${v.code}`,
                err
              );
              return null;
            }
          })
        );

        setUserVouchers(
          vouchersWithDetails.filter((v): v is VoucherDetail => v !== null)
        );
      } catch (err) {
        setError("Không thể tải danh sách voucher");
        setUserVouchers([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user, isAdmin]);

  // Filter vouchers
  const activeVouchers = userVouchers.filter((v) => v.state === "active");
  const usedVouchers = userVouchers.filter((v) => v.state === "used");
  const expiredVouchers = userVouchers.filter((v) => v.state === "expired");

  // Show login prompt only if not authenticated at all
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="text-center z-10">
          <h1 className="text-3xl font-bold mb-6">Vui lòng đăng nhập</h1>
          <Button
            asChild
            size="lg"
            className="rounded-xl font-bold shadow-lg hover:shadow-primary/20"
          >
            <Link href="/account/login">Đăng nhập ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show admin message
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="text-center z-10 max-w-md">
          <h1 className="text-3xl font-bold mb-4">Trang Voucher Khách Hàng</h1>
          <p className="text-muted-foreground mb-6">
            Trang này dành cho khách hàng. Admin vui lòng quản lý voucher trong
            trang quản trị.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl font-bold shadow-lg hover:shadow-primary/20"
            >
              <Link href="/admin/dashboard">Về Trang Quản Trị</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl font-bold"
            >
              <Link href="/">Trang Chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - user should exist at this point
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const userLevel =
    user.membership_points >= 5000
      ? "vip"
      : user.membership_points >= 2500
      ? "diamond"
      : user.membership_points >= 1000
      ? "gold"
      : "copper";

  const filteredVouchers = activeVouchers.filter((voucher) => {
    const eventName = voucher.promotional?.event_id || ""; // TODO: Get event name
    const promoDesc = voucher.promotional?.description || "";

    const matchesSearch =
      eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promoDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      (selectedType === "discount" && !!voucher.discount) ||
      (selectedType === "gift" && !!voucher.gift);

    return matchesSearch && matchesType;
  });

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const days = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const formatDiscount = (voucher: VoucherDetail) => {
    if (voucher.discount) {
      return `${voucher.discount.percent_reduce}% OFF`;
    }
    return "QUÀ TẶNG";
  };

  const getMemberLevelBadge = (level: string) => {
    const badges: Record<
      string,
      { icon: string; color: string; label: string }
    > = {
      copper: {
        icon: "🥉",
        color: "bg-amber-900/20 text-amber-700",
        label: "Đồng",
      },
      gold: {
        icon: "🥇",
        color: "bg-yellow-500/20 text-yellow-600",
        label: "Vàng",
      },
      diamond: {
        icon: "💎",
        color: "bg-cyan-500/20 text-cyan-600",
        label: "Kim Cương",
      },
      vip: {
        icon: "👑",
        color: "bg-purple-500/20 text-purple-600",
        label: "VIP",
      },
    };
    const badge = badges[level] || badges.copper;
    return (
      <Badge
        variant="outline"
        className={`${badge.color} border-none font-bold px-3 py-1 text-sm`}
      >
        {badge.icon} {badge.label}
      </Badge>
    );
  };

  const VoucherCard = ({ voucher }: { voucher: VoucherDetail }) => {
    const daysLeft = getDaysUntilExpiry(voucher.end_date);
    const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
    const isGift = !!voucher.gift;

    return (
      <Card
        className={`relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/40 group`}
      >
        {/* Decorative elements - Top Left Corner */}
        <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-background border border-border group-hover:border-primary/40 transition-all duration-300" />
        {/* Decorative elements - Bottom Right Corner */}
        <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-background border border-border group-hover:border-primary/40 transition-all duration-300" />

        <div className="relative p-4 flex gap-4 items-center justify-between">
          {/* Main Voucher Info */}
          <div className="flex-1 space-y-3">
            {/* Discount Value / Gift Type */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-md ${
                  isGift
                    ? "bg-pink-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {isGift ? (
                  <Gift className="w-5 h-5" />
                ) : (
                  <Percent className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-2xl text-foreground leading-none">
                  {formatDiscount(voucher)}
                </span>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                  {isGift ? "Quà Tặng" : "Giảm Giá"}
                </p>
              </div>
            </div>

            {/* Event & Promo Name */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                {voucher.promotional?.event_id}
              </div>
              <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                {voucher.promotional?.description}
              </h3>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {voucher.promotional &&
                getMemberLevelBadge(voucher.promotional.level)}

              {isGift && voucher.gift && (
                <Badge
                  variant="secondary"
                  className="bg-pink-500/10 text-pink-700 hover:bg-pink-500/20 border-none font-medium text-xs"
                >
                  🎁 {voucher.gift.name}
                </Badge>
              )}

              {!isGift && voucher.discount && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-none font-medium text-xs"
                >
                  💰 Tối đa ₫
                  {voucher.discount.max_price_can_reduce.toLocaleString(
                    "vi-VN"
                  )}
                </Badge>
              )}

              {daysLeft > 0 && (
                <Badge
                  variant="outline"
                  className={`${
                    isExpiringSoon
                      ? "text-destructive border-destructive/30 bg-destructive/5"
                      : "border-border/50"
                  } font-medium text-xs`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Còn {daysLeft} ngày
                </Badge>
              )}
            </div>

            {/* Voucher Code and Expiry */}
            <div className="pt-2 border-t border-dashed border-border/70 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-3.5 h-3.5" />
                <code className="rounded-md bg-muted px-2 py-1 font-mono font-bold text-foreground text-sm border border-border/70">
                  {voucher.code}
                </code>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                HSD:{" "}
                <span className="font-medium text-foreground">
                  {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center justify-center h-full border-l border-dashed border-border/70 pl-4">
            <Link href={`/book-ticket/st_001?voucher=${voucher.code}`}>
              <Button
                size="sm"
                className="h-10 px-4 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-bold rounded-lg text-sm"
              >
                {isGift ? (
                  <>
                    <Gift className="w-4 h-4 mr-1.5" />
                    Nhận Ngay
                  </>
                ) : (
                  <>
                    <Percent className="w-4 h-4 mr-1.5" />
                    Dùng Ngay
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-muted/5 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Gift className="w-4 h-4" />
            <span>Ưu Đãi Dành Riêng Cho Bạn</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Voucher & Quà Tặng
          </h1>

          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-2 w-fit mx-auto">
            <p className="text-lg text-muted-foreground font-medium">
              Hạng thành viên:
            </p>
            {getMemberLevelBadge(userLevel)}
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-primary">
                {user.membership_points}
              </span>{" "}
              điểm
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Đang tải voucher...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Search and Filter */}
            <div className="mb-16 max-w-2xl mx-auto space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm">
                  <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm voucher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>

              <Tabs
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as typeof selectedType)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm p-1 rounded-xl h-14 border border-border/50">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium text-base"
                  >
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger
                    value="discount"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium text-base"
                  >
                    Giảm Giá
                  </TabsTrigger>
                  <TabsTrigger
                    value="gift"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-medium text-base"
                  >
                    Quà Tặng
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Active Vouchers */}
            <section className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Voucher Khả Dụng
                </h2>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-primary/10 text-primary border border-primary/20 px-3 py-1"
                >
                  {filteredVouchers.length} voucher
                </Badge>
              </div>

              {filteredVouchers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredVouchers.map((voucher) => (
                    <VoucherCard key={voucher.code} voucher={voucher} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/30">
                  <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                    <Gift className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Không tìm thấy voucher nào
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thử thay đổi từ khóa tìm kiếm hoặc chọn loại voucher khác.
                  </p>
                </div>
              )}
            </section>

            {/* Used Vouchers */}
            {usedVouchers.length > 0 && (
              <section className="mb-24 opacity-70 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-1.5 bg-muted rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-muted-foreground tracking-tight">
                    Đã Sử Dụng
                  </h2>
                  <Badge
                    variant="outline"
                    className="ml-auto border-border/50 px-3 py-1"
                  >
                    {usedVouchers.length} voucher
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 grayscale hover:grayscale-0 transition-all duration-500">
                  {usedVouchers.slice(0, 4).map((voucher) => (
                    <VoucherCard key={voucher.code} voucher={voucher} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <div className="relative overflow-hidden rounded-3xl bg-primary p-16 text-center text-primary-foreground shadow-2xl border border-white/10">
              {/* Animated Background Effects */}
              <div className="absolute inset-0 bg-primary" />
              <div className="absolute -top-32 -right-32 h-96 w-96 bg-white/20 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -bottom-32 -left-32 h-96 w-96 bg-white/20 blur-3xl rounded-full animate-pulse delay-1000" />

              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Nâng Hạng Thành Viên Ngay!
                </h3>
                <p className="text-xl text-primary-foreground/90 font-light leading-relaxed">
                  Tích lũy điểm thưởng để mở khóa hạng thành viên VIP và nhận
                  thêm hàng ngàn ưu đãi độc quyền chỉ dành cho bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-background text-foreground hover:bg-background/90 font-bold shadow-xl h-14 px-10 rounded-xl border-2 border-transparent hover:border-primary transition-all text-lg"
                    asChild
                  >
                    <Link href="/account/profile">Xem Hồ Sơ & Tích Điểm</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/40 text-white hover:bg-white/10 font-bold h-14 px-10 rounded-xl backdrop-blur-sm transition-all text-lg"
                    asChild
                  >
                    <Link href="/">Đặt Vé Ngay</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
