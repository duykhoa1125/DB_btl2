"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import adminService from "@/services/adminService";
import type { Cinema } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditCinemaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "active" as "active" | "inactive",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCinema = async () => {
      try {
        const cinema_id = params.id as string;
        const cinema = await adminService.getCinemaById(cinema_id);

        setFormData({
          name: cinema.name,
          address: cinema.address,
          state: cinema.state,
        });
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Cinema not found",
          variant: "destructive",
        });
        router.push("/admin/cinemas");
      }
    };

    fetchCinema();
  }, [params.id, router, toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Cinema name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cinema_id = params.id as string;
      const updates: Partial<Omit<Cinema, "cinema_id">> = {
        name: formData.name,
        address: formData.address,
        state: formData.state,
      };

      await adminService.updateCinema(cinema_id, updates);

      toast({
        title: "Success",
        description: "Cinema updated successfully",
      });

      router.push("/admin/cinemas");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cinema",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/cinemas">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">Edit Cinema</h1>
          <p className="text-muted-foreground">Update cinema information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cinema Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.state}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, state: value })
                }
              >
                <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" asChild className="h-11 px-8">
            <Link href="/admin/cinemas">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
