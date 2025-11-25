"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getAllShowtimes,
  getAllMovies,
  getAllCinemas,
  deleteShowtime,
} from "@/lib/admin-helpers";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react";

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>(getAllShowtimes());
  const [searchTerm, setSearchTerm] = useState("");
  const [movieFilter, setMovieFilter] = useState<string>("all");
  const [cinemaFilter, setCinemaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
  const { toast } = useToast();

  const movies = getAllMovies();
  const cinemas = getAllCinemas();

  // Filter showtimes
  const filteredShowtimes = showtimes.filter((showtime) => {
    const movie = movies.find((m) => m.movieId === showtime.movieId);
    const cinema = cinemas.find((c) => c.cinemaId === showtime.cinemaId);

    const matchesSearch =
      movie?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema?.cinemaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMovie =
      movieFilter === "all" || showtime.movieId === movieFilter;
    const matchesCinema =
      cinemaFilter === "all" || showtime.cinemaId === cinemaFilter;
    const matchesStatus =
      statusFilter === "all" || showtime.status === statusFilter;

    return matchesSearch && matchesMovie && matchesCinema && matchesStatus;
  });

  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (showtimeToDelete) {
      const success = deleteShowtime(showtimeToDelete.showtimeId);
      if (success) {
        setShowtimes(getAllShowtimes());
        toast({
          title: "Showtime deleted",
          description: "Showtime has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete showtime.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setShowtimeToDelete(null);
  };

  const getMovieName = (movieId: string) => {
    return movies.find((m) => m.movieId === movieId)?.title || "Unknown";
  };

  const getCinemaName = (cinemaId: string) => {
    return (
      cinemas.find((c) => c.cinemaId === cinemaId)?.cinemaName || "Unknown"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Showtimes Management</h1>
          <p className="text-muted-foreground">
            Manage movie showtimes across all cinemas
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/showtimes/new">
            <Plus className="h-4 w-4" />
            Add Showtime
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search showtimes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={movieFilter} onValueChange={setMovieFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by movie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Movies</SelectItem>
            {movies.slice(0, 10).map((movie) => (
              <SelectItem key={movie.movieId} value={movie.movieId}>
                {movie.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cinemaFilter} onValueChange={setCinemaFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by cinema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cinemas</SelectItem>
            {cinemas.map((cinema) => (
              <SelectItem key={cinema.cinemaId} value={cinema.cinemaId}>
                {cinema.cinemaName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Sold_Out">Sold Out</SelectItem>
            <SelectItem value="Coming_Soon">Coming Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Showtimes Table */}
      <div className="rounded-lg border border-border/50 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-left text-sm font-medium">Movie</th>
                <th className="p-4 text-left text-sm font-medium">Cinema</th>
                <th className="p-4 text-left text-sm font-medium">Date & Time</th>
                <th className="p-4 text-left text-sm font-medium">Room</th>
                <th className="p-4 text-left text-sm font-medium">Price</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShowtimes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground"
                  >
                    No showtimes found
                  </td>
                </tr>
              ) : (
                filteredShowtimes.map((showtime) => (
                  <tr
                    key={showtime.showtimeId}
                    className="border-b border-border/50 transition-colors hover:bg-card/50"
                  >
                    <td className="p-4">
                      <p className="font-medium">{getMovieName(showtime.movieId)}</p>
                    </td>
                    <td className="p-4 text-sm">
                      {getCinemaName(showtime.cinemaId)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">
                            {new Date(showtime.startTime).toLocaleDateString("vi-VN")}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{showtime.room}</td>
                    <td className="p-4">
                      <p className="font-medium">
                        {showtime.ticketPrice.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          showtime.status === "Available"
                            ? "default"
                            : showtime.status === "Sold_Out"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {showtime.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/showtimes/${showtime.showtimeId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(showtime)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredShowtimes.length} of {showtimes.length} showtimes
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this showtime. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
