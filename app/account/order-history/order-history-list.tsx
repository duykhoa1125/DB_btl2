"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services";
import { Ticket, Calendar, Clock, QrCode } from "lucide-react";

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
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Ticket className="w-4 h-4" />
            <span>Lịch sử đơn hàng</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Vé Của Bạn
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Danh sách các vé đã đặt và lịch sử giao dịch.
          </p>
        </div>

        {userBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/30 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
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
          <div className="space-y-6">
            {userBills.map((bill, index) => (
              <div
                key={bill.bill_id}
                className="group relative flex flex-col md:flex-row w-full bg-card hover:bg-card/80 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl border border-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Left Part: Ticket Info */}
                <div className="flex-1 p-6 md:p-8 relative">
                  {/* Decorative Circle Cutout (Left side of the divider) */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border/50 z-10 hidden md:block" />

                  <div className="flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Mã đơn hàng
                        </p>
                        <h3 className="text-2xl font-mono font-bold text-primary tracking-tight">
                          #{bill.bill_id}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1"
                      >
                        Đã thanh toán
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày đặt</span>
                        </div>
                        <p className="font-medium text-foreground">
                          {new Date(bill.creation_date).toLocaleDateString(
                            "vi-VN",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Thời gian</span>
                        </div>
                        <p className="font-medium text-foreground">
                          {new Date(bill.creation_date).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider Line (Vertical on Desktop, Horizontal on Mobile) */}
                <div className="relative flex md:flex-col items-center justify-center">
                  <div className="w-full h-[1px] md:w-[1px] md:h-full border-t md:border-t-0 md:border-l-2 border-dashed border-border/60 my-0 md:mx-0" />
                  {/* Cutouts for mobile */}
                  <div className="absolute left-0 -translate-x-1/2 w-6 h-6 bg-background rounded-full border border-border/50 md:hidden" />
                  <div className="absolute right-0 translate-x-1/2 w-6 h-6 bg-background rounded-full border border-border/50 md:hidden" />
                </div>

                {/* Right Part: Price & QR */}
                <div className="md:w-64 p-6 md:p-8 bg-muted/30 flex flex-col items-center justify-center text-center gap-4 relative">
                  {/* Decorative Circle Cutout (Right side of the divider) */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border/50 z-10 hidden md:block" />

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tổng thanh toán
                    </p>
                    <p className="text-2xl font-black text-primary">
                      {bill.total_price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="w-full h-px bg-border/50 my-2" />

                  <div className="flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <QrCode className="w-16 h-16 text-foreground/80" />
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                      SCAN ME
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
