"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMovieById, updateMovie } from "@/lib/admin-helpers";
import type { Movie } from "@/lib/mock-data";
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

const GENRE_OPTIONS = [
  "Hành động",
  "Drama",  
  "Viễn tưởng",
  "Phiêu lưu",
  "Tội phạm",
  "Tâm lý",
  "Lãng mạn",
  "Lịch sử",
  "Kinh dị",
  "Hài",
];

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    status: "Now Showing" as "Now Showing" | "Coming Soon",
    producer: "",
    director: "",
    actors: "",
    genres: [] as string[],
    duration: "",
    releaseYear: "",
    rating: "",
    trailerUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const movie_id = params.id as string;
    const movie = getMovieById(movie_id);

    if (!movie) {
      toast({
        title: "Error",
        description: "Movie not found",
        variant: "destructive",
      });
      router.push("/admin/movies");
      return;
    }

    setFormData({
      title: movie.title,
      description: movie.description,
      image: movie.image,
      status: movie.status,
      producer: movie.producer,
      director: movie.director,
      actors: movie.actors.join(", "),
      genres: movie.genres,
      duration: movie.duration.toString(),
      releaseYear: movie.releaseYear.toString(),
      rating: movie.rating.toString(),
      trailerUrl: movie.trailerUrl || "",
    });
    setIsLoading(false);
  }, [params.id, router, toast]);

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    if (!formData.producer.trim()) newErrors.producer = "Producer is required";
    if (!formData.director.trim()) newErrors.director = "Director is required";
    if (!formData.actors.trim()) newErrors.actors = "Actors are required";
    if (formData.genres.length === 0)
      newErrors.genres = "At least one genre is required";

    const duration = Number(formData.duration);
    if (!formData.duration || duration <= 0)
      newErrors.duration = "Duration must be greater than 0";

    const year = Number(formData.releaseYear);
    if (!formData.releaseYear || year < 1900 || year > 2030)
      newErrors.releaseYear = "Release year must be between 1900 and 2030";

    const rating = Number(formData.rating);
    if (!formData.rating || rating < 0 || rating > 10)
      newErrors.rating = "Rating must be between 0 and 10";

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
        title: formData.title,
        description: formData.description,
        image: formData.image,
        status: formData.status,
        producer: formData.producer,
        director: formData.director,
        actors: formData.actors.split(",").map((a) => a.trim()),
        genres: formData.genres,
        duration: Number(formData.duration),
        releaseYear: Number(formData.releaseYear),
        rating: Number(formData.rating),
        trailerUrl: formData.trailerUrl,
      };

      updateMovie(movie_id, updates);

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
          <p className="text-muted-foreground">Update movie information</p>
        </div>
      </div>

      {/* Form - Same as create form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Poster Image URL <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: "Now Showing" | "Coming Soon") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Now Showing">Now Showing</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Producer <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.producer}
                onChange={(e) =>
                  setFormData({ ...formData, producer: e.target.value })
                }
              />
              {errors.producer && (
                <p className="text-sm text-destructive">{errors.producer}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Director <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.director}
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
              />
              {errors.director && (
                <p className="text-sm text-destructive">{errors.director}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Actors (comma-separated) <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.actors}
                onChange={(e) =>
                  setFormData({ ...formData, actors: e.target.value })
                }
              />
              {errors.actors && (
                <p className="text-sm text-destructive">{errors.actors}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Genres <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant={
                      formData.genres.includes(genre) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
              {errors.genres && (
                <p className="text-sm text-destructive">{errors.genres}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Release Year <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseYear: e.target.value })
                  }
                  min="1900"
                  max="2030"
                />
                {errors.releaseYear && (
                  <p className="text-sm text-destructive">{errors.releaseYear}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rating (0-10) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  min="0"
                  max="10"
                />
                {errors.rating && (
                  <p className="text-sm text-destructive">{errors.rating}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trailer URL (YouTube Embed)</label>
              <Input
                value={formData.trailerUrl}
                onChange={(e) =>
                  setFormData({ ...formData, trailerUrl: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

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
