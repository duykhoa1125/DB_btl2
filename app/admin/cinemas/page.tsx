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
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-1 md:flex-row backdrop-blur-xl shadow-sm">
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            className="w-full"
          />
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCinemas.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
              <Film className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy rạp nào</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc thêm rạp mới.
            </p>
          </div>
        ) : (
          filteredCinemas.map((cinema) => (
            <div
              key={cinema.cinema_id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
            >
              {/* Decorative Header Image/Gradient */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-accent/10 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-background/20 backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Film className="w-8 h-8 text-primary/80" />
                  </div>
                </div>
                
                {/* Tech lines decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {cinema.name}
                  </h3>
                  <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" />
                    <p className="line-clamp-2 leading-relaxed">
                      {cinema.address}
                    </p>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-border/50" />

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 h-10 rounded-lg border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium"
                  >
                    <Link href={`/admin/cinemas/${cinema.cinema_id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(cinema)}
                    className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
