import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { Event } from "@/services/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const now = new Date();

  let statusText = "Sắp diễn ra";
  let statusColor = "bg-blue-500/10 text-blue-500 border-blue-500/20";

  if (now >= startDate && now <= endDate) {
    statusText = "Đang diễn ra";
    statusColor = "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (now > endDate) {
    statusText = "Đã kết thúc";
    statusColor = "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col">
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors duration-300" />
        </div>

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          <Badge className={`${statusColor} backdrop-blur-md border shadow-sm`}>
            {statusText}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
            {event.name}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                {startDate.toLocaleDateString("vi-VN")} -{" "}
                {endDate.toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="flex-1">
          <div className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none">
            <p className="leading-relaxed whitespace-pre-line">
              {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
