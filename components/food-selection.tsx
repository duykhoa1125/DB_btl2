"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { MOCK_FOODS } from "@/services/mock-data";
import type { Food } from "@/services/types";
import { cn } from "@/lib/utils";

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
    const existing = newFoods.get(food.food_id);

    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        newFoods.delete(food.food_id);
      } else {
        newFoods.set(food.food_id, { ...existing, quantity: newQuantity });
      }
    } else if (change > 0) {
      newFoods.set(food.food_id, { ...food, quantity: 1 });
    }

    setSelectedFoods(newFoods);
    onFoodChange(Array.from(newFoods.values()));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Chọn đồ ăn thêm</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_FOODS.map((food) => {
          const selectedFood = selectedFoods.get(food.food_id);
          const quantity = selectedFood?.quantity || 0;

          return (
            <div
              key={food.food_id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                quantity > 0
                  ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div className="flex p-4 gap-4">
                {/* Content */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-foreground line-clamp-2 mb-1">{food.name}</h5>
                    {food.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{food.description}</p>
                    )}
                    <p className="font-bold text-primary text-lg">
                      {food.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, -1)}
                      disabled={quantity === 0}
                      className="h-8 w-8 rounded-full border-border/50 hover:border-primary hover:text-primary"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, 1)}
                      className={cn(
                        "h-8 w-8 rounded-full border-border/50 hover:border-primary hover:text-primary",
                        quantity > 0 && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary"
                      )}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Active Indicator */}
              {quantity > 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
