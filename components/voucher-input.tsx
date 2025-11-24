"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Voucher, mockVouchers } from "@/lib/mock-data";

interface VoucherInputProps {
  onVoucherApply?: (voucher: Voucher, discount: number) => void;
  appliedVoucher?: Voucher | null;
  appliedDiscount?: number;
}

export function VoucherInput({
  onVoucherApply,
  appliedVoucher,
  appliedDiscount,
}: VoucherInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleApply = () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã khuyến mại");
      return;
    }

    const voucher = mockVouchers.find(
      (v) => v.voucherCode.toUpperCase() === code.toUpperCase()
    );

    if (!voucher) {
      setError("Mã khuyến mại không tồn tại");
      toast({
        title: "Lỗi",
        description: "Mã khuyến mại không tồn tại hoặc đã hết hạn",
        variant: "destructive",
      });
      return;
    }

    if (voucher.status !== "Active") {
      setError("Mã khuyến mại đã hết hạn");
      toast({
        title: "Lỗi",
        description: "Mã khuyến mại đã hết hạn hoặc hết số lượng",
        variant: "destructive",
      });
      return;
    }

    setError("");
    const discount =
      voucher.discountType === "Percentage"
        ? voucher.discountValue
        : voucher.discountValue;
    onVoucherApply?.(voucher, discount);

    toast({
      title: "Thành công",
      description: `Đã áp dụng mã ${code.toUpperCase()}`,
    });

    setCode("");
  };

  if (appliedVoucher) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex-1">
            <p className="font-semibold text-green-900">
              {appliedVoucher.voucherCode}
            </p>
            <p className="text-sm text-green-700">
              {appliedVoucher.discountType === "Percentage"
                ? `Giảm ${appliedVoucher.discountValue}%`
                : `Giảm ₫${appliedVoucher.discountValue.toLocaleString(
                    "vi-VN"
                  )}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVoucherApply?.(null as any, 0)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {appliedDiscount && (
          <p className="text-sm text-green-600 font-semibold">
            Tiết kiệm: ₫{appliedDiscount.toLocaleString("vi-VN")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Nhập mã khuyến mại"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          className={error ? "border-red-500" : ""}
        />
        <Button onClick={handleApply}>Áp dụng</Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
