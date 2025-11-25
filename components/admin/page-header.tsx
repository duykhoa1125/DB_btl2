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
    <div className={cn("flex items-center justify-between mb-8", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2 text-lg">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionLink && (
        <Button asChild className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
          <Link href={actionLink}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
