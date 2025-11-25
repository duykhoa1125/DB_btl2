"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  mockStaffs,
  mockCinemas,
  getStaffByCinema,
  getStaffManager,
  getSubordinates,
  type Staff,
} from "@/lib/mock-data";
import {
  Plus,
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  ChevronRight,
  Network,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const POSITION_COLORS = {
  Manager: "bg-purple-500/10 text-purple-600 border-purple-300",
  Supervisor: "bg-blue-500/10 text-blue-600 border-blue-300",
  Staff: "bg-green-500/10 text-green-600 border-green-300",
  Technician: "bg-orange-500/10 text-orange-600 border-orange-300",
};

const POSITION_ICONS = {
  Manager: "👔",
  Supervisor: "📋",
  Staff: "👤",
  Technician: "🔧",
};

export default function StaffManagementPage() {
  const [staffs, setStaffs] = useState<Staff[]>(mockStaffs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    phone_number: "",
    email: "",
    position: "Staff",
    cinema_id: "",
    manage_id: null,
    hire_date: new Date().toISOString().split("T")[0],
    salary: 0,
    status: "active",
  });

  // Filter staffs
  const filteredStaffs = staffs.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone_number.includes(searchTerm) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCinema =
      selectedCinema === "all" || staff.cinema_id === selectedCinema;

    const matchesPosition =
      selectedPosition === "all" || staff.position === selectedPosition;

    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus;

    return matchesSearch && matchesCinema && matchesPosition && matchesStatus;
  });

  // Get cinema name
  const getCinemaName = (cinemaId: string) => {
    return mockCinemas.find((c) => c.cinemaId === cinemaId)?.cinemaName || cinemaId;
  };

  // Handle create/update staff
  const handleSave = () => {
    if (editingStaff) {
      // Update
      setStaffs(
        staffs.map((s) =>
          s.staff_id === editingStaff.staff_id ? { ...editingStaff, ...formData } : s
        )
      );
    } else {
      // Create new
      const newStaff: Staff = {
        staff_id: `STA${String(staffs.length + 1).padStart(5, "0")}`,
        name: formData.name || "",
        phone_number: formData.phone_number || "",
        email: formData.email,
        position: formData.position || "Staff",
        cinema_id: formData.cinema_id || "",
        manage_id: formData.manage_id,
        hire_date: formData.hire_date || new Date().toISOString().split("T")[0],
        salary: formData.salary,
        status: formData.status || "active",
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
      email: "",
      position: "Staff",
      cinema_id: "",
      manage_id: null,
      hire_date: new Date().toISOString().split("T")[0],
      salary: 0,
      status: "active",
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

  // Get available managers for a cinema
  const getAvailableManagers = (cinemaId: string) => {
    return staffs.filter(
      (s) =>
        s.cinema_id === cinemaId &&
        (s.position === "Manager" || s.position === "Supervisor") &&
        s.status === "active"
    );
  };

  // Stats
  const stats = {
    total: staffs.length,
    active: staffs.filter((s) => s.status === "active").length,
    managers: staffs.filter((s) => s.position === "Manager" && s.status === "active").length,
    byCinema: mockCinemas.map((cinema) => ({
      cinema: cinema.cinemaName,
      count: getStaffByCinema(cinema.cinemaId).filter((s) => s.status === "active").length,
    })),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý Nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý nhân viên, phân cấp và theo dõi hoạt động
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
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

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang làm việc</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Network className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quản lý</p>
              <p className="text-2xl font-bold">{stats.managers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rạp chiếu</p>
              <p className="text-2xl font-bold">{mockCinemas.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Cinema Filter */}
        <Select value={selectedCinema} onValueChange={setSelectedCinema}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả rạp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả rạp</SelectItem>
            {mockCinemas.map((cinema) => (
              <SelectItem key={cinema.cinemaId} value={cinema.cinemaId}>
                {cinema.cinemaName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Position Filter */}
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Vị trí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vị trí</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Supervisor">Supervisor</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang làm</SelectItem>
            <SelectItem value="inactive">Đã nghỉ</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@cinemahub.vn"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vị trí *</label>
                  <Select
                    value={formData.position}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>
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
                      {mockCinemas.map((cinema) => (
                        <SelectItem key={cinema.cinemaId} value={cinema.cinemaId}>
                          {cinema.cinemaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.cinema_id && formData.position !== "Manager" && (
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
                      {getAvailableManagers(formData.cinema_id).map((manager) => (
                        <SelectItem key={manager.staff_id} value={manager.staff_id}>
                          {manager.name} ({manager.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày vào làm</label>
                  <Input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lương (VNĐ)</label>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: Number(e.target.value) })
                    }
                    placeholder="12000000"
                  />
                </div>
              </div>

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

        <div className="grid gap-4">
          {filteredStaffs.map((staff) => {
            const manager = getStaffManager(staff.staff_id);
            const subordinates = getSubordinates(staff.staff_id);
            const cinema = mockCinemas.find((c) => c.cinemaId === staff.cinema_id);

            return (
              <Card
                key={staff.staff_id}
                className={cn(
                  "p-6 transition-all hover:shadow-md",
                  staff.status === "inactive" && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {POSITION_ICONS[staff.position]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{staff.name}</h3>
                          <Badge
                            variant="outline"
                            className={POSITION_COLORS[staff.position]}
                          >
                            {staff.position}
                          </Badge>
                          {staff.status === "active" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Đang làm
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-300">
                              <UserX className="w-3 h-3 mr-1" />
                              Đã nghỉ
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{staff.phone_number}</span>
                          </div>
                          {staff.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{staff.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span className="truncate">{cinema?.cinemaName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(staff.hire_date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hierarchy Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {manager && (
                          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                            <span className="text-muted-foreground">Quản lý:</span>
                            <span className="font-medium">{manager.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {manager.position}
                            </Badge>
                          </div>
                        )}

                        {subordinates.length > 0 && (
                          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Quản lý:</span>
                            <span className="font-medium text-primary">
                              {subordinates.length} nhân viên
                            </span>
                          </div>
                        )}

                        {staff.salary && (
                          <div className="flex items-center gap-2 rounded-lg bg-green-500/5 px-3 py-1.5">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              {staff.salary.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(staff)}>
                    <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(staff.staff_id)}
                      className="text-destructive hover:bg-destructive/10"
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
          <Card className="p-12">
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
