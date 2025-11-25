"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCinema } from "@/lib/admin-helpers";
import type { Cinema } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const FACILITY_OPTIONS = [
  "IMAX",
  "4DX",
  "Dolby Atmos",
  "ScreenX",
  "IMAX Laser",
  "Dolby 7.1",
  "Ghế Massage",
  "Ghế VIP",
  "Ghế Sweetbox",
  "Ghế đôi",
  "Khu vui chơi trẻ em",
  "Nhà hàng",
  "Cà phê",
  "Trà sữa",
  "Wifi miễn phí",
];

export default function NewCinemaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cinemaName: "",
    address: "",
    city: "",
    numberOfRooms: "",
    description: "",
    imageUrl: "",
    facilities: [] as string[],
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFacilityToggle = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cinemaName.trim())
      newErrors.cinemaName = "Cinema name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.imageUrl.trim())
      newErrors.imageUrl = "Image URL is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    const rooms = Number(formData.numberOfRooms);
    if (!formData.numberOfRooms || rooms <= 0)
      newErrors.numberOfRooms = "Number of rooms must be greater than 0";

    // Phone validation (Vietnamese phone number format)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number format";
    }

    if (formData.facilities.length === 0)
      newErrors.facilities = "At least one facility is required";

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
      const cinemaData: Omit<Cinema, "cinemaId"> = {
        cinemaName: formData.cinemaName,
        address: formData.address,
        city: formData.city,
        numberOfRooms: Number(formData.numberOfRooms),
        description: formData.description,
        imageUrl: formData.imageUrl,
        facilities: formData.facilities,
        phone: formData.phone,
      };

      createCinema(cinemaData);

      toast({
        title: "Success",
        description: "Cinema created successfully",
      });

      router.push("/admin/cinemas");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cinema",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-4xl font-bold">Create New Cinema</h1>
          <p className="text-muted-foreground">Add a new cinema location</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cinema Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cinema Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.cinemaName}
                onChange={(e) =>
                  setFormData({ ...formData, cinemaName: e.target.value })
                }
                placeholder="CinemaHub - Quận 1"
              />
              {errors.cinemaName && (
                <p className="text-sm text-destructive">{errors.cinemaName}</p>
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
                placeholder="123 Nguyễn Huệ, Quận 1"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                City <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="TP. Hồ Chí Minh"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="028 3822 5678"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Number of Rooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of Rooms <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={formData.numberOfRooms}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfRooms: e.target.value })
                }
                placeholder="8"
                min="1"
              />
              {errors.numberOfRooms && (
                <p className="text-sm text-destructive">{errors.numberOfRooms}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter cinema description..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Image URL <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/photo-..."
              />
              {errors.imageUrl && (
                <p className="text-sm text-destructive">{errors.imageUrl}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Facilities <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FACILITY_OPTIONS.map((facility) => (
                  <Button
                    key={facility}
                    type="button"
                    variant={
                      formData.facilities.includes(facility)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleFacilityToggle(facility)}
                  >
                    {facility}
                  </Button>
                ))}
              </div>
              {errors.facilities && (
                <p className="text-sm text-destructive">{errors.facilities}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/cinemas">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Cinema"}
          </Button>
        </div>
      </form>
    </div>
  );
}
