import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section Skeleton */}
        <div className="mb-20 text-center space-y-6 flex flex-col items-center">
           <Skeleton className="h-8 w-40 rounded-full" />
           <Skeleton className="h-20 w-3/4 max-w-2xl" />
           <Skeleton className="h-6 w-1/2 max-w-xl" />
        </div>

        {/* Cinema List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 overflow-hidden flex flex-col h-full">
               {/* Image Header */}
               <Skeleton className="h-40 w-full" />
               
               {/* Content */}
               <div className="p-6 space-y-4 flex-1">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="flex gap-3 items-center">
                     <Skeleton className="h-5 w-5 rounded-full" />
                     <Skeleton className="h-5 w-full" />
                  </div>
               </div>

               {/* Footer */}
               <div className="p-6 pt-0 mt-auto">
                  <Skeleton className="h-12 w-full rounded-xl" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
