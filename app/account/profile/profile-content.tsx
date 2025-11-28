"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  billService,
  ticketService,
  showtimeService,
  movieService,
  membershipService,
} from "@/services";
import {
  ChevronDown,
  Edit2,
  User,
  Star,
  Clock,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/breadcrumb";
import { MembershipBenefits } from "@/components/membership-benefits";
import { VoucherWallet } from "@/components/voucher-wallet";
import { AccountWithRole } from "@/services/types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Type for bill with enriched data
interface EnrichedBill {
  bill_id: string;
  total_price: number;
  creation_date: string;
  tickets: any[];
  showtime: any;
  movie: any;
}

export function ProfileContent() {
  const { currentUser, updateProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [userBills, setUserBills] = useState<EnrichedBill[]>([]);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    birth_date: "",
    avatar: "",
  });

  // Derived user
  const user =
    currentUser && currentUser.role === "user"
      ? (currentUser as AccountWithRole)
      : null;

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (!authLoading && currentUser && currentUser.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user) {
      setFormData({
        fullname: user.fullname,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        avatar: user.avatar || "",
      });

      const loadUserData = async () => {
        try {
          setDataLoading(true);
          const membershipPoints = user.membership_points || 0;
          const membership = await membershipService.getProgress(membershipPoints);
          setMembershipData(membership);

          const bills = await billService.getByUser(user.phone_number);
          const enrichedBills: EnrichedBill[] = [];
          for (const bill of bills) {
            try {
              const tickets = await ticketService.getByBill(bill.bill_id);
              if (tickets.length > 0) {
                const firstTicket = tickets[0];
                const showtime = await showtimeService.getById(firstTicket.showtime_id);
                if (showtime) {
                  const movie = await movieService.getWithDetails(showtime.movie_id);
                  enrichedBills.push({
                    bill_id: bill.bill_id,
                    total_price: bill.total_price,
                    creation_date: bill.creation_date,
                    tickets,
                    showtime,
                    movie,
                  });
                }
              }
            } catch (error) {
              console.error(`Error loading bill ${bill.bill_id}:`, error);
            }
          }

          setUserBills(enrichedBills);
          setDataLoading(false);
        } catch (error) {
          console.error("Error loading user data:", error);
          setDataLoading(false);
        }
      };

      loadUserData();
    }
  }, [currentUser, authLoading, router, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullname: formData.fullname,
        phone_number: formData.phone_number,
        birth_date: formData.birth_date,
        avatar: formData.avatar,
      });
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Hồ sơ của bạn đã được cập nhật.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !currentUser || dataLoading || !membershipData || !user) {
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
  const { currentTier, nextTier, pointsNeeded } = membershipData;
  // Calculate progress percentage for next tier
  const progressPercent = nextTier 
    ? Math.min(100, Math.max(0, ((membershipPoints - currentTier.minimum_point) / (nextTier.minimum_point - currentTier.minimum_point)) * 100))
    : 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb items={[{ label: "Tài khoản", href: "/" }, { label: "Hồ sơ" }]} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* --- LEFT COLUMN: PROFILE CARD --- */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="overflow-hidden border-border/50 shadow-lg backdrop-blur-sm bg-card/60">
              <div className="relative h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              </div>
              
              <div className="px-6 pb-6 -mt-16 relative flex flex-col items-center text-center">
                 <div className="relative group">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur transition duration-500 group-hover:opacity-100" />
                    <Avatar className="h-32 w-32 border-4 border-background shadow-2xl cursor-pointer transition-transform group-hover:scale-105">
                      <AvatarImage src={user.avatar || ""} className="object-cover" />
                      <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                        {(user.fullname || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    )}
                 </div>

                 <div className="mt-4 space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{user.fullname}</h1>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {user.email}
                    </p>
                 </div>

                 <div className="mt-6 w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col items-center p-3 rounded-2xl bg-secondary/30 border border-border/50">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Hạng</span>
                          <div className="flex items-center gap-1.5 text-primary font-black text-lg capitalize">
                             <Star className="w-4 h-4 fill-primary" />
                             {currentTier.level}
                          </div>
                       </div>
                       <div className="flex flex-col items-center p-3 rounded-2xl bg-secondary/30 border border-border/50">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Điểm</span>
                          <div className="flex items-center gap-1.5 text-primary font-black text-lg">
                             {membershipPoints}
                          </div>
                       </div>
                    </div>

                    {nextTier && (
                      <div className="space-y-2 text-left p-4 rounded-2xl bg-secondary/20 border border-border/50">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Tiến độ lên <span className="text-foreground font-bold capitalize">{nextTier.level}</span></span>
                          <span className="text-primary">{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          Cần thêm <span className="font-bold text-foreground">{pointsNeeded}</span> điểm
                        </p>
                      </div>
                    )}
                 </div>
              </div>
            </Card>

            <div className="hidden lg:block">
               <MembershipBenefits membershipPoints={membershipPoints} phoneNumber={user.phone_number} />
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS & HISTORY --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Account Details Form */}
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/60 p-6 md:p-8 relative overflow-hidden">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
                        <p className="text-sm text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
                     </div>
                  </div>
                  {!isEditing ? (
                     <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="rounded-xl gap-2 hover:bg-primary/5 hover:border-primary/30">
                        <Edit2 className="h-4 w-4" /> Sửa
                     </Button>
                  ) : (
                     <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving} className="rounded-xl text-muted-foreground hover:text-destructive">
                           <X className="h-4 w-4 mr-1" /> Hủy
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving} className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 gap-2">
                           <Save className="h-4 w-4" /> {isSaving ? "Đang lưu..." : "Lưu"}
                        </Button>
                     </div>
                  )}
               </div>

               <Separator className="mb-6 bg-border/50" />

               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Họ và tên
                     </label>
                     <Input 
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                           "transition-all h-11", 
                           !isEditing && "bg-muted/30 border-transparent font-medium text-foreground px-0 shadow-none"
                        )}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> Số điện thoại
                     </label>
                     <Input 
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        disabled={!isEditing} // Phone number usually shouldn't be editable easily as it's ID
                        className={cn(
                           "transition-all h-11", 
                           !isEditing && "bg-muted/30 border-transparent font-medium text-foreground px-0 shadow-none"
                        )}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Ngày sinh
                     </label>
                     <Input 
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                           "transition-all h-11", 
                           !isEditing && "bg-muted/30 border-transparent font-medium text-foreground px-0 shadow-none"
                        )}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5" /> Avatar URL
                     </label>
                     <Input 
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://example.com/avatar.jpg"
                        className={cn(
                           "transition-all h-11",
                           !isEditing && "bg-muted/30 border-transparent font-medium text-foreground px-0 shadow-none"
                        )}
                     />
                  </div>
               </div>
            </Card>
            
            {/* Mobile view: Membership Benefits moved here */}
            <div className="lg:hidden">
               <MembershipBenefits membershipPoints={membershipPoints} phoneNumber={user.phone_number} />
            </div>

            {/* Voucher Wallet & Booking History Grid */}
             <div className="grid grid-cols-1 gap-8">
                <div className="rounded-3xl border border-border/50 bg-card/60 p-6 md:p-8 shadow-lg backdrop-blur-sm">
                  <VoucherWallet phoneNumber={user.phone_number} />
                </div>

                <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/60 p-6 md:p-8">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Clock className="h-5 w-5" />
                         </div>
                         <div>
                            <h2 className="text-lg font-bold">Lịch sử đặt vé</h2>
                            <p className="text-sm text-muted-foreground">Các vé đã đặt gần đây</p>
                         </div>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                         {userBills.length} đơn
                      </div>
                   </div>

                   <div className="space-y-4">
                      {userBills.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                           <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                              <Clock className="h-6 w-6 text-muted-foreground/50" />
                           </div>
                           <p className="text-muted-foreground font-medium">Bạn chưa có lịch sử đặt vé.</p>
                        </div>
                      ) : (
                        userBills.map((bill) => {
                           const { tickets, movie } = bill;
                           const isExpanded = expandedBill === bill.bill_id;

                           return (
                              <div 
                                 key={bill.bill_id} 
                                 className={cn(
                                    "group rounded-xl border transition-all duration-200 overflow-hidden",
                                    isExpanded ? "bg-card border-primary/30 shadow-md" : "bg-card/30 border-border/50 hover:border-primary/30 hover:bg-card/50"
                                 )}
                              >
                                 <div 
                                    onClick={() => setExpandedBill(isExpanded ? null : bill.bill_id)}
                                    className="p-4 flex items-center justify-between cursor-pointer"
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className="h-12 w-8 rounded-md bg-muted overflow-hidden flex-shrink-0 hidden sm:block">
                                          <img src={movie?.image} alt="" className="h-full w-full object-cover" />
                                       </div>
                                       <div>
                                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{movie?.name}</h3>
                                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                             <Calendar className="w-3 h-3" />
                                             {new Date(bill.creation_date).toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' })}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="text-right hidden sm:block">
                                          <p className="font-bold text-primary">₫{bill.total_price.toLocaleString("vi-VN")}</p>
                                          <p className="text-xs text-muted-foreground">{tickets.length} vé</p>
                                       </div>
                                       <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180 text-primary")} />
                                    </div>
                                 </div>

                                 {isExpanded && (
                                    <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                                       <div className="rounded-lg bg-muted/30 p-4 text-sm space-y-3 border border-border/50">
                                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                                             <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {bill.showtime.room_id}</div>
                                             <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> {bill.showtime.start_time}</div>
                                          </div>
                                          <Separator className="bg-border/50" />
                                          <div className="space-y-2">
                                             {tickets.map((ticket) => (
                                                <div key={ticket.ticket_id} className="flex justify-between items-center">
                                                   <span className="font-medium text-muted-foreground">Ghế {ticket.seat_row}{ticket.seat_column}</span>
                                                   <span className="font-mono font-bold">₫{ticket.price.toLocaleString("vi-VN")}</span>
                                                </div>
                                             ))}
                                          </div>
                                          <Separator className="bg-border/50" />
                                          <div className="flex justify-between items-center pt-1">
                                             <span className="text-xs text-muted-foreground">Mã đơn: {bill.bill_id}</span>
                                             <div className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20">
                                                ĐÃ THANH TOÁN
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           );
                        })
                      )}
                   </div>
                </Card>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}