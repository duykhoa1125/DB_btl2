"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { voucherService } from "@/services";
import { Voucher } from "@/services/types";
import { Button } from "@/components/ui/button";
import {
  Card,
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
  Gift,
  Percent,
  Tag,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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

        // Fetch details for each voucher
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
    sessionStorage.setItem("selectedVoucher", code);
    toast({
      title: "Voucher sẵn sàng!",
      description: "Đang chuyển hướng đến trang đặt vé...",
    });
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         <p className="text-sm text-muted-foreground">Đang tải ví voucher...</p>
      </div>
    );
  }

  const activeVouchers = vouchers.filter((v) => v.state === "active");
  const usedVouchers = vouchers.filter((v) => v.state === "used");
  const expiredVouchers = vouchers.filter((v) => v.state === "expired");

  const VoucherItem = ({ voucher }: { voucher: VoucherWithDetails }) => {
     const isGift = !!voucher.details?.gift;
     const isActive = voucher.state === "active";

     return (
        <div className={cn(
           "group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-all hover:shadow-md hover:border-primary/30",
           !isActive && "opacity-60 grayscale-[0.5]"
        )}>
           {/* Left Side: Icon & Value */}
           <div className="relative flex flex-col items-center justify-center p-4 min-w-[100px] bg-gradient-to-br from-muted/50 to-muted/10 border-r border-dashed border-border/50">
              {/* Decorative Circles for ticket look */}
              <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-background border border-border/50 z-10" />
              <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-background border border-border/50 z-10" />

              <div className={cn(
                 "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm mb-2",
                 isGift ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
              )}>
                 {isGift ? <Gift className="w-6 h-6" /> : <Percent className="w-6 h-6" />}
              </div>
              <div className="text-center">
                 <span className="font-black text-lg leading-none">
                    {voucher.details?.discount 
                       ? `${voucher.details.discount.percent_reduce}%` 
                       : "QUÀ"}
                 </span>
              </div>
           </div>

           {/* Middle: Details */}
           <div className="flex-1 p-4 flex flex-col justify-between gap-2">
              <div>
                 <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                       {voucher.details?.promotional?.description || "Voucher khuyến mãi"}
                    </h4>
                    <Badge variant="outline" className={cn(
                       "shrink-0 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 border-none",
                       voucher.state === "active" ? "bg-green-500/10 text-green-600" : 
                       voucher.state === "used" ? "bg-blue-500/10 text-blue-600" : "bg-gray-500/10 text-gray-500"
                    )}>
                       {voucher.state === "active" ? "Khả dụng" : voucher.state === "used" ? "Đã dùng" : "Hết hạn"}
                    </Badge>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                     <Tag className="w-3 h-3" />
                     <code className="bg-muted px-1.5 py-0.5 rounded-[4px] font-mono text-foreground">{voucher.code}</code>
                 </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                 <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    HSD: {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                 </div>
                 {voucher.details?.discount && (
                    <span className="font-medium text-primary/80">
                       Tối đa {voucher.details.discount.max_price_can_reduce.toLocaleString()}đ
                    </span>
                 )}
              </div>
           </div>

           {/* Right: Actions */}
           {isActive && (
              <div className="flex flex-row sm:flex-col items-center justify-center p-3 gap-2 border-t sm:border-t-0 sm:border-l border-border/50 bg-muted/10">
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-background hover:shadow-sm" onClick={() => handleCopyCode(voucher.code)} title="Sao chép mã">
                    <Copy className="w-4 h-4" />
                 </Button>
                 <Button size="sm" className="h-9 px-3 text-xs font-bold shadow-sm" onClick={() => handleUseNow(voucher.code)}>
                    Dùng
                 </Button>
              </div>
           )}
        </div>
     );
  }

  const EmptyState = ({ message }: { message: string }) => (
      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
         <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
            <Ticket className="w-6 h-6 text-muted-foreground/50" />
         </div>
         <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Wallet className="h-5 w-5" />
           </div>
           <div>
              <h2 className="text-lg font-bold">Ví Voucher</h2>
              <p className="text-sm text-muted-foreground">Quản lý ưu đãi của bạn</p>
           </div>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
           {activeVouchers.length}
        </div>
      </div>

      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4 p-1 bg-muted/40 rounded-xl">
          <TabsTrigger value="active" className="rounded-lg text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Khả dụng</TabsTrigger>
          <TabsTrigger value="used" className="rounded-lg text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Đã dùng</TabsTrigger>
          <TabsTrigger value="expired" className="rounded-lg text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Hết hạn</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 pr-3 -mr-3 h-[400px]">
            <TabsContent value="active" className="mt-0 space-y-3">
               {activeVouchers.length > 0 ? (
                  activeVouchers.map(v => <VoucherItem key={v.code} voucher={v} />)
               ) : (
                  <EmptyState message="Bạn chưa có voucher nào khả dụng." />
               )}
            </TabsContent>

            <TabsContent value="used" className="mt-0 space-y-3">
               {usedVouchers.length > 0 ? (
                  usedVouchers.map(v => <VoucherItem key={v.code} voucher={v} />)
               ) : (
                  <EmptyState message="Bạn chưa sử dụng voucher nào." />
               )}
            </TabsContent>

            <TabsContent value="expired" className="mt-0 space-y-3">
               {expiredVouchers.length > 0 ? (
                  expiredVouchers.map(v => <VoucherItem key={v.code} voucher={v} />)
               ) : (
                  <EmptyState message="Không có voucher hết hạn." />
               )}
            </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
