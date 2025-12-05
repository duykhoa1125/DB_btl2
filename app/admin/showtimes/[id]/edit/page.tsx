"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import adminService from "@/services/adminService";
import { movieService, cinemaService } from "@/services";
import type { Showtime, Room, Cinema } from "@/services/types";
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
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [formData, setFormData] = useState({
    movie_id: "",
    room_id: "",
    start_date: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, moviesData, cinemasData] = await Promise.all([
          roomService.getAll(),
          movieService.getAll(),
          cinemaService.getAll(),
        ]);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setCinemas(Array.isArray(cinemasData) ? cinemasData : []);

        const showtime_id = params.id as string;
        const showtime = await adminService.getShowtimeById(showtime_id);

        setFormData({
          movie_id: showtime.movie_id,
          room_id: showtime.room_id,
          start_date: showtime.start_date,
          start_time: showtime.start_time,
          end_time: showtime.end_time,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Showtime not found",
          variant: "destructive",
        });
        router.push("/admin/showtimes");
      }
    };

    fetchData();
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

      await adminService.updateShowtime(showtime_id, updates);

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

  // Helper to get cinema name from cinema_id
  const getCinemaName = (cinemaId: string) => {
    // Backend returns cinema with 'id' field (from cinema_model.js), not 'cinema_id'
    const cinema = cinemas.find((c: any) => c.cinema_id === cinemaId || c.id === cinemaId);
    return cinema?.name || "";
  };

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
        <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Film className="h-5 w-5" />
              </div>
              Movie & Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
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
                <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room: any) => (
                    <SelectItem key={room.room_id} value={room.room_id}>
                      {room.name} - {getCinemaName(room.cinema_id)}
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Schedule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
              />
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                />
                {errors.start_time && (
                  <p className="text-sm text-destructive">
                    {errors.start_time}
                  </p>
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
                  className="h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
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
          <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader>
              <CardTitle className="text-lg text-primary">Current Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/50">
                <span className="text-muted-foreground">Movie</span>
                <span className="font-semibold text-foreground">{selectedMovie.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/50">
                <span className="text-muted-foreground">Room</span>
                <span className="font-semibold text-foreground">{selectedRoom.name}</span>
              </div>
              {formData.start_date && formData.start_time && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/50">
                  <span className="text-muted-foreground">Start Time</span>
                  <span className="font-semibold text-foreground">
                    {new Date(
                      `${formData.start_date}T${formData.start_time}`
                    ).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" asChild className="h-11 px-8">
            <Link href="/admin/showtimes">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
