"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/mock-data";

interface CarouselProps {
  items: Movie[];
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = () =>
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  const next = () => setCurrent((prev) => (prev + 1) % items.length);

  if (items.length === 0) return null;

  const currentItem = items[current];

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-background shadow-2xl border border-border/50 group">
      {items.map((item, index) => (
        <div
          key={item.movieId}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-[10s] ease-linear scale-105"
            style={{ transform: index === current ? "scale(1.1)" : "scale(1)" }}
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="max-w-3xl space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="flex flex-wrap gap-2 mb-4">
                {item.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-medium text-white shadow-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                {item.title}
              </h2>
              
              <p className="max-w-2xl line-clamp-2 text-lg text-gray-200/90 font-light">
                {item.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-300 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">Đạo diễn:</span>
                  <span>{item.director}</span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <span>⏱️ {item.duration} phút</span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <span>⭐ {item.rating}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 p-4 transition-all hover:bg-primary hover:border-primary hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 p-4 transition-all hover:bg-primary hover:border-primary hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 right-12 z-10 flex gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-primary" : "w-4 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
