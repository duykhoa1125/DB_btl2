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
        className={`p-6 border border-border hover:shadow-lg transition-all duration-300 ${
          isExpired ? "opacity-60 bg-gray-50" : "bg-card hover:bg-card/95"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  voucher.discountType === "Percentage"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {voucher.discountType === "Percentage" ? (
                  <Percent className="w-5 h-5" />
                ) : (
                  <DollarSign className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-bold text-2xl text-foreground">
                  {formatDiscountValue(voucher)}
                </span>
                <p className="text-sm text-muted-foreground">giảm giá</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground">
                {voucher.voucherName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Mã:{" "}
                <span className="font-mono font-medium">
                  {voucher.voucherCode}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {voucher.scope === "All_Cinemas"
                  ? "🎬 Tất cả phim"
                  : voucher.scope === "Designated_Cinemas"
                  ? "🎯 Phim chỉ định"
                  : "🍿 Đồ ăn"}
              </Badge>

              {voucher.regions.length < 3 && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {voucher.regions.join(", ")}
                </Badge>
              )}

              <Badge variant="outline" className="text-xs">
                Còn {voucher.remainingQuantity} lượt
              </Badge>

              {daysLeft > 0 && !isExpired && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    isExpiringSoon ? "text-red-600 border-red-200" : ""
                  }`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Còn {daysLeft} ngày
                </Badge>
              )}

              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Đã hết hạn
                </Badge>
              )}
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              <p>
                Hạn sử dụng:{" "}
                {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                Điều kiện:{" "}
                {voucher.minPurchase
                  ? `Đơn tối thiểu ₫${voucher.minPurchase.toLocaleString(
                      "vi-VN"
                    )}`
                  : "Không yêu cầu"}
              </p>
            </div>
          </div>

          {!isExpired && (
            <Link href={`/book-ticket/st_001?voucher=${voucher.voucherCode}`}>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Gift className="w-4 h-4 mr-2" />
                Dùng Ngay
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Khuyến Mãi Đặc Biệt
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Ưu Đãi & Voucher CinemaHub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá hàng ngàn ưu đãi hấp dẫn, voucher giảm giá và chương trình
            khuyến mãi đặc biệt chỉ dành cho bạn tại CinemaHub.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="movies">Phim</TabsTrigger>
              <TabsTrigger value="food">Đồ ăn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Active Promotions */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-foreground">
              Khuyến Mãi Đang Diễn Ra
            </h2>
            <Badge variant="secondary" className="ml-auto">
              {filteredVouchers.length} voucher
            </Badge>
          </div>

          {filteredVouchers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVouchers.map((voucher) => (
                <VoucherCard key={voucher.voucherId} voucher={voucher} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy voucher nào
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </Card>
          )}
        </section>

        {/* Expired Promotions */}
        {expiredVouchers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-muted-foreground">
                Khuyến Mãi Đã Kết Thúc
              </h2>
              <Badge variant="outline" className="ml-auto">
                {expiredVouchers.length} voucher
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60">
              {expiredVouchers.slice(0, 4).map((voucher) => (
                <VoucherCard key={voucher.voucherId} voucher={voucher} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="bg-linear-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Đăng Ký Thành Viên Ngay!</h3>
          <p className="mb-6 text-red-100 max-w-2xl mx-auto">
            Trở thành thành viên CinemaHub để nhận thêm nhiều ưu đãi độc quyền,
            voucher giảm giá và thông tin về phim mới nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-red-600 hover:bg-gray-100 border-white"
              asChild
            >
              <Link href="/account/register">Đăng Ký Ngay</Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/account/login">Đăng Nhập</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
