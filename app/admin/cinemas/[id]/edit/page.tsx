"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCinemaById, updateCinema } from "@/lib/admin-helpers";
import type { Cinema } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    cinemaName: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cinema_id = params.id as string;
    const cinema = getCinemaById(cinema_id);

    if (!cinema) {
      toast({
        title: "Error",
        description: "Cinema not found",
        variant: "destructive",
      });
      router.push("/admin/cinemas");
      return;
    }

    setFormData({
      cinemaName: cinema.cinemaName,
      address: cinema.address,
    });
    setIsLoading(false);
  }, [params.id, router, toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cinemaName.trim())
      newErrors.cinemaName = "Cinema name is required";
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
        cinemaName: formData.cinemaName,
        address: formData.address,
      };

      updateCinema(cinema_id, updates);

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
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cinema Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.cinemaName}
                onChange={(e) =>
                  setFormData({ ...formData, cinemaName: e.target.value })
                }
              />
              {errors.cinemaName && (
                <p className="text-sm text-destructive">{errors.cinemaName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/cinemas">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
