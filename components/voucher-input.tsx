"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Ticket, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { voucherService } from "@/services";
import { cn } from "@/lib/utils";

// VoucherDetail type from mock-data - we need to define it here or in types
interface VoucherDetail {
  code: string;
  promotional_id: string;
  start_date: string;
  end_date: string;
  state: "active" | "used" | "expired";
  phone_number: string;
  promotional?: any;
  discount?: {
    promotional_id: string;
    percent_reduce: number;
    max_price_can_reduce: number;
  };
  gift?: {
    promotional_id: string;
    name: string;
    quantity: number;
  };
}

interface VoucherInputProps {
  onVoucherApply?: (voucher: VoucherDetail, discount: number) => void;
  appliedVoucher?: VoucherDetail | null;
  appliedDiscount?: number;
  initialCode?: string;
}

export function VoucherInput({
  onVoucherApply,
  appliedVoucher,
  appliedDiscount,
  initialCode,
}: VoucherInputProps) {
  const [code, setCode] = useState(initialCode || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const applyCode = useCallback(
    async (voucherCode: string) => {
      if (!voucherCode.trim()) {
        setError("Vui lòng nhập mã khuyến mại");
        return;
      }

      setLoading(true);
      try {
        const voucher = (await voucherService.getDetailByCode(
          voucherCode.toUpperCase()
        )) as VoucherDetail;

        if (!voucher) {
          setError("Mã khuyến mại không tồn tại");
          toast({
            title: "Lỗi",
            description: "Mã khuyến mại không tồn tại hoặc đã hết hạn",
            variant: "destructive",
          });
          return;
        }

        if (voucher.state !== "active") {
          setError("Mã khuyến mại đã hết hạn hoặc đã được sử dụng");
          toast({
            title: "Lỗi",
            description: "Mã khuyến mại đã hết hạn hoặc đã được sử dụng",
            variant: "destructive",
          });
          return;
        }

        setError("");
        let discount = 0;
        if (voucher.discount) {
          discount = voucher.discount.percent_reduce;
        }

        onVoucherApply?.(voucher, discount);

        toast({
          title: "Thành công",
          description: `Mã ${voucherCode.toUpperCase()} đã được áp dụng. Bạn sẽ nhận được ưu đãi khi hoàn tất đặt vé.`,
        });

        setCode("");
      } catch (error) {
        console.error("Failed to apply voucher:", error);
        setError("Có lỗi xảy ra khi áp dụng mã khuyến mại");
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi áp dụng mã khuyến mại",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [onVoucherApply, toast]
  );

  const handleApply = () => {
    applyCode(code);
  };

  useEffect(() => {
    if (initialCode && !appliedVoucher) {
      setCode(initialCode);
      applyCode(initialCode);
    }
  }, [initialCode, appliedVoucher, applyCode]);

  if (appliedVoucher) {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
        <div className="relative overflow-hidden rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
              <Ticket className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                {appliedVoucher.code}
                <CheckCircle2 className="h-4 w-4" />
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                {appliedVoucher.discount
                  ? `Giảm ${appliedVoucher.discount.percent_reduce}% cho đơn hàng`
                  : `Quà tặng: ${
                      appliedVoucher.gift?.name || "Quà tặng đặc biệt"
                    }`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onVoucherApply?.(null as any, 0)}
              className="h-8 w-8 text-green-600 hover:bg-green-500/20 hover:text-green-700 dark:text-green-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Decorative circles */}
          <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background border border-green-500/30" />
          <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background border border-green-500/30" />
        </div>

        {appliedDiscount ? (
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-muted-foreground">
              Tiết kiệm được:
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {appliedDiscount}%
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Nhập mã khuyến mại"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            className={cn(
              "pl-9 bg-background/50 border-border/50 focus:ring-primary/20 transition-all",
              error ? "border-destructive focus:ring-destructive/20" : ""
            )}
          />
        </div>
        <Button
          onClick={handleApply}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
        >
          Áp dụng
        </Button>
      </div>
      {error && (
        <p className="text-xs font-medium text-destructive animate-in slide-in-from-left-1">
          {error}
        </p>
      )}
    </div>
  );
}
