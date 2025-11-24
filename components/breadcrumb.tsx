import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("flex items-center gap-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {/* Home Icon */}
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Trang chủ</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="rounded-lg px-2 py-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "rounded-lg px-2 py-1.5",
                  isLast
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
