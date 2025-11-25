"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllMovies, deleteMovie } from "@/lib/admin-helpers";
import type { Movie } from "@/lib/mock-data";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>(getAllMovies());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const { toast } = useToast();

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genres.some((g) =>
          g.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.releaseYear - a.releaseYear;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      const success = deleteMovie(movieToDelete.movieId);
      if (success) {
        setMovies(getAllMovies());
        toast({
          title: "Movie deleted",
          description: `"${movieToDelete.title}" has been deleted successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete movie.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Movies Management</h1>
          <p className="text-muted-foreground">
            Manage all movies in the system
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/movies/new">
            <Plus className="h-4 w-4" />
            Add Movie
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, director, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Now Showing">Now Showing</SelectItem>
            <SelectItem value="Coming Soon">Coming Soon</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title (A-Z)</SelectItem>
            <SelectItem value="year">Release Year</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movies Table */}
      <div className="rounded-lg border border-border/50 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-4 text-left text-sm font-medium">Poster</th>
                <th className="p-4 text-left text-sm font-medium">Title</th>
                <th className="p-4 text-left text-sm font-medium">Director</th>
                <th className="p-4 text-left text-sm font-medium">Genres</th>
                <th className="p-4 text-left text-sm font-medium">Duration</th>
                <th className="p-4 text-left text-sm font-medium">Rating</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    No movies found
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr
                    key={movie.movieId}
                    className="border-b border-border/50 transition-colors hover:bg-card/50"
                  >
                    <td className="p-4">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="h-20 w-14 rounded object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {movie.releaseYear}
                      </p>
                    </td>
                    <td className="p-4 text-sm">{movie.director}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {movie.genres.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{movie.genres.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{movie.duration} min</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{movie.rating}</span>
                        <span className="text-xs text-muted-foreground">/10</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          movie.status === "Now Showing" ? "default" : "secondary"
                        }
                      >
                        {movie.status}
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
                          <Link href={`/movie/${movie.movieId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/movies/${movie.movieId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(movie)}
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
        Showing {filteredMovies.length} of {movies.length} movies
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{movieToDelete?.title}&quot;. This
              action cannot be undone.
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
