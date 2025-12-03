"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Popcorn } from "lucide-react";
import { foodService, type FoodMenuItem } from "@/services";
import { cn } from "@/lib/utils";

interface FoodItem extends FoodMenuItem {
  quantity: number;
}

interface FoodSelectionProps {
  onFoodChange: (foods: FoodItem[]) => void;
}

export function FoodSelection({ onFoodChange }: FoodSelectionProps) {
  const [selectedFoods, setSelectedFoods] = useState<Map<string, FoodItem>>(
    new Map()
  );
  const [availableFoods, setAvailableFoods] = useState<FoodMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foodService
      .getAvailableItems()
      .then((data) => {
        setAvailableFoods(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load food items:", error);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (food: FoodMenuItem, change: number) => {
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
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <Popcorn className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Menu Bắp & Nước
          </h3>
          <p className="text-sm text-muted-foreground">
            Thưởng thức phim trọn vẹn với combo yêu thích
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableFoods.map((food) => {
          const selectedFood = selectedFoods.get(food.food_id);
          const quantity = selectedFood?.quantity || 0;

          return (
            <div
              key={food.food_id}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-300",
                quantity > 0
                  ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/50 hover:shadow-sm"
              )}
            >
              <div className="flex gap-4">
                {/* Icon Placeholder */}
                <div
                  className={cn(
                    "h-16 w-16 shrink-0 rounded-lg flex items-center justify-center transition-colors duration-300",
                    quantity > 0
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                  )}
                >
                  <Popcorn className="w-8 h-8" />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-base text-foreground truncate mb-1">
                    {food.name}
                  </h5>
                  {food.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 h-8">
                      {food.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-primary text-lg">
                      {food.price.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-xs text-muted-foreground">₫</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-border/30">
                {quantity > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, -1)}
                      className="h-8 w-8 rounded-full border-primary/20 hover:border-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(food, 1)}
                      className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-sm"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => handleQuantityChange(food, 1)}
                    className="h-8 px-4 rounded-full text-primary hover:text-primary hover:bg-primary/10 font-medium text-sm ml-auto"
                  >
                    Thêm vào giỏ
                  </Button>
                )}
              </div>

              {/* Active Indicator Border */}
              {quantity > 0 && (
                <div className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none opacity-20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
