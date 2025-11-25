"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, AlertCircle, Send, User, Mail, Phone, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, call your API here
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-primary/5">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative">
        <div className="mb-8 text-center">
          <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold text-transparent">
            Gửi thắc mắc cho chúng tôi
          </h2>
          <p className="mt-2 text-muted-foreground">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
          </p>
        </div>

        {submitStatus === "success" && (
          <Alert className="mb-6 border-green-500/20 bg-green-500/10 text-green-600 animate-in fade-in slide-in-from-top-2">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Cảm ơn bạn! Chúng tôi sẽ liên lạc lại sớm nhất có thể.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert className="mb-6 border-red-500/20 bg-red-500/10 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Có lỗi xảy ra. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-3 top-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                <User className="h-5 w-5" />
              </div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Họ và tên của bạn"
                required
                className="pl-10 h-12 bg-background/50 border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative group">
                <div className="absolute left-3 top-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email liên hệ"
                  required
                  className="pl-10 h-12 bg-background/50 border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="pl-10 h-12 bg-background/50 border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Chủ đề cần hỗ trợ"
                required
                className="pl-10 h-12 bg-background/50 border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-3 text-muted-foreground transition-colors group-focus-within:text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Nội dung chi tiết..."
                required
                rows={5}
                className="pl-10 min-h-[120px] bg-background/50 border-border/50 transition-all focus:border-primary/50 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full h-12 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
              "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
              "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Gửi tin nhắn
                <Send className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
