"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import adminService from "@/services/adminService";
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
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function NewMoviePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    synopsis: "",
    image: "",
    status: "showing" as "showing" | "upcoming" | "ended",
    duration: "",
    release_date: "",
    end_date: "",
    age_rating: "",
    language: "en" as "en" | "vi" | "ko" | "ja",
    trailer: "",
  });
  const [directors, setDirectors] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [newDirector, setNewDirector] = useState("");
  const [newActor, setNewActor] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddDirector = () => {
    if (newDirector.trim() && !directors.includes(newDirector.trim())) {
      setDirectors([...directors, newDirector.trim()]);
      setNewDirector("");
    }
  };

  const handleRemoveDirector = (index: number) => {
    setDirectors(directors.filter((_, i) => i !== index));
  };

  const handleAddActor = () => {
    if (newActor.trim() && !actors.includes(newActor.trim())) {
      setActors([...actors, newActor.trim()]);
      setNewActor("");
    }
  };

  const handleRemoveActor = (index: number) => {
    setActors(actors.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.synopsis.trim()) newErrors.synopsis = "Synopsis is required";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";

    const duration = Number(formData.duration);
    if (!formData.duration || duration <= 0)
      newErrors.duration = "Duration must be greater than 0";

    if (!formData.release_date)
      newErrors.release_date = "Release date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    // Validate end_date > release_date
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
      const movieData: Omit<Movie, "movie_id"> = {
        name: formData.name,
        synopsis: formData.synopsis,
        image: formData.image,
        status: formData.status,
        duration: Number(formData.duration),
        release_date: formData.release_date,
        end_date: formData.end_date,
        age_rating: Number(formData.age_rating) || 0,
        language: formData.language,
        trailer: formData.trailer || null,
      };

      await adminService.createMovie(movieData, directors, actors);

      toast({
        title: "Success",
        description: "Movie created successfully",
      });

      router.push("/admin/movies");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create movie",
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
          <Link href="/admin/movies">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">Create New Movie</h1>
          <p className="text-muted-foreground">Add a new movie to the system</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-2xl border-border/60 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                placeholder="Dune: Part Two"
                className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
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
                placeholder="Enter movie synopsis..."
                rows={4}
                className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all resize-none rounded-xl"
              />
              {errors.synopsis && (
                <p className="text-sm text-destructive">{errors.synopsis}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Image URL <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/movie-poster.jpg"
                className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
              />
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a valid URL for the movie poster image
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                  <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl">
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
                  <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl">
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

        <Card className="rounded-2xl border-border/60 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
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
                  placeholder="166"
                  min="1"
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
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
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
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
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
                />
                {errors.end_date && (
                  <p className="text-sm text-destructive">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                  placeholder="13"
                  min="0"
                  max="18"
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
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
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cast & Crew */}
        <Card className="rounded-2xl border-border/60 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Cast & Crew</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Directors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Directors</label>
              <div className="flex gap-2">
                <Input
                  value={newDirector}
                  onChange={(e) => setNewDirector(e.target.value)}
                  placeholder="Enter director name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDirector();
                    }
                  }}
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
                />
                <Button type="button" onClick={handleAddDirector} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {directors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {directors.map((director, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 h-8 px-3 rounded-lg">
                      {director}
                      <button
                        type="button"
                        onClick={() => handleRemoveDirector(index)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Actors</label>
              <div className="flex gap-2">
                <Input
                  value={newActor}
                  onChange={(e) => setNewActor(e.target.value)}
                  placeholder="Enter actor name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActor();
                    }
                  }}
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
                />
                <Button type="button" onClick={handleAddActor} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {actors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {actors.map((actor, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 h-8 px-3 rounded-lg">
                      {actor}
                      <button
                        type="button"
                        onClick={() => handleRemoveActor(index)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" asChild className="h-11 px-8 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all">
            <Link href="/admin/movies">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            {isSubmitting ? "Creating..." : "Create Movie"}
          </Button>
        </div>
      </form>
    </div>
  );
}
