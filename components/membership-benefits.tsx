"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  mockMemberTiers,
  getCurrentMemberTier,
  getMembershipProgress,
  type Member,
  type AccountMembership,
} from "@/lib/mock-data";
import { Check, Lock, Trophy, TrendingUp, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembershipBenefitsProps {
  membershipPoints: number;
  phoneNumber: string;
  membershipHistory?: AccountMembership[];
}

export function MembershipBenefits({
  membershipPoints,
  phoneNumber,
  membershipHistory = [],
}: MembershipBenefitsProps) {
  const { currentTier, nextTier, progress, pointsToNext } =
    getMembershipProgress(membershipPoints);

  return (
    <div className="space-y-8">
      {/* Current Membership Card */}
      <Card className="relative overflow-hidden border-2" style={{ borderColor: currentTier.color }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${currentTier.color} 0%, transparent 100%)`,
          }}
        />
        
        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-lg"
                style={{ backgroundColor: currentTier.color + "20" }}
              >
                {currentTier.badge_icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Hạng thành viên</p>
                <h2 className="text-3xl font-bold capitalize" style={{ color: currentTier.color }}>
                  {currentTier.level}
                </h2>
              </div>
            </div>
            
            {currentTier.discount_percent > 0 && (
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 font-bold"
                style={{
                  backgroundColor: currentTier.color + "20",
                  color: currentTier.color,
                }}
              >
                -{currentTier.discount_percent}% OFF
              </Badge>
            )}
          </div>

          {/* Points Display */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Điểm tích lũy</p>
            <p className="text-4xl font-bold">
              {membershipPoints.toLocaleString()} <span className="text-xl text-muted-foreground">pts</span>
            </p>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Tiến độ lên {nextTier.level}</span>
                </div>
                <span className="text-muted-foreground">
                  {pointsToNext.toLocaleString()} điểm nữa
                </span>
              </div>
              
              <div className="relative">
                <Progress value={progress} className="h-3" />
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
                  }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                {progress}% - Còn {pointsToNext} điểm để lên {nextTier.badge_icon} {nextTier.level}
              </p>
            </div>
          )}

          {!nextTier && (
            <div className="flex items-center justify-center gap-2 text-yellow-600 bg-yellow-500/10 rounded-lg p-4">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Bạn đã đạt hạng cao nhất! 👑</span>
            </div>
          )}
        </div>
      </Card>

      {/* Benefits Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Quyền lợi của bạn
        </h3>
        
        <div className="grid gap-2">
          {currentTier.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 hover:bg-accent/5 transition-colors"
            >
              <div
                className="mt-0.5 rounded-full p-1"
                style={{ backgroundColor: currentTier.color + "20" }}
              >
                <Check className="w-4 h-4" style={{ color: currentTier.color }} />
              </div>
              <span className="text-sm flex-1">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Tiers Comparison */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          So sánh các hạng
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {mockMemberTiers.map((tier) => {
            const isCurrentTier = tier.level === currentTier.level;
            const isLocked = membershipPoints < tier.minimum_point;
            
            return (
              <Card
                key={tier.level}
                className={cn(
                  "relative overflow-hidden transition-all",
                  isCurrentTier && "ring-2 shadow-lg",
                  isLocked && "opacity-60"
                )}
                style={isCurrentTier ? { borderColor: tier.color } : {}}
              >
                {isCurrentTier && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: tier.color }}
                  >
                    Hiện tại
                  </div>
                )}
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.badge_icon}</span>
                      <div>
                        <h4 className="font-bold capitalize text-lg" style={{ color: tier.color }}>
                          {tier.level}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {tier.minimum_point.toLocaleString()} điểm
                        </p>
                      </div>
                    </div>
                    
                    {isLocked && (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {tier.discount_percent > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: tier.color,
                        color: tier.color,
                      }}
                    >
                      Giảm {tier.discount_percent}%
                    </Badge>
                  )}

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Quyền lợi:</p>
                    {tier.benefits.slice(0, 3).map((benefit, idx) => (
                      <p key={idx} className="text-xs flex items-start gap-1.5">
                        <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                        <span className={cn(isLocked && "text-muted-foreground")}>
                          {benefit}
                        </span>
                      </p>
                    ))}
                    {tier.benefits.length > 3 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{tier.benefits.length - 3} quyền lợi khác...
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Membership History */}
      {membershipHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Lịch sử thăng hạng</h3>
          
          <div className="space-y-3">
            {membershipHistory
              .sort((a, b) => new Date(b.join_date).getTime() - new Date(a.join_date).getTime())
              .map((history, index) => {
                const tier = mockMemberTiers.find((t) => t.level === history.level);
                
                return (
                  <div
                    key={`${history.level}-${history.join_date}`}
                    className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: tier?.color + "20" }}
                      >
                        {tier?.badge_icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold capitalize">
                        Thăng hạng {tier?.level}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {history.upgrade_reason || "Đạt điểm yêu cầu"}
                      </p>
                    </div>
                    
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(history.join_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
