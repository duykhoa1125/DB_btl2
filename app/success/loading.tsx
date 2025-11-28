import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center space-y-6 flex flex-col items-center">
           <Skeleton className="h-24 w-24 rounded-full" />
           <Skeleton className="h-12 w-3/4 max-w-lg" />
           <Skeleton className="h-6 w-full max-w-md" />
        </div>

        {/* Ticket Card Skeleton */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-border/50 bg-card/50">
           <div className="h-24 bg-muted/30 flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
           </div>

           <div className="p-8 space-y-8">
              {/* Movie Info */}
              <div className="flex flex-col md:flex-row gap-8">
                 <Skeleton className="w-full md:w-32 aspect-[2/3] rounded-2xl shrink-0" />
                 <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                       <Skeleton className="h-8 w-3/4" />
                       <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                             <Skeleton className="h-3 w-16" />
                             <Skeleton className="h-5 w-32" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="h-px w-full bg-border/50" />

              {/* Details */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <Skeleton className="h-4 w-32" />
                       <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                       <Skeleton className="h-8 w-12 rounded-lg" />
                       <Skeleton className="h-8 w-12 rounded-lg" />
                       <Skeleton className="h-8 w-12 rounded-lg" />
                    </div>
                 </div>

                 <div className="rounded-2xl bg-muted/30 p-6 space-y-4">
                    <div className="flex justify-between">
                       <Skeleton className="h-4 w-20" />
                       <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between pt-4 border-t border-border/50">
                       <Skeleton className="h-6 w-32" />
                       <Skeleton className="h-8 w-32" />
                    </div>
                 </div>

                 {/* QR Skeleton */}
                 <div className="flex flex-col items-center gap-4 pt-4">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-32 w-32 rounded-2xl" />
                 </div>
              </div>
           </div>
        </div>

        {/* Actions Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
           ))}
        </div>

        {/* Note Skeleton */}
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}