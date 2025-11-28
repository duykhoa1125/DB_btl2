import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section Skeleton */}
        <div className="mb-16 text-center space-y-6 flex flex-col items-center">
           <Skeleton className="h-8 w-40 rounded-full" />
           <Skeleton className="h-20 w-3/4 max-w-2xl" />
           <Skeleton className="h-6 w-1/2 max-w-xl" />
        </div>

        {/* Search Skeleton */}
        <div className="mb-16 max-w-xl mx-auto">
           <Skeleton className="h-14 w-full rounded-2xl" />
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 overflow-hidden h-full flex flex-col">
               {/* Image */}
               <Skeleton className="aspect-video w-full" />
               
               {/* Content */}
               <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                     <Skeleton className="h-7 w-3/4" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-2/3" />
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-border/50">
                     <Skeleton className="h-6 w-24" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
