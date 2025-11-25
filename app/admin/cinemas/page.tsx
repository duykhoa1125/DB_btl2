"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllCinemas, deleteCinema } from "@/lib/admin-helpers";
import type { Cinema } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Film } from "lucide-react";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>(getAllCinemas());
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null);
  const { toast } = useToast();

  // Filter cinemas
  const filteredCinemas = cinemas.filter((cinema) => {
    const matchesSearch =
      cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteClick = (cinema: Cinema) => {
    setCinemaToDelete(cinema);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cinemaToDelete) {
      const success = deleteCinema(cinemaToDelete.cinema_id);
      if (success) {
        setCinemas(getAllCinemas());
        toast({
          title: "Cinema deleted",
          description: `"${cinemaToDelete.name}" has been deleted successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete cinema.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setCinemaToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Cinemas Management</h1>
          <p className="text-muted-foreground">
            Manage all cinema locations in the system
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/cinemas/new">
            <Plus className="h-4 w-4" />
            Add Cinema
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCinemas.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border/50 bg-card p-12 text-center text-muted-foreground">
            No cinemas found
          </div>
        ) : (
          filteredCinemas.map((cinema) => (
            <div
              key={cinema.cinema_id}
              className="group overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:shadow-lg"
            >
              {/* Decorative Header */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
                 <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-12 h-12 text-primary/20" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-foreground">{cinema.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">{cinema.address}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/admin/cinemas/${cinema.cinema_id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(cinema)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredCinemas.length} of {cinemas.length} cinemas
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{cinemaToDelete?.name}&quot;.
              This action cannot be undone.
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
