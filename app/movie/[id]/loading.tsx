import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border/40 bg-card/50 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-4" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* Main Info Skeleton - Horizontal Layout */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card/50 p-6 lg:flex-row">
          {/* Poster */}
          <div className="shrink-0">
            <Skeleton className="h-[400px] w-[270px] rounded-xl" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
             {/* Badges */}
             <div className="flex gap-3">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-12 rounded-full" />
             </div>

             {/* Title & Synopsis */}
             <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
             </div>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
               {Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="rounded-xl border border-border/50 p-4 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-24" />
                 </div>
               ))}
            </div>

            {/* Cast */}
            <div className="rounded-xl border border-border/50 p-4 space-y-3">
               <Skeleton className="h-4 w-20" />
               <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
               </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
           {/* Rating Summary (Left) */}
           <div className="lg:col-span-1">
             <Skeleton className="h-[300px] w-full rounded-2xl" />
           </div>
           {/* Trailer (Right) */}
           <div className="lg:col-span-2">
             <div className="rounded-2xl border border-border bg-card overflow-hidden h-full">
                <div className="p-4 border-b border-border">
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="aspect-video w-full" />
             </div>
           </div>
        </div>
      </section>

      {/* Showtimes Section Skeleton */}
      <section className="border-t border-border py-12 mt-8">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
           <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 7 }).map((_, i) => (
                 <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-xl" />
              ))}
           </div>
           <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
           </div>
        </div>
      </section>
    </div>
  );
}