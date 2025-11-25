"use client";

import { useState } from "react";
import Link from "next/link";
import { mockCinemas } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Film, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CinemasPage() {
  const [selectedCity, setSelectedCity] = useState("all");

  // Get unique cities
  const cities = Array.from(new Set(mockCinemas.map((c) => c.city)));

  const filteredCinemas =
    selectedCity === "all"
      ? mockCinemas
      : mockCinemas.filter((c) => c.city === selectedCity);

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

        {/* City Filter */}
        <div className="mb-12 flex justify-center">
          <Tabs
            defaultValue="all"
            value={selectedCity}
            onValueChange={setSelectedCity}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-full h-12 border border-border/50">
              <TabsTrigger
                value="all"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Tất cả
              </TabsTrigger>
              {cities.map((city) => (
                <TabsTrigger
                  key={city}
                  value={city}
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  {city.replace("TP. ", "")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Cinema List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCinemas.map((cinema) => (
            <Card
              key={cinema.cinemaId}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cinema.imageUrl}
                  alt={cinema.cinemaName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {cinema.cinemaName}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    <span className="truncate">{cinema.address}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 flex-1 space-y-4">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 text-primary" />
                  <span>{cinema.phone}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Tiện ích:</p>
                  <div className="flex flex-wrap gap-2">
                    {cinema.facilities.map((facility) => (
                      <Badge
                        key={facility}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-normal"
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cinema.description}
                </p>
              </CardContent>

              <CardFooter className="p-6 pt-0 mt-auto">
                <Button
                  className="w-full group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  asChild
                >
                  <Link href={`/cinemas/${cinema.cinemaId}`}>
                    <span>Xem Chi Tiết & Lịch Chiếu</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCinemas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy rạp nào tại khu vực này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
