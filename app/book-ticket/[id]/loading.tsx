import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Movie Header Skeleton */}
        <div className="mb-8 rounded-lg bg-card border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-32 w-24 rounded-md" />
          </div>
        </div>

        {/* Steps Skeleton */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             {/* Seat Map Skeleton */}
             <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
             {/* Summary Skeleton */}
             <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
