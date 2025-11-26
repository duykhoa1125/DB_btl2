"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { membershipService } from "@/services";
import type { AccountMembership, MemberLevel, Member } from "@/services/types";
import { Check, Lock, Trophy, TrendingUp, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembershipBenefitsProps {
  membershipPoints: number;
  phoneNumber: string;
  membershipHistory?: AccountMembership[];
}

// UI Configuration for Member Tiers (not in DB schema)
const TIER_CONFIG: Record<MemberLevel, {
  color: string;
  badge_icon: string;
  benefits: string[];
  discount_percent: number;
}> = {
  copper: {
    color: "#CD7F32",
    badge_icon: "🥉",
    benefits: ["Tích điểm đổi quà", "Nhận tin khuyến mãi"],
    discount_percent: 0,
  },
  gold: {
    color: "#FFD700",
    badge_icon: "🥇",
    benefits: ["Tích điểm đổi quà", "Nhận tin khuyến mãi", "Giảm 5% giá vé", "Quà sinh nhật"],
    discount_percent: 5,
  },
  diamond: {
    color: "#B9F2FF",
    badge_icon: "💎",
    benefits: ["Tích điểm đổi quà", "Nhận tin khuyến mãi", "Giảm 10% giá vé", "Quà sinh nhật", "Miễn phí bắp nước"],
    discount_percent: 10,
  },
  vip: {
    color: "#E0B0FF",
    badge_icon: "👑",
    benefits: ["Tích điểm đổi quà", "Nhận tin khuyến mãi", "Giảm 15% giá vé", "Quà sinh nhật", "Miễn phí bắp nước", "Phòng chờ VIP"],
    discount_percent: 15,
  },
};

interface MembershipProgress {
  currentTier: Member;
  nextTier?: Member;
  progress: number;
  pointsToNext: number;
}

export function MembershipBenefits({
  membershipPoints,
  phoneNumber,
  membershipHistory = [],
}: MembershipBenefitsProps) {
  const [membershipData, setMembershipData] = useState<MembershipProgress | null>(null);
  const [allTiers, setAllTiers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      membershipService.getProgress(membershipPoints),
      membershipService.getAllLevels()
    ]).then(([progressData, tiersData]) => {
      setMembershipData(progressData);
      setAllTiers(tiersData);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load membership data:', error);
      setLoading(false);
    });
  }, [membershipPoints]);

  if (loading || !membershipData) {
    return <div>Loading...</div>;
  }

  const { currentTier, nextTier, progress, pointsToNext } = membershipData;

  const currentConfig = TIER_CONFIG[currentTier.level];
  const nextConfig = nextTier ? TIER_CONFIG[nextTier.level] : null;

  return (
    <div className="space-y-8">
      {/* Current Membership Card */}
      <Card className="relative overflow-hidden border-2" style={{ borderColor: currentConfig.color }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${currentConfig.color} 0%, transparent 100%)`,
          }}
        />
        
        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-lg"
                style={{ backgroundColor: currentConfig.color + "20" }}
              >
                {currentConfig.badge_icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Hạng thành viên</p>
                <h2 className="text-3xl font-bold capitalize" style={{ color: currentConfig.color }}>
                  {currentTier.level}
                </h2>
              </div>
            </div>
            
            {currentConfig.discount_percent > 0 && (
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 font-bold"
                style={{
                  backgroundColor: currentConfig.color + "20",
                  color: currentConfig.color,
                }}
              >
                -{currentConfig.discount_percent}% OFF
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
          {nextTier && nextConfig ? (
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
                    background: `linear-gradient(90deg, ${currentConfig.color}, ${nextConfig.color})`,
                  }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(progress)}% - Còn {pointsToNext} điểm để lên {nextConfig.badge_icon} {nextTier.level}
              </p>
            </div>
          ) : (
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
          {currentConfig.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 hover:bg-accent/5 transition-colors"
            >
              <div
                className="mt-0.5 rounded-full p-1"
                style={{ backgroundColor: currentConfig.color + "20" }}
              >
                <Check className="w-4 h-4" style={{ color: currentConfig.color }} />
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
          {allTiers.map((tier) => {
            const config = TIER_CONFIG[tier.level];
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
                style={isCurrentTier ? { borderColor: config.color } : {}}
              >
                {isCurrentTier && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    Hiện tại
                  </div>
                )}
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.badge_icon}</span>
                      <div>
                        <h4 className="font-bold capitalize text-lg" style={{ color: config.color }}>
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

                  {config.discount_percent > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: config.color,
                        color: config.color,
                      }}
                    >
                      Giảm {config.discount_percent}%
                    </Badge>
                  )}

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Quyền lợi:</p>
                    {config.benefits.slice(0, 3).map((benefit, idx) => (
                      <p key={idx} className="text-xs flex items-start gap-1.5">
                        <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                        <span className={cn(isLocked && "text-muted-foreground")}>
                          {benefit}
                        </span>
                      </p>
                    ))}
                    {config.benefits.length > 3 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{config.benefits.length - 3} quyền lợi khác...
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
                const config = TIER_CONFIG[history.level];
                
                return (
                  <div
                    key={`${history.level}-${history.join_date}`}
                    className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: config?.color + "20" }}
                      >
                        {config?.badge_icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold capitalize">
                        Thăng hạng {history.level}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {/* history.upgrade_reason is not in AccountMembership type */}
                        Đạt điểm yêu cầu
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
