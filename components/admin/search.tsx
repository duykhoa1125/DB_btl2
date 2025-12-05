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
    <div className={cn("relative group w-full", className)}>
      <div className="absolute -inset-0.5 bg-primary/20 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500 blur-sm" />
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-11 h-12 w-full bg-background/80 backdrop-blur-xl border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all rounded-xl shadow-sm hover:border-primary/30"
        />
      </div>
    </div>
  );
}