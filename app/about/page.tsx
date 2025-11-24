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
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-lg text-muted-foreground">
            Chúng tôi luôn sẵn sàng giúp bạn. Hãy liên hệ với đội ngũ hỗ trợ
            khách hàng của CinemaHub.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">{info.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {info.title}
                  </h3>
                  <p className="text-muted-foreground">{info.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form - moved to client component */}
          <ContactFormClient />

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Working Hours */}
            <Card className="p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-foreground">
                  Giờ Làm Việc
                </h2>
              </div>

              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                  >
                    <span className="font-medium text-foreground">
                      {schedule.day}
                    </span>
                    <Badge variant="outline" className="text-muted-foreground">
                      {schedule.time}
                    </Badge>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                ❗Đội hỗ trợ khách hàng sẽ phản hồi trong vòng 24 giờ
              </p>
            </Card>

            {/* FAQ Accordion */}
            <Card className="p-8 border border-border bg-linear-to-br from-red-50 to-transparent">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Câu Hỏi Thường Gặp
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
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

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
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

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
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

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
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

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Có thể đặt vé cho nhiều người cùng lúc không?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Có, CinemaHub cho phép đặt tối đa 8 vé trong một đơn hàng.
                    Bạn có thể chọn nhiều ghế liên tiếp hoặc riêng lẻ. Mỗi vé sẽ
                    có mã QR riêng để thuận tiện cho việc kiểm soát.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
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
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Theo Dõi Chúng Tôi
              </h2>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-100"
                >
                  <span className="text-xl">f</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-100"
                >
                  <span className="text-xl">𝕏</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-100"
                >
                  <span className="text-xl">📷</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-100"
                >
                  <span className="text-xl">▶</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-linear-to-r from-red-600 to-red-700 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Cần Hỗ Trợ Ngay Lập Tức?</h2>
          <p className="text-lg mb-8 text-red-100">
            Hãy gọi đến số hotline của chúng tôi hoặc chat với đội hỗ trợ trực
            tuyến
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-red-600 hover:bg-gray-100 border-white"
            >
              <Phone className="w-5 h-5 mr-2" />
              Gọi Ngay: 1900 1234
            </Button>
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat Trực Tuyến
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
