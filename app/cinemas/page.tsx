"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cinemaService } from "@/services";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Film, ArrowRight } from "lucide-react";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<any[]>([]);

  useEffect(() => {
    cinemaService
      .getAll()
      .then((data) => setCinemas(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setCinemas([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Film className="w-4 h-4" />
            <span>Hệ Thống Rạp Chiếu</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Danh Sách Rạp Chiếu
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Trải nghiệm điện ảnh đỉnh cao tại hệ thống rạp hiện đại bậc nhất.
            Tìm rạp gần bạn nhất ngay hôm nay.
          </p>
        </div>

        {/* Cinema List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cinemas.map((cinema) => (
            <Card key={cinema.cinema_id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full"
            >
              {/* Decorative Header */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 group-hover:from-primary/30 transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500">
                    <Film className="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-500" />
                  </div>
                </div>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-12" />
              </div>

              <CardContent className="p-6 flex-1 space-y-4 relative">
                <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {cinema.name}
                </h3>
                <div className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <span>{cinema.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cinemas.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-lg">
              Không tìm thấy rạp nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
