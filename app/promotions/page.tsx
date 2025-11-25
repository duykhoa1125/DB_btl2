"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Gift,
  Calendar,
  MapPin,
  Percent,
  DollarSign,
} from "lucide-react";
import { type Voucher, mockVouchers } from "@/lib/mock-data";

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const activeVouchers = mockVouchers.filter((v) => v.status === "Active");
  const expiredVouchers = mockVouchers.filter((v) => v.status === "Expired");

  const filteredVouchers = activeVouchers.filter((voucher) => {
    const matchesSearch =
      voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "movies" && voucher.scope !== "Food") ||
      (selectedCategory === "food" && voucher.scope === "Food");

    return matchesSearch && matchesCategory;
  });

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const days = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const formatDiscountValue = (voucher: Voucher) => {
    if (voucher.discountType === "Percentage") {
      return `${voucher.discountValue}%`;
    }
    return `₫${voucher.discountValue.toLocaleString("vi-VN")}`;
  };

  const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
    const daysLeft = getDaysUntilExpiry(voucher.endDate);
    const isExpiringSoon = daysLeft <= 3;
    const isExpired = voucher.status === "Expired";

    return (
      <Card
        className={`group relative overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${
          isExpired ? "opacity-60 bg-muted/50" : "bg-card/50 backdrop-blur-sm hover:border-primary/50"
        }`}
      >
        {/* Glow Effect */}
        {!isExpired && (
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
        )}

        <div className="relative p-6 flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
                  voucher.discountType === "Percentage"
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-br from-primary to-primary/80 text-white"
                }`}
              >
                {voucher.discountType === "Percentage" ? (
                  <Percent className="w-7 h-7" />
                ) : (
                  <DollarSign className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="font-bold text-3xl text-foreground tracking-tight">
                  {formatDiscountValue(voucher)}
                </span>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">giảm giá</p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {voucher.voucherName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Mã:</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono font-bold text-foreground border border-border">
                  {voucher.voucherCode}
                </code>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                {voucher.scope === "All_Cinemas"
                  ? "🎬 Tất cả phim"
                  : voucher.scope === "Designated_Cinemas"
                  ? "🎯 Phim chỉ định"
                  : "🍿 Đồ ăn"}
              </Badge>

              {voucher.regions.length < 3 && (
                <Badge variant="outline" className="border-border/50">
                  <MapPin className="w-3 h-3 mr-1" />
                  {voucher.regions.join(", ")}
                </Badge>
              )}

              <Badge variant="outline" className="border-border/50">
                Còn {voucher.remainingQuantity} lượt
              </Badge>

              {daysLeft > 0 && !isExpired && (
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

              {isExpired && (
                <Badge variant="destructive">
                  Đã hết hạn
                </Badge>
              )}
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t border-border/50 flex flex-col gap-1">
              <p>
                Hạn sử dụng:{" "}
                <span className="font-medium text-foreground">
                  {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p>
                Điều kiện:{" "}
                <span className="font-medium text-foreground">
                  {voucher.minPurchase
                    ? `Đơn tối thiểu ₫${voucher.minPurchase.toLocaleString("vi-VN")}`
                    : "Không yêu cầu"}
                </span>
              </p>
            </div>
          </div>

          {!isExpired && (
            <div className="flex flex-col justify-center h-full pt-2">
              <Link href={`/book-ticket/st_001?voucher=${voucher.voucherCode}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-bold"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Dùng Ngay
                </Button>
              </Link>
            </div>
          )}
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
            <span>Khuyến Mãi Đặc Biệt</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Ưu Đãi & Voucher
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Khám phá hàng ngàn ưu đãi hấp dẫn, voucher giảm giá và chương trình
            khuyến mãi đặc biệt chỉ dành cho bạn tại CinemaHub.
          </p>
        </div>

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
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-12">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Tất cả</TabsTrigger>
              <TabsTrigger value="movies" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Phim</TabsTrigger>
              <TabsTrigger value="food" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Đồ ăn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Active Promotions */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">
              Đang Diễn Ra
            </h2>
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
              {filteredVouchers.length} voucher
            </Badge>
          </div>

          {filteredVouchers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredVouchers.map((voucher) => (
                <VoucherCard key={voucher.voucherId} voucher={voucher} />
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

        {/* Expired Promotions */}
        {expiredVouchers.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-1.5 bg-muted rounded-full"></div>
              <h2 className="text-3xl font-bold text-muted-foreground">
                Đã Kết Thúc
              </h2>
              <Badge variant="outline" className="ml-auto">
                {expiredVouchers.length} voucher
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {expiredVouchers.slice(0, 4).map((voucher) => (
                <VoucherCard key={voucher.voucherId} voucher={voucher} />
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
            <h3 className="text-3xl md:text-4xl font-bold">Đăng Ký Thành Viên Ngay!</h3>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-light">
              Trở thành thành viên CinemaHub để nhận thêm nhiều ưu đãi độc quyền,
              voucher giảm giá và thông tin về phim mới nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg h-12 px-8"
                asChild
              >
                <Link href="/account/register">Đăng Ký Ngay</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary font-bold shadow-lg hover:bg-white/10 h-12 px-8"
                asChild
              >
                <Link href="/account/login">Đăng Nhập</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
