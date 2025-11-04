"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { mockDo_an } from "@/lib/mock-data"
import type { Do_an } from "@/lib/mock-data"

interface FoodItem extends Do_an {
  quantity: number
}

interface FoodSelectionProps {
  onFoodChange: (foods: FoodItem[]) => void
}

export function FoodSelection({ onFoodChange }: FoodSelectionProps) {
  const [selectedFoods, setSelectedFoods] = useState<Map<string, FoodItem>>(new Map())

  const handleQuantityChange = (food: Do_an, change: number) => {
    const newFoods = new Map(selectedFoods)
    const existing = newFoods.get(food.Id_do_an)

    if (existing) {
      const newQuantity = existing.quantity + change
      if (newQuantity <= 0) {
        newFoods.delete(food.Id_do_an)
      } else {
        newFoods.set(food.Id_do_an, { ...existing, quantity: newQuantity })
      }
    } else if (change > 0) {
      newFoods.set(food.Id_do_an, { ...food, quantity: 1 })
    }

    setSelectedFoods(newFoods)
    onFoodChange(Array.from(newFoods.values()))
  }

  const groupedFoods = mockDo_an.reduce(
    (acc, food) => {
      if (!acc[food.Danh_muc]) {
        acc[food.Danh_muc] = []
      }
      acc[food.Danh_muc].push(food)
      return acc
    },
    {} as Record<string, Do_an[]>,
  )

  const categoryLabels: Record<string, string> = {
    Bap: "Bắp",
    Nuoc: "Nước uống",
    Dac_biet: "Combo đặc biệt",
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold">Chọn đồ ăn thêm</h3>

      {Object.entries(groupedFoods).map(([category, foods]) => (
        <div key={category} className="space-y-4">
          <h4 className="font-semibold text-lg">{categoryLabels[category]}</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => {
              const selectedFood = selectedFoods.get(food.Id_do_an)
              const quantity = selectedFood?.quantity || 0

              return (
                <div
                  key={food.Id_do_an}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    quantity > 0 ? "border-red-600 bg-red-50" : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="mb-3 h-24 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={food.Hinh_anh || "/placeholder.svg"}
                      alt={food.Ten_do_an}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h5 className="mb-1 font-semibold">{food.Ten_do_an}</h5>
                  <p className="mb-3 font-bold text-red-600">{food.Gia.toLocaleString("vi-VN")}₫</p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(food, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
