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

  useEffect(() => {
    if (!currentUser) return;

    const fetchVouchers = async () => {
      try {
        setLoading(true);
        // Get basic vouchers for user
        const vouchers = await voucherService.getByUser(
          currentUser.phone_number
        );
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
  }, [currentUser]);

  // Filter vouchers
  const activeVouchers = userVouchers.filter((v) => v.state === "active");
  const usedVouchers = userVouchers.filter((v) => v.state === "used");
  const expiredVouchers = userVouchers.filter((v) => v.state === "expired");

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <Button asChild>
            <Link href="/account/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  const userLevel =
    currentUser.membership_points >= 5000
      ? "vip"
      : currentUser.membership_points >= 2500
      ? "diamond"
      : currentUser.membership_points >= 1000
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
        className={`${badge.color} border-none font-semibold`}
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
        className={`group relative overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/50`}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />

        <div className="relative p-6 flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            {/* Type Badge & Discount Value */}
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
                  isGift
                    ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white"
                    : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                }`}
              >
                {isGift ? (
                  <Gift className="w-7 h-7" />
                ) : (
                  <Percent className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="font-bold text-3xl text-foreground tracking-tight">
                  {formatDiscount(voucher)}
                </span>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {isGift ? "Quà Tặng" : "Giảm Giá"}
                </p>
              </div>
            </div>

            {/* Event & Promo Name */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                <Sparkles className="w-4 h-4" />
                {voucher.promotional?.event_id}
              </div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {voucher.promotional?.description}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-3 h-3" />
                <code className="rounded bg-muted px-2 py-0.5 font-mono font-bold text-foreground border border-border">
                  {voucher.code}
                </code>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {voucher.promotional &&
                getMemberLevelBadge(voucher.promotional.level)}

              {isGift && voucher.gift && (
                <Badge
                  variant="secondary"
                  className="bg-pink-500/10 text-pink-700 hover:bg-pink-500/20 border-none"
                >
                  🎁 {voucher.gift.name}
                </Badge>
              )}

              {!isGift && voucher.discount && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-none"
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
                  }`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Còn {daysLeft} ngày
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="text-xs text-muted-foreground pt-4 border-t border-border/50 flex flex-col gap-1">
              <p>
                Hạn sử dụng:{" "}
                <span className="font-medium text-foreground">
                  {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col justify-center h-full pt-2">
            <Link href={`/book-ticket/st_001?voucher=${voucher.code}`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-bold"
              >
                {isGift ? (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Nhận Ngay
                  </>
                ) : (
                  <>
                    <Percent className="w-4 h-4 mr-2" />
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

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Gift className="w-4 h-4" />
            <span>Ưu Đãi Dành Riêng Cho Bạn</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Voucher & Quà Tặng
          </h1>

          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <p className="text-xl text-muted-foreground max-w-2xl font-light">
              Bạn đang là thành viên
            </p>
            {getMemberLevelBadge(userLevel)}
            <p className="text-xl text-muted-foreground">
              với {currentUser.membership_points} điểm
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
            <div className="mb-12 space-y-6 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-background rounded-xl border border-border/50 shadow-sm">
                  <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm voucher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-lg"
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
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-12">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger
                    value="discount"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    Giảm Giá
                  </TabsTrigger>
                  <TabsTrigger
                    value="gift"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    Quà Tặng
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Active Vouchers */}
            <section className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h2 className="text-3xl font-bold text-foreground">
                  Voucher Khả Dụng
                </h2>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-primary/10 text-primary"
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
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Gift className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Không tìm thấy voucher nào
                  </h3>
                  <p className="text-muted-foreground">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
                </div>
              )}
            </section>

            {/* Used Vouchers */}
            {usedVouchers.length > 0 && (
              <section className="mb-20 opacity-60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-1.5 bg-muted rounded-full"></div>
                  <h2 className="text-3xl font-bold text-muted-foreground">
                    Đã Sử Dụng
                  </h2>
                  <Badge variant="outline" className="ml-auto">
                    {usedVouchers.length} voucher
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 grayscale">
                  {usedVouchers.slice(0, 4).map((voucher) => (
                    <VoucherCard key={voucher.code} voucher={voucher} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 text-center text-primary-foreground shadow-2xl">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-white/20 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-white/20 blur-3xl rounded-full"></div>

              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold">
                  Nâng Hạng Thành Viên!
                </h3>
                <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-light">
                  Nâng cấp hạng thành viên để nhận thêm nhiều ưu đãi độc quyền,
                  voucher giảm giá và quà tặng đặc biệt.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg h-12 px-8"
                    asChild
                  >
                    <Link href="/account/profile">Xem Hồ Sơ</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white font-bold shadow-lg hover:bg-white/10 h-12 px-8"
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
