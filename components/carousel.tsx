"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Phim } from "@/lib/mock-data"

interface CarouselProps {
  items: Phim[]
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length])

  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length)
  const next = () => setCurrent((prev) => (prev + 1) % items.length)

  if (items.length === 0) return null

  const currentItem = items[current]

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-background shadow-lg">
      {items.map((item, index) => (
        <div
          key={item.Id_phim}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={item.Hinh_anh || "/placeholder.svg"} alt={item.Ten_phim} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="mb-2 text-4xl font-bold text-balance">{item.Ten_phim}</h2>
            <p className="mb-4 max-w-2xl line-clamp-2 text-sm text-gray-200">{item.Mota}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {item.The_loai.map((genre) => (
                <span key={genre} className="rounded-full bg-red-600/80 px-3 py-1 text-xs font-medium">
                  {genre}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-300">
              <p>Đạo diễn: {item.Dao_dien}</p>
              <p>
                ⏱️ {item.Thoi_luong} phút | ⭐ {item.Diem_danh_gia}/10
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-all hover:bg-white/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-all hover:bg-white/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === current ? "w-8 bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
