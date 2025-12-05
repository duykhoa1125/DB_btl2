import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionLink,
  className,
}: AdminPageHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/40 shadow-sm", 
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base font-medium">
            {description}
          </p>
        )}
      </div>
      
      {actionLabel && actionLink && (
        <Button 
          asChild 
          className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <Link href={actionLink} className="flex items-center gap-2 font-semibold">
            <div className="p-1 bg-white/20 rounded-full">
              <Plus className="h-4 w-4" />
            </div>
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}