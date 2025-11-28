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
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Profile Info (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card Skeleton */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 space-y-6 flex flex-col items-center">
               <Skeleton className="h-32 w-32 rounded-full" />
               <div className="space-y-2 text-center w-full flex flex-col items-center">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32 rounded-full" />
               </div>
               <div className="grid w-full grid-cols-2 gap-4 pt-4">
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
               </div>
               <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            
            {/* Membership Card Skeleton */}
            <div className="rounded-3xl border border-border/50 bg-card/50 p-8 space-y-4">
               <Skeleton className="h-6 w-40" />
               <div className="p-4 rounded-2xl border border-border/50 bg-background/50 flex justify-between items-center">
                  <div className="space-y-2">
                     <Skeleton className="h-3 w-24" />
                     <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
               </div>
            </div>
          </div>

          {/* Right Column: Info & History (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
             {/* Personal Info Skeleton */}
             <div className="rounded-3xl border border-border/50 bg-card/50 p-8 space-y-8">
                <div className="flex justify-between items-center">
                   <Skeleton className="h-7 w-48" />
                   <Skeleton className="h-9 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                   {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                         <Skeleton className="h-4 w-20" />
                         <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Benefits Skeleton */}
             <div className="rounded-3xl border border-border/50 bg-card/50 p-8 space-y-6">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                   ))}
                </div>
             </div>

             {/* History Skeleton */}
             <div className="rounded-3xl border border-border/50 bg-card/50 p-8 space-y-6">
                <Skeleton className="h-7 w-48" />
                <div className="space-y-4">
                   {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-24 w-full rounded-xl border border-border/50 bg-card/30 p-4 flex justify-between items-center">
                         <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                         </div>
                         <Skeleton className="h-8 w-24 rounded-lg" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}