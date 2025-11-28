import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card/50 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 py-8">
        {/* Movie Header Card Skeleton */}
        <div className="mb-8 rounded-3xl border border-border/50 p-6 shadow-xl relative overflow-hidden">
           <div className="flex flex-col md:flex-row items-start gap-6">
              <Skeleton className="h-32 w-24 rounded-xl" />
              <div className="flex-1 space-y-4">
                 <Skeleton className="h-10 w-3/4 max-w-lg" />
                 <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                 </div>
              </div>
           </div>
        </div>

        {/* Steps Indicator Skeleton */}
        <div className="mb-12 max-w-2xl mx-auto px-4">
           <div className="flex justify-between items-center relative">
              <Skeleton className="absolute w-full h-1 top-1/2 -translate-y-1/2" />
              {[1, 2, 3].map((i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                 </div>
              ))}
           </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left Column (Seats/Food/Payment) - Span 3 */}
          <div className="lg:col-span-3 space-y-8">
             {/* Mimic Seat Map */}
             <div className="space-y-8 p-4 border border-border/50 rounded-2xl">
                <Skeleton className="h-8 w-full max-w-2xl mx-auto mb-12 rounded-b-3xl opacity-50" /> {/* Screen */}
                <div className="grid grid-cols-12 gap-2 max-w-4xl mx-auto">
                   {Array.from({ length: 8 * 12 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square w-full rounded-md" />
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column (Summary) - Span 1 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border/50 bg-card/80 shadow-xl p-6 space-y-6">
               <Skeleton className="h-6 w-32" />
               <div className="space-y-4">
                  <div className="flex justify-between">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="flex justify-between">
                     <Skeleton className="h-6 w-24" />
                     <Skeleton className="h-6 w-32" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}