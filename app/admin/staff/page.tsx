"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { staffService, cinemaService } from "@/services";
import type { Staff } from "@/services/types";
import {
  Plus,
  Users,
  Building2,
  Phone,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSearch } from "@/components/admin/search";

export default function StaffManagementPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  useEffect(() => {
    Promise.all([
      staffService.getAll(),
      cinemaService.getAll()
    ]).then(([staffsData, cinemasData]) => {
      setStaffs(staffsData);
      setCinemas(cinemasData);
    }).catch(console.error);
  }, []);

  // Form state
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    phone_number: "",
    cinema_id: "",
    manage_id: null,
  });

  // Filter staffs
  const filteredStaffs = staffs.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone_number.includes(searchTerm);

    const matchesCinema =
      selectedCinema === "all" || staff.cinema_id === selectedCinema;

    return matchesSearch && matchesCinema;
  });

  // Handle create/update staff
  const handleSave = () => {
    if (editingStaff) {
      // Update
      setStaffs(
        staffs.map((s) =>
          s.staff_id === editingStaff.staff_id ? { ...editingStaff, ...formData } as Staff : s
        )
      );
    } else {
      // Create new
      const newStaff: Staff = {
        staff_id: `STA${String(staffs.length + 1).padStart(5, "0")}`,
        name: formData.name || "",
        phone_number: formData.phone_number || "",
        cinema_id: formData.cinema_id || "",
        manage_id: formData.manage_id,
      };
      setStaffs([...staffs, newStaff]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone_number: "",
      cinema_id: "",
      manage_id: null,
    });
    setEditingStaff(null);
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData(staff);
    setIsDialogOpen(true);
  };

  const handleDelete = (staffId: string) => {
    setStaffs(staffs.filter((s) => s.staff_id !== staffId));
  };

  // Get available managers for a cinema (Any staff can be a manager in this simplified model)
  const getAvailableManagers = (cinema_id: string) => {
    return staffs.filter(
      (s) => s.cinema_id === cinema_id
    );
  };

  // Stats
  const stats = {
    total: staffs.length,
    cinemas: cinemas.length,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Nhân viên"
        description="Quản lý danh sách nhân viên và phân cấp quản lý"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rạp chiếu</p>
              <p className="text-2xl font-bold">{stats.cinemas}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên, SĐT..."
          />
        </div>

        {/* Cinema Filter */}
        <Select value={selectedCinema} onValueChange={setSelectedCinema}>
          <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50">
            <SelectValue placeholder="Tất cả rạp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả rạp</SelectItem>
            {cinemas.map((cinema) => (
              <SelectItem key={cinema.cinema_id} value={cinema.cinema_id}>
                {cinema.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="shadow-lg hover:shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ tên *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại *</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rạp chiếu *</label>
                <Select
                  value={formData.cinema_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cinema_id: value, manage_id: null })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn rạp" />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemas.map((cinema) => (
                      <SelectItem key={cinema.cinema_id} value={cinema.cinema_id}>
                        {cinema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.cinema_id && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Người quản lý</label>
                  <Select
                    value={formData.manage_id || "none"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, manage_id: value === "none" ? null : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người quản lý" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      {getAvailableManagers(formData.cinema_id!).map((manager) => (
                        <SelectItem key={manager.staff_id} value={manager.staff_id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>
                  {editingStaff ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredStaffs.length} / {staffs.length} nhân viên
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaffs.map((staff) => {
            const manager = staff.manage_id ? staffs.find(s => s.staff_id === staff.manage_id) : null;
            const subordinates = staffs.filter(s => s.manage_id === staff.staff_id);
            const cinema = cinemas.find((c) => c.cinema_id === staff.cinema_id);

            return (
              <Card
                key={staff.staff_id}
                className="p-6 transition-all hover:shadow-lg hover:border-primary/50 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{staff.name}</h3>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{staff.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span className="truncate">{cinema?.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hierarchy Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {manager && (
                          <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1">
                            <span className="text-muted-foreground">QL:</span>
                            <span className="font-medium">{manager.name}</span>
                          </div>
                        )}

                        {subordinates.length > 0 && (
                          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                            <Users className="w-3 h-3 text-primary" />
                            <span className="font-medium text-primary">
                              {subordinates.length} NV
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(staff)} className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(staff.staff_id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredStaffs.length === 0 && (
          <Card className="p-12 border-dashed">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không tìm thấy nhân viên nào</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
