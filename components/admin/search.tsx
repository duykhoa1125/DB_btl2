import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
}: AdminSearchProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-11 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-background transition-all rounded-xl shadow-sm"
        />
      </div>
    </div>
  );
}