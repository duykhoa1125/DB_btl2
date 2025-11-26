"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getShowtimeById,
  updateShowtime,
  getAllMovies,
} from "@/lib/admin-helpers";
import type { Showtime, Room } from "@/services/types";
import { roomService } from "@/services";
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
import { ArrowLeft, Film, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditShowtimePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    movie_id: "",
    room_id: "",
    start_date: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const movies = getAllMovies();

  useEffect(() => {
    roomService.getAll().then(setRooms).catch(console.error);
    const showtime_id = params.id as string;
    const showtime = getShowtimeById(showtime_id);

    if (!showtime) {
      toast({
        title: "Error",
        description: "Showtime not found",
        variant: "destructive",
      });
      router.push("/admin/showtimes");
      return;
    }

    setFormData({
      movie_id: showtime.movie_id,
      room_id: showtime.room_id,
      start_date: showtime.start_date,
      start_time: showtime.start_time,
      end_time: showtime.end_time,
    });
    setIsLoading(false);
  }, [params.id, router, toast]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.movie_id) newErrors.movie_id = "Movie is required";
    if (!formData.room_id) newErrors.room_id = "Room is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = "End time must be after start time";
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
      const showtime_id = params.id as string;
      const updates: Partial<Omit<Showtime, "showtime_id">> = {
        movie_id: formData.movie_id,
        room_id: formData.room_id,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      };

      updateShowtime(showtime_id, updates);

      toast({
        title: "Success",
        description: "Showtime updated successfully",
      });

      router.push("/admin/showtimes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update showtime",
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

  const selectedMovie = movies.find((m) => m.movie_id === formData.movie_id);
  const selectedRoom = rooms.find((r) => r.room_id === formData.room_id);

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
          <h1 className="text-4xl font-bold">Edit Showtime</h1>
          <p className="text-muted-foreground">Update showtime information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Movie & Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Movie Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Movie <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.movie_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, movie_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.movie_id} value={movie.movie_id}>
                      {movie.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.movie_id && (
                <p className="text-sm text-destructive">{errors.movie_id}</p>
              )}
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Room <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.room_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, room_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.room_id} value={room.room_id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.room_id && (
                <p className="text-sm text-destructive">{errors.room_id}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
                {errors.start_time && (
                  <p className="text-sm text-destructive">{errors.start_time}</p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-destructive">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
                {errors.end_time && (
                  <p className="text-sm text-destructive">{errors.end_time}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedMovie && selectedRoom && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Current Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Movie:</span> {selectedMovie.name}
              </p>
              <p>
                <span className="font-medium">Room:</span> {selectedRoom.name}
              </p>
              {formData.start_date && formData.start_time && (
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(
                    `${formData.start_date}T${formData.start_time}`
                  ).toLocaleString("vi-VN")}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/showtimes">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
