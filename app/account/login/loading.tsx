import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground">Đang tải trang đăng nhập...</p>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}
