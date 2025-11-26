"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { eventService } from "@/services";
import { Event } from "@/services/types";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAll();
        setEvents(data);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const activeEvents = events.filter(e => {
      const today = new Date().toISOString().split('T')[0];
      return e.end_date >= today;
  });

  const filteredEvents = activeEvents.filter((event) => {
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const EventCard = ({ event }: { event: Event }) => {
    return (
      <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden">
            {/* Placeholder image since Event doesn't have image field yet */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/40" />
          </div>
          <div className="absolute top-4 right-4">
             <Badge className="bg-background/80 backdrop-blur text-foreground border-none">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(event.start_date).toLocaleDateString("vi-VN")} - {new Date(event.end_date).toLocaleDateString("vi-VN")}
             </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <p className="text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border/50">
             <Button variant="ghost" className="group/btn p-0 hover:bg-transparent hover:text-primary" asChild>
                <Link href={`/events/${event.event_id}`}>
                  Xem chi tiết <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
             </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>Sự Kiện Nổi Bật</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Tin Tức & Sự Kiện
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Cập nhật những tin tức mới nhất và các sự kiện hấp dẫn đang diễn ra tại rạp chiếu phim.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Đang tải sự kiện...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Search */}
            <div className="mb-12 max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-background rounded-xl border border-border/50 shadow-sm">
                  <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Không tìm thấy sự kiện nào phù hợp.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
