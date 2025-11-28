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
  Facebook,
  Twitter,
  Instagram,
  Youtube,
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
      action: "Chỉ đường",
      href: "#map",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      content: "1900 1234 (ext. 123)",
      action: "Gọi ngay",
      href: "tel:19001234",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "support@cinemahub.vn",
      action: "Gửi mail",
      href: "mailto:support@cinemahub.vn",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Zalo/Messenger",
      content: "@CinemaHub.VN",
      action: "Chat ngay",
      href: "#",
    },
  ];

  const workingHours = [
    { day: "Thứ Hai - Thứ Sáu", time: "08:00 - 22:00" },
    { day: "Thứ Bảy - Chủ Nhật", time: "09:00 - 23:00" },
    { day: "Ngày lễ", time: "10:00 - 23:00" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "text-blue-600" },
    { icon: Twitter, href: "#", color: "text-sky-500" },
    { icon: Instagram, href: "#", color: "text-pink-600" },
    { icon: Youtube, href: "#", color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MessageSquare className="w-4 h-4" />
            <span>Hỗ Trợ 24/7</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Liên Hệ Với Chúng Tôi
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. 
            Hãy kết nối với CinemaHub ngay hôm nay.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden p-6 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col items-center text-center gap-4 h-full justify-between">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                  </div>
                </div>
                
                <Button variant="link" className="text-primary/80 hover:text-primary p-0 h-auto font-medium group-hover:translate-x-1 transition-transform" asChild>
                  <a href={info.href}>{info.action} &rarr;</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 space-y-8">
             <ContactFormClient />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 space-y-6">
             {/* Map Placeholder */}
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-[300px] relative group" id="map">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                 <div className="text-center p-6 space-y-4 z-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold">Bản đồ rạp chiếu</h3>
                    <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                      123 Đường Phim, Quận 1, TP. Hồ Chí Minh
                    </p>
                    <Button variant="outline" className="mt-2 hover:bg-primary hover:text-white">
                      Xem trên Google Maps
                    </Button>
                 </div>
                 {/* Abstract map pattern background */}
                 <div className="absolute inset-0 opacity-10" 
                      style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                 </div>
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Giờ Làm Việc
                  </h2>
                  <p className="text-xs text-muted-foreground">Thời gian hoạt động của rạp</p>
                </div>
              </div>

              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-3 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-foreground text-sm">
                      {schedule.day}
                    </span>
                    <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                      {schedule.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                Theo Dõi Chúng Tôi
              </h2>
              <div className="flex gap-4 justify-between sm:justify-start">
                {socialLinks.map((social, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-xl border-border/50 hover:bg-background hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
                    asChild
                  >
                    <a href={social.href}>
                        <social.icon className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`} />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Câu Hỏi Thường Gặp
                </h2>
                <p className="text-muted-foreground mt-2">Giải đáp những thắc mắc phổ biến nhất</p>
             </div>

            <Card className="border border-border/50 bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {[ 
                    {
                        q: "Cách đặt vé phim trên CinemaHub?",
                        a: "Để đặt vé phim, bạn chỉ cần: \n1. Chọn phim và suất chiếu mong muốn \n2. Chọn ghế ngồi trên sơ đồ chỗ ngồi \n3. Chọn đồ ăn và thức uống (tùy chọn) \n4. Điền thông tin thanh toán và hoàn tất đặt vé. \nBạn sẽ nhận được mã QR để vào rạp ngay lập tức."
                    },
                    {
                        q: "Chính sách hoàn tiền như thế nào?",
                        a: "• Hoàn tiền 100% nếu hủy vé trước 2 giờ chiếu \n• Hoàn tiền 50% nếu hủy vé từ 2 giờ đến 30 phút trước chiếu \n• Không hoàn tiền nếu hủy trong vòng 30 phút trước chiếu \n• Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc"
                    },
                    {
                        q: "Thanh toán an toàn như thế nào?",
                        a: "CinemaHub sử dụng các phương thức thanh toán bảo mật cao: \n• Thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard) \n• Ví điện tử (MoMo, ZaloPay, ViettelPay) \n• Chuyển khoản ngân hàng \nTất cả giao dịch đều được mã hóa SSL 256-bit và tuân thủ PCI DSS."
                    }
                ].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className="border-border/50 px-6">
                        <AccordionTrigger className="text-left py-5 hover:text-primary transition-colors font-medium text-lg">
                            {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line leading-relaxed pb-6">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
                
                <AccordionItem value="item-more" className="border-border/50 px-6 border-none">
                     <AccordionTrigger className="text-left py-5 hover:text-primary transition-colors font-medium text-lg text-primary/80">
                        Xem thêm câu hỏi khác
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        <p>Liên hệ trực tiếp với chúng tôi nếu bạn không tìm thấy câu trả lời.</p>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center text-primary-foreground shadow-2xl">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent mix-blend-multiply" />
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-white/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-white/20 blur-3xl rounded-full animate-pulse delay-1000" />
          
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Cần Hỗ Trợ Ngay Lập Tức?</h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 font-light leading-relaxed">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn túc trực để đảm bảo bạn có trải nghiệm điện ảnh tuyệt vời nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 font-bold shadow-xl h-14 px-8 rounded-xl border-2 border-transparent hover:border-primary transition-all"
              >
                <Phone className="w-5 h-5 mr-2 text-primary" />
                Hotline: 1900 1234
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 font-bold h-14 px-8 rounded-xl backdrop-blur-sm transition-all"
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