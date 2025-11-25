import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactFormClient from "../../components/contact-form";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ",
      content: "123 Đường Phim, Q. 1, TP. Hồ Chí Minh, Việt Nam",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      content: "1900 1234 (ext. 123)",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "support@cinemahub.vn",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Zalo/Messenger",
      content: "@CinemaHub.VN",
    },
  ];

  const workingHours = [
    { day: "Thứ Hai - Thứ Sáu", time: "08:00 - 22:00" },
    { day: "Thứ Bảy - Chủ Nhật", time: "09:00 - 23:00" },
    { day: "Ngày lễ", time: "10:00 - 23:00" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MessageSquare className="w-4 h-4" />
            <span>Hỗ Trợ 24/7</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Liên Hệ Với Chúng Tôi
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Chúng tôi luôn sẵn sàng giúp bạn. Hãy liên hệ với đội ngũ hỗ trợ
            khách hàng của CinemaHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden p-6 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col items-center text-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{info.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form - moved to client component */}
          <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn</h2>
            <ContactFormClient />
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Working Hours */}
            <Card className="p-8 border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Giờ Làm Việc
                </h2>
              </div>

              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b border-border/50 last:border-0"
                  >
                    <span className="font-medium text-foreground">
                      {schedule.day}
                    </span>
                    <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                      {schedule.time}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50 flex items-start gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  Đội ngũ hỗ trợ khách hàng của chúng tôi thường phản hồi trong vòng <span className="font-semibold text-foreground">24 giờ</span> làm việc.
                </p>
              </div>
            </Card>

            {/* FAQ Accordion */}
            <Card className="p-8 border border-border/50 bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Câu Hỏi Thường Gặp
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Cách đặt vé phim trên CinemaHub?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Để đặt vé phim, bạn chỉ cần:
                    <br />
                    1. Chọn phim và suất chiếu mong muốn
                    <br />
                    2. Chọn ghế ngồi trên sơ đồ chỗ ngồi
                    <br />
                    3. Chọn đồ ăn và thức uống (tùy chọn)
                    <br />
                    4. Điền thông tin thanh toán và hoàn tất đặt vé
                    <br />
                    Bạn sẽ nhận được mã QR để vào rạp ngay lập tức.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Chính sách hoàn tiền như thế nào?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    • Hoàn tiền 100% nếu hủy vé trước 2 giờ chiếu
                    <br />• Hoàn tiền 50% nếu hủy vé từ 2 giờ đến 30 phút trước
                    chiếu
                    <br />• Không hoàn tiền nếu hủy trong vòng 30 phút trước
                    chiếu
                    <br />• Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Thanh toán an toàn như thế nào?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    CinemaHub sử dụng các phương thức thanh toán bảo mật cao:
                    <br />• Thanh toán qua thẻ tín dụng/ghi nợ (Visa,
                    Mastercard)
                    <br />• Ví điện tử (MoMo, ZaloPay, ViettelPay)
                    <br />• Chuyển khoản ngân hàng
                    <br />
                    Tất cả giao dịch đều được mã hóa SSL 256-bit và tuân thủ PCI
                    DSS.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Làm thế nào để quản lý tài khoản?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Trong tài khoản của bạn, bạn có thể:
                    <br />• Xem lịch sử đặt vé và đơn hàng
                    <br />• Cập nhật thông tin cá nhân
                    <br />• Quản lý phương thức thanh toán
                    <br />• Nhận thông báo về khuyến mãi và phim mới
                    <br />• Đổi mật khẩu và cài đặt bảo mật
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Có thể đặt vé cho nhiều người cùng lúc không?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Có, CinemaHub cho phép đặt tối đa 8 vé trong một đơn hàng.
                    Bạn có thể chọn nhiều ghế liên tiếp hoặc riêng lẻ. Mỗi vé sẽ
                    có mã QR riêng để thuận tiện cho việc kiểm soát.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    Chính sách đổi/trả vé như thế nào?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    • Đổi suất chiếu: Miễn phí đổi trước 2 giờ chiếu
                    <br />• Đổi phim: Phí đổi 20.000đ/vé, trước 24 giờ chiếu
                    <br />• Đổi ghế: Miễn phí đổi tại quầy trước giờ chiếu 30
                    phút
                    <br />• Không áp dụng đổi/trả cho vé đã sử dụng hoặc quá
                    thời hạn
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Social Media */}
            <Card className="p-8 border border-border/50 bg-card/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Theo Dõi Chúng Tôi
              </h2>
              <div className="flex gap-4">
                {["f", "𝕏", "📷", "▶"].map((icon, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-xl">{icon}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 text-center text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-white/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-white/20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Cần Hỗ Trợ Ngay Lập Tức?</h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 font-light">
              Hãy gọi đến số hotline của chúng tôi hoặc chat với đội hỗ trợ trực
              tuyến
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg h-12 px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Gọi Ngay: 1900 1234
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-primary font-bold h-12 px-8"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat Trực Tuyến
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
