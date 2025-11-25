"use client";

import Link from "next/link";
import { mockCinemas } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Film, ArrowRight } from "lucide-react";

export default function CinemasPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Film className="w-4 h-4" />
            <span>Hệ Thống Rạp Chiếu</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Danh Sách Rạp Chiếu
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Trải nghiệm điện ảnh đỉnh cao tại hệ thống rạp hiện đại bậc nhất.
            Tìm rạp gần bạn nhất ngay hôm nay.
          </p>
        </div>

        {/* Cinema List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCinemas.map((cinema) => (
            <Card
              key={cinema.cinema_id}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
            >
              {/* Decorative Header instead of Image */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 group-hover:from-primary/30 transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {cinema.cinemaName}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6 flex-1 space-y-4">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                  <span>{cinema.address}</span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 mt-auto">
                <Button
                  className="w-full group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  asChild
                >
                  <Link href={`/cinemas/${cinema.cinema_id}`}>
                    <span>Xem Chi Tiết & Lịch Chiếu</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {mockCinemas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy rạp nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
