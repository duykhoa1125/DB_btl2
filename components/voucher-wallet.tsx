"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { voucherService } from "@/services";
import { Voucher } from "@/services/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Ticket,
  Copy,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VoucherWalletProps {
  phoneNumber: string;
}

interface VoucherWithDetails extends Voucher {
  details?: any;
}

export function VoucherWallet({ phoneNumber }: VoucherWalletProps) {
  const [vouchers, setVouchers] = useState<VoucherWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const data = await voucherService.getByUser(phoneNumber);

        // Fetch details for each voucher to get description, discount info, etc.
        const enrichedVouchers = await Promise.all(
          data.map(async (v) => {
            try {
              const details = await voucherService.getDetailByCode(v.code);
              return { ...v, details };
            } catch (e) {
              return v;
            }
          })
        );

        setVouchers(enrichedVouchers);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách voucher.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (phoneNumber) {
      fetchVouchers();
    }
  }, [phoneNumber, toast]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép",
      description: `Mã voucher ${code} đã được sao chép vào bộ nhớ tạm.`,
    });
  };

  const handleUseNow = (code: string) => {
    // Save to session storage to auto-apply later (optional implementation)
    sessionStorage.setItem("selectedVoucher", code);

    toast({
      title: "Voucher sẵn sàng!",
      description: "Đang chuyển hướng đến trang đặt vé...",
    });

    // Redirect to home page to start booking flow
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case "active":
        return "text-green-600 bg-green-100 border-green-200";
      case "used":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "expired":
        return "text-gray-600 bg-gray-100 border-gray-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusLabel = (state: string) => {
    switch (state) {
      case "active":
        return "Có thể dùng";
      case "used":
        return "Đã sử dụng";
      case "expired":
        return "Đã hết hạn";
      default:
        return state;
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "used":
        return <Ticket className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải voucher...</div>;
  }

  const activeVouchers = vouchers.filter((v) => v.state === "active");
  const usedVouchers = vouchers.filter((v) => v.state === "used");
  const expiredVouchers = vouchers.filter((v) => v.state === "expired");

  const VoucherList = ({ items }: { items: VoucherWithDetails[] }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Không có voucher nào trong danh mục này.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((voucher) => (
          <Card
            key={voucher.code}
            className={cn(
              "overflow-hidden transition-all hover:shadow-md",
              voucher.state !== "active" && "opacity-75"
            )}
          >
            <div className="absolute top-0 right-0 p-0">
              <div
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-bl-lg flex items-center gap-1",
                  getStatusColor(voucher.state)
                )}
              >
                {getStatusIcon(voucher.state)}
                {getStatusLabel(voucher.state)}
              </div>
            </div>

            <CardHeader className="pb-2 pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-primary">
                    {voucher.code}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {voucher.details?.promotional?.description ||
                      "Voucher ưu đãi"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    HSD:{" "}
                    {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {voucher.details?.discount && (
                  <div className="text-green-600 font-medium">
                    Giảm {voucher.details.discount.percent_reduce}% (Tối đa{" "}
                    {voucher.details.discount.max_price_can_reduce.toLocaleString()}
                    đ)
                  </div>
                )}
                {voucher.details?.gift && (
                  <div className="text-purple-600 font-medium">
                    Tặng: {voucher.details.gift.name}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleCopyCode(voucher.code)}
              >
                <Copy className="w-4 h-4" />
                Sao chép
              </Button>

              {voucher.state === "active" && (
                <Button
                  size="sm"
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => handleUseNow(voucher.code)}
                >
                  Dùng ngay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ví Voucher</h2>
        <Badge variant="outline" className="px-3 py-1">
          {activeVouchers.length} khả dụng
        </Badge>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">
            Khả dụng ({activeVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="used">
            Đã dùng ({usedVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Hết hạn ({expiredVouchers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <VoucherList items={activeVouchers} />
        </TabsContent>

        <TabsContent value="used" className="mt-0">
          <VoucherList items={usedVouchers} />
        </TabsContent>

        <TabsContent value="expired" className="mt-0">
          <VoucherList items={expiredVouchers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
