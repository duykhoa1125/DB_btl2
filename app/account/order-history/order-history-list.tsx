"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services";
import { Ticket, Calendar, Clock } from "lucide-react";

export function OrderHistoryList() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userBills, setUserBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (currentUser) {
      bookingService
        .getMyBookings()
        .then((response) => {
          // Extract bills from response
          const bills = response.map((r) => r.bill);
          setUserBills(bills);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load bills:", error);
          setLoading(false);
        });
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Ticket className="w-4 h-4" />
            <span>Lịch sử đơn</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Lịch Sử Đặt Vé
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Quản lý và xem lại toàn bộ lịch sử đặt vé của bạn.
          </p>
        </div>

        {userBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/30 backdrop-blur-sm">
            <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-muted-foreground">
              Bạn chưa thực hiện giao dịch đặt vé nào.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBills.map((bill) => (
              <div
                key={bill.bill_id}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row justify-between md:items-center gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      #{bill.bill_id}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                    >
                      Đã thanh toán
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(bill.creation_date).toLocaleDateString(
                          "vi-VN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(bill.creation_date).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-1 md:gap-0 border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                  <p className="text-sm text-muted-foreground">
                    Tổng thanh toán
                  </p>
                  <p className="text-2xl font-black text-primary">
                    {bill.total_price.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
