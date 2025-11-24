"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { mockFoods } from "@/lib/mock-data";
import type { Food } from "@/lib/mock-data";

interface FoodItem extends Food {
  quantity: number;
}

interface FoodSelectionProps {
  onFoodChange: (foods: FoodItem[]) => void;
}

export function FoodSelection({ onFoodChange }: FoodSelectionProps) {
  const [selectedFoods, setSelectedFoods] = useState<Map<string, FoodItem>>(
    new Map()
  );

  const handleQuantityChange = (food: Food, change: number) => {
    const newFoods = new Map(selectedFoods);
    const existing = newFoods.get(food.foodId);

    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        newFoods.delete(food.foodId);
      } else {
        newFoods.set(food.foodId, { ...existing, quantity: newQuantity });
      }
    } else if (change > 0) {
      newFoods.set(food.foodId, { ...food, quantity: 1 });
    }

    setSelectedFoods(newFoods);
    onFoodChange(Array.from(newFoods.values()));
  };

  const groupedFoods = mockFoods.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {} as Record<string, Food[]>);

  const categoryLabels: Record<string, string> = {
    Popcorn: "Bắp",
    Drinks: "Nước uống",
    Special_Combo: "Combo đặc biệt",
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold">Chọn đồ ăn thêm</h3>

      {Object.entries(groupedFoods).map(([category, foods]) => (
        <div key={category} className="space-y-4">
          <h4 className="font-semibold text-lg">{categoryLabels[category]}</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => {
              const selectedFood = selectedFoods.get(food.foodId);
              const quantity = selectedFood?.quantity || 0;

              return (
                <div
                  key={food.foodId}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    quantity > 0
                      ? "border-red-600 bg-red-50"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="mb-3 h-24 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={food.image || "/placeholder.svg"}
                      alt={food.foodName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h5 className="mb-1 font-semibold">{food.foodName}</h5>
                  <p className="mb-3 font-bold text-red-600">
                    {food.price.toLocaleString("vi-VN")}₫
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
