"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Star, Mail, Phone, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { AccountWithRole, MemberLevel } from "@/services/types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Membership tier configuration based on points
const MEMBERSHIP_TIERS: {
  level: MemberLevel;
  minPoints: number;
  color: string;
  icon: string;
}[] = [
  { level: "copper", minPoints: 0, color: "#CD7F32", icon: "🥉" },
  { level: "gold", minPoints: 500, color: "#FFD700", icon: "🥇" },
  { level: "diamond", minPoints: 2000, color: "#B9F2FF", icon: "💎" },
  { level: "vip", minPoints: 5000, color: "#E0B0FF", icon: "👑" },
];

function getMembershipTier(points: number) {
  let current = MEMBERSHIP_TIERS[0];
  let next: typeof current | null = null;

  for (let i = 0; i < MEMBERSHIP_TIERS.length; i++) {
    if (points >= MEMBERSHIP_TIERS[i].minPoints) {
      current = MEMBERSHIP_TIERS[i];
      next = MEMBERSHIP_TIERS[i + 1] || null;
    }
  }

  return { current, next };
}

export function ProfileContent() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Derived user
  const user =
    currentUser && currentUser.role === "user"
      ? (currentUser as AccountWithRole)
      : null;

  // Redirect admin to admin dashboard, or redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (!authLoading && currentUser && currentUser.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const membershipPoints = user.membership_points || 0;
  const { current: currentTier, next: nextTier } =
    getMembershipTier(membershipPoints);

  // Calculate progress percentage for next tier
  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((membershipPoints - currentTier.minPoints) /
            (nextTier.minPoints - currentTier.minPoints)) *
            100
        )
      )
    : 100;

  const pointsNeeded = nextTier ? nextTier.minPoints - membershipPoints : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb
            items={[{ label: "Tài khoản", href: "/" }, { label: "Hồ sơ" }]}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-8">
          {/* Profile Card */}
          <Card className="overflow-hidden border-border/50 shadow-lg backdrop-blur-sm bg-card/60">
            <div className="relative h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            </div>

            <div className="px-6 pb-6 -mt-16 relative flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur transition duration-500 group-hover:opacity-100" />
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                  <AvatarImage
                    src={user.avatar || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                    {(user.fullname || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-4 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.fullname}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
              </div>

              <div className="mt-6 w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-secondary/30 border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Hạng
                    </span>
                    <div
                      className="flex items-center gap-1.5 font-black text-lg capitalize"
                      style={{ color: currentTier.color }}
                    >
                      <span>{currentTier.icon}</span>
                      {currentTier.level}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-secondary/30 border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Điểm
                    </span>
                    <div className="flex items-center gap-1.5 text-primary font-black text-lg">
                      <Star className="w-4 h-4 fill-primary" />
                      {membershipPoints}
                    </div>
                  </div>
                </div>

                {nextTier && (
                  <div className="space-y-2 text-left p-4 rounded-2xl bg-secondary/20 border border-border/50">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">
                        Tiến độ lên{" "}
                        <span
                          className="font-bold capitalize"
                          style={{ color: nextTier.color }}
                        >
                          {nextTier.icon} {nextTier.level}
                        </span>
                      </span>
                      <span className="text-primary">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Cần thêm{" "}
                      <span className="font-bold text-foreground">
                        {pointsNeeded}
                      </span>{" "}
                      điểm
                    </p>
                  </div>
                )}

                {!nextTier && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center">
                    <span className="text-yellow-600 font-semibold">
                      👑 Bạn đã đạt hạng cao nhất!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Account Details */}
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/60 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
                <p className="text-sm text-muted-foreground">
                  Thông tin tài khoản của bạn
                </p>
              </div>
            </div>

            <Separator className="mb-6 bg-border/50" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Họ và tên
                </label>
                <p className="text-foreground font-medium">{user.fullname}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Số điện thoại
                </label>
                <p className="text-foreground font-medium">
                  {user.phone_number}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Ngày sinh
                </label>
                <p className="text-foreground font-medium">
                  {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Giới tính
                </label>
                <p className="text-foreground font-medium capitalize">
                  {user.gender === "male"
                    ? "Nam"
                    : user.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Ngày đăng ký
                </label>
                <p className="text-foreground font-medium">
                  {user.registration_date
                    ? new Date(user.registration_date).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </Card>

          {/* Membership Tiers */}
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/60 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Hạng thành viên</h2>
                <p className="text-sm text-muted-foreground">
                  Các cấp hạng thành viên
                </p>
              </div>
            </div>

            <Separator className="mb-6 bg-border/50" />

            <div className="grid gap-4 md:grid-cols-2">
              {MEMBERSHIP_TIERS.map((tier) => {
                const isCurrentTier = tier.level === currentTier.level;
                const isLocked = membershipPoints < tier.minPoints;

                return (
                  <div
                    key={tier.level}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isCurrentTier
                        ? "ring-2 shadow-lg bg-card"
                        : isLocked
                        ? "opacity-60 bg-muted/20"
                        : "bg-card/50"
                    }`}
                    style={
                      isCurrentTier
                        ? { borderColor: tier.color, ringColor: tier.color }
                        : {}
                    }
                  >
                    {isCurrentTier && (
                      <div
                        className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold text-white rounded-full"
                        style={{ backgroundColor: tier.color }}
                      >
                        Hiện tại
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <h4
                          className="font-bold capitalize text-lg"
                          style={{ color: tier.color }}
                        >
                          {tier.level}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {tier.minPoints.toLocaleString()} điểm
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
