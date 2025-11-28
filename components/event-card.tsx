import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Event } from "@/services/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        {/* Placeholder gradient since Event doesn't have image field yet */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-primary/40" />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/80 backdrop-blur text-foreground border-none shadow-sm">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(event.start_date).toLocaleDateString("vi-VN")}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {event.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-border/50 mt-auto">
          <Button
            variant="ghost"
            className="group/btn p-0 hover:bg-transparent hover:text-primary pl-0"
            asChild
          >
            <Link href={`/events/${event.event_id}`}>
              Xem chi tiết{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
