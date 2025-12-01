"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import adminService from "@/services/adminService";
import { movieService } from "@/services";
import type { Movie } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalMovie, setOriginalMovie] = useState<string>(""); // Store original movie name for display
  const [formData, setFormData] = useState({
    name: "",
    synopsis: "",
    // image removed
    status: "showing" as "showing" | "upcoming" | "ended",
    duration: "",
    release_date: "",
    end_date: "",
    age_rating: "",
    language: "en" as "en" | "vi" | "ko" | "ja",
    trailer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to convert ISO date to YYYY-MM-DD format
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const movie_id = params.id as string;

    const fetchMovie = async () => {
      try {
        const movie = await movieService.getById(movie_id);

        if (!movie) {
          toast({
            title: "Error",
            description: "Movie not found",
            variant: "destructive",
          });
          router.push("/admin/movies");
          return;
        }

        setOriginalMovie(movie.name);
        setFormData({
          name: movie.name,
          synopsis: movie.synopsis || "",
          // image removed
          status: movie.status,
          duration: movie.duration.toString(),
          release_date: formatDateForInput(movie.release_date),
          end_date: formatDateForInput(movie.end_date),
          age_rating: movie.age_rating.toString(),
          language: movie.language as "en" | "vi" | "ko" | "ja",
          trailer: movie.trailer || "",
        });
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details",
          variant: "destructive",
        });
        router.push("/admin/movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [params.id, router, toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.synopsis.trim()) newErrors.synopsis = "Synopsis is required";
    // image validation removed

    const duration = Number(formData.duration);
    if (!formData.duration || duration <= 0)
      newErrors.duration = "Duration must be greater than 0";

    if (!formData.release_date)
      newErrors.release_date = "Release date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (formData.release_date && formData.end_date) {
      if (formData.end_date <= formData.release_date) {
        newErrors.end_date = "End date must be after release date";
      }
    }

    const ageRating = Number(formData.age_rating);
    if (formData.age_rating && (ageRating < 0 || ageRating > 18))
      newErrors.age_rating = "Age rating must be between 0 and 18";

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
      const movie_id = params.id as string;
      const updates: Partial<Omit<Movie, "movie_id">> = {
        name: formData.name,
        synopsis: formData.synopsis,
        // image removed
        status: formData.status,
        duration: Number(formData.duration),
        release_date: formData.release_date,
        end_date: formData.end_date,
        age_rating: Number(formData.age_rating) || 0,
        language: formData.language,
        trailer: formData.trailer || null,
      };

      await adminService.updateMovie(movie_id, updates);

      toast({
        title: "Success",
        description: "Movie updated successfully",
      });

      router.push("/admin/movies");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update movie",
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
          <Link href="/admin/movies">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">Edit Movie</h1>
          <p className="text-muted-foreground">
            {originalMovie
              ? `Editing: ${originalMovie}`
              : "Update movie information"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Movie Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Synopsis <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.synopsis}
                onChange={(e) =>
                  setFormData({ ...formData, synopsis: e.target.value })
                }
                rows={4}
              />
              {errors.synopsis && (
                <p className="text-sm text-destructive">{errors.synopsis}</p>
              )}
            </div>

            {/* Image URL Removed */}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "showing" | "upcoming" | "ended") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="showing">Showing</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Language <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.language}
                  onValueChange={(value: "en" | "vi" | "ko" | "ja") =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration (minutes) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  min="1"
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration}</p>
                )}
              </div>

              {/* Release Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Release Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.release_date}
                  onChange={(e) =>
                    setFormData({ ...formData, release_date: e.target.value })
                  }
                />
                {errors.release_date && (
                  <p className="text-sm text-destructive">
                    {errors.release_date}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
                {errors.end_date && (
                  <p className="text-sm text-destructive">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Age Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Age Rating (0, 13, 16, 18)
                </label>
                <Input
                  type="number"
                  value={formData.age_rating}
                  onChange={(e) =>
                    setFormData({ ...formData, age_rating: e.target.value })
                  }
                  min="0"
                  max="18"
                />
                {errors.age_rating && (
                  <p className="text-sm text-destructive">
                    {errors.age_rating}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  0 = All ages, 13+ = Teen, 16+ = Mature, 18+ = Adult
                </p>
              </div>

              {/* Trailer URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Trailer URL (YouTube)
                </label>
                <Input
                  value={formData.trailer}
                  onChange={(e) =>
                    setFormData({ ...formData, trailer: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/movies">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
