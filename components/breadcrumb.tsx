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
      className={cn("flex items-center text-sm", className)}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
        {/* Home Icon */}
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only">Trang chủ</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-1 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 whitespace-nowrap",
                    isLast
                      ? "font-medium text-foreground bg-muted/50"
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
      </div>
    </nav>
  );
}
