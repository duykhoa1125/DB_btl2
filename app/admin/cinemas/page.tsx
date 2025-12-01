"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import adminService from "@/services/adminService";
import type { Cinema } from "@/services/types";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, Film, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSearch } from "@/components/admin/search";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cinemas on mount
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAllCinemas();
        setCinemas(data);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách rạp.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCinemas();
  }, [toast]);

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

  const handleDeleteConfirm = async () => {
    if (cinemaToDelete) {
      try {
        await adminService.deleteCinema(cinemaToDelete.cinema_id);
        // Refresh data
        const data = await adminService.getAllCinemas();
        setCinemas(data);
        toast({
          title: "Đã xóa rạp",
          description: `"${cinemaToDelete.name}" đã được xóa thành công.`,
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa rạp.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setCinemaToDelete(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Rạp chiếu"
        description="Quản lý danh sách các chi nhánh rạp chiếu phim"
        actionLabel="Thêm rạp mới"
        actionLink="/admin/cinemas/new"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:flex-row backdrop-blur-sm">
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          />
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCinemas.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border/50 bg-card/50 p-12 text-center text-muted-foreground">
            Không tìm thấy rạp nào
          </div>
        ) : (
          filteredCinemas.map((cinema) => (
            <div
              key={cinema.cinema_id}
              className="group overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/50"
            >
              {/* Decorative Header */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 group-hover:from-primary/20 transition-colors duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-12 h-12 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                    {cinema.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-4">
                <div className="text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground line-clamp-2">
                    {cinema.address}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 hover:bg-primary/10 hover:text-primary border-border/50"
                  >
                    <Link href={`/admin/cinemas/${cinema.cinema_id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(cinema)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50"
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
        Hiển thị {filteredCinemas.length} / {cinemas.length} rạp
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn rạp &quot;{cinemaToDelete?.name}
              &quot;. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
