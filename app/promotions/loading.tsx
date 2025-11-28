import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section Skeleton */}
        <div className="mb-16 text-center space-y-6 flex flex-col items-center">
           <Skeleton className="h-8 w-48 rounded-full" />
           <Skeleton className="h-20 w-3/4 max-w-2xl" />
           <Skeleton className="h-10 w-64 rounded-full" />
        </div>

        {/* Search/Filter Skeleton */}
        <div className="mb-16 max-w-2xl mx-auto space-y-6">
           <Skeleton className="h-14 w-full rounded-2xl" />
           <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        {/* Vouchers Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[280px] rounded-2xl border border-border/50 p-6 flex items-start justify-between gap-6 bg-card/30">
               <div className="flex-1 space-y-5">
                  <div className="flex gap-5">
                     <Skeleton className="h-16 w-16 rounded-2xl" />
                     <div className="space-y-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-4 w-24" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-6 w-48" />
                     <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2">
                     <Skeleton className="h-6 w-20 rounded-full" />
                     <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}