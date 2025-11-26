"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Sparkles,
  ArrowLeft,
  Ticket,
  Gift,
  Clock
} from "lucide-react";
import { eventService, promotionalService } from "@/services";
import { Event, Promotional } from "@/services/types";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [promotions, setPromotions] = useState<Promotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [eventData, promoData] = await Promise.all([
          eventService.getById(id),
          promotionalService.getByEvent(id)
        ]);
        setEvent(eventData);
        setPromotions(promoData);
      } catch (err) {
        setError('Không thể tải thông tin sự kiện');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <p className="text-red-500 text-lg">{error || 'Sự kiện không tồn tại'}</p>
        <Button asChild>
          <Link href="/events">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
            <Link href="/events" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Quay lại sự kiện
            </Link>
          </Button>
        </div>

        {/* Event Header */}
        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Chi tiết sự kiện</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {event.name}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground">
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.start_date).toLocaleDateString("vi-VN")} - {new Date(event.end_date).toLocaleDateString("vi-VN")}</span>
             </div>
             {/* Status Badge */}
             {new Date(event.end_date) >= new Date() ? (
                 <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Đang diễn ra</Badge>
             ) : (
                 <Badge variant="secondary">Đã kết thúc</Badge>
             )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Description & Image Placeholder */}
            <div className="lg:col-span-2 space-y-8">
                <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative group">
                     {/* Placeholder for Event Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-24 h-24 text-primary/20" />
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-semibold mb-4">Nội dung sự kiện</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Right Column: Promotions */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    Ưu đãi đi kèm
                </h3>

                {promotions.length > 0 ? (
                    <div className="space-y-4">
                        {promotions.map((promo) => (
                            <Card key={promo.promotional_id} className="p-4 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <Badge variant="outline" className="capitalize border-primary/20 text-primary">
                                            {promo.level} Member
                                        </Badge>
                                    </div>
                                    <p className="font-medium">{promo.description}</p>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Áp dụng: {new Date(promo.start_date).toLocaleDateString("vi-VN")} - {new Date(promo.end_date).toLocaleDateString("vi-VN")}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 rounded-xl border border-dashed border-border text-center text-muted-foreground">
                        <Ticket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Không có ưu đãi cụ thể nào cho sự kiện này.</p>
                    </div>
                )}
                
                <Card className="p-6 bg-primary/5 border-primary/10">
                    <h4 className="font-semibold mb-2">Lưu ý</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                        <li>Vui lòng xuất trình thẻ thành viên hoặc mã voucher khi thanh toán.</li>
                        <li>Chương trình có thể kết thúc sớm nếu hết quà tặng.</li>
                        <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                    </ul>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
