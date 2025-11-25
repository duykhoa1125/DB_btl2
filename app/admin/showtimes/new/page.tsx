"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShowtime, getAllMovies, getAllCinemas } from "@/lib/admin-helpers";
import type { Showtime } from "@/lib/mock-data";
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
import { ArrowLeft, Film, MapPin } from "lucide-react";
import Link from "next/link";

export default function NewShowtimePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "",
    startTime: "",
    endTime: "",
    room: "",
    ticketPrice: "",
    status: "Available" as Showtime["status"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const movies = getAllMovies();
  const cinemas = getAllCinemas();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.movieId) newErrors.movieId = "Movie is required";
    if (!formData.cinemaId) newErrors.cinemaId = "Cinema is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.room.trim()) newErrors.room = "Room is required";

    const price = Number(formData.ticketPrice);
    if (!formData.ticketPrice || price <= 0)
      newErrors.ticketPrice = "Price must be greater than 0";

    // Validate start time < end time
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Validate start time is in the future
    if (formData.startTime) {
      const start = new Date(formData.startTime);
      const now = new Date();
      if (start < now) {
        newErrors.startTime = "Start time must be in the future";
      }
    }

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
      const showtimeData: Omit<Showtime, "showtimeId"> = {
        movieId: formData.movieId,
        cinemaId: formData.cinemaId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        ticketPrice: Number(formData.ticketPrice),
        status: formData.status,
      };

      createShowtime(showtimeData);

      toast({
        title: "Success",
        description: "Showtime created successfully",
      });

      router.push("/admin/showtimes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create showtime",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMovie = movies.find((m) => m.movieId === formData.movieId);
  const selectedCinema = cinemas.find((c) => c.cinemaId === formData.cinemaId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/showtimes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold">Create New Showtime</h1>
          <p className="text-muted-foreground">
            Add a new showtime connecting a movie to a cinema
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Select Movie & Cinema
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This showtime connects a movie to a specific cinema location
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Movie Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Movie <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.movieId}
                onValueChange={(value) =>
                  setFormData({ ...formData, movieId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.movieId} value={movie.movieId}>
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>
                          {movie.title} ({movie.releaseYear})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.movieId && (
                <p className="text-sm text-destructive">{errors.movieId}</p>
              )}
              {selectedMovie && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm">
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedMovie.title} • {selectedMovie.duration} min •{" "}
                    {selectedMovie.genres.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Cinema Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cinema <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.cinemaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, cinemaId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cinema" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.cinemaId} value={cinema.cinemaId}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{cinema.cinemaName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cinemaId && (
                <p className="text-sm text-destructive">{errors.cinemaId}</p>
              )}
              {selectedCinema && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm">
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedCinema.cinemaName} • {selectedCinema.address}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime}</p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-destructive">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime}</p>
                )}
                {selectedMovie && formData.startTime && (
                  <p className="text-xs text-muted-foreground">
                    Suggested end time based on movie duration:{" "}
                    {new Date(
                      new Date(formData.startTime).getTime() +
                        selectedMovie.duration * 60000
                    ).toLocaleString("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Room */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Room <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                placeholder="Room 1"
              />
              {errors.room && (
                <p className="text-sm text-destructive">{errors.room}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Ticket Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ticket Price (VNĐ) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.ticketPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketPrice: e.target.value })
                  }
                  placeholder="80000"
                  min="0"
                  step="1000"
                />
                {errors.ticketPrice && (
                  <p className="text-sm text-destructive">{errors.ticketPrice}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Showtime["status"]) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold_Out">Sold Out</SelectItem>
                    <SelectItem value="Coming_Soon">Coming Soon</SelectItem>
                    <SelectItem value="Now_Showing">Now Showing</SelectItem>
                    <SelectItem value="Ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedMovie && selectedCinema && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Showtime Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Movie:</span> {selectedMovie.title}
              </p>
              <p>
                <span className="font-medium">Cinema:</span>{" "}
                {selectedCinema.cinemaName}
              </p>
              {formData.startTime && (
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(formData.startTime).toLocaleString("vi-VN")}
                </p>
              )}
              {formData.room && (
                <p>
                  <span className="font-medium">Room:</span> {formData.room}
                </p>
              )}
              {formData.ticketPrice && (
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  {Number(formData.ticketPrice).toLocaleString("vi-VN")} VNĐ
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/showtimes">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Showtime"}
          </Button>
        </div>
      </form>
    </div>
  );
}
