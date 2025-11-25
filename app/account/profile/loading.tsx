import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <div className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              {/* Profile Card Skeleton */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                       <Skeleton className="h-6 w-32" />
                       <Skeleton className="h-4 w-24" />
                    </div>
                 </div>
              </div>
              
              {/* Loyalty Card Skeleton */}
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>

            <div className="lg:col-span-2">
               {/* Booking History Skeleton */}
               <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border p-6">
                     <Skeleton className="h-8 w-48" />
                  </div>
                  <div className="p-6 space-y-4">
                     <Skeleton className="h-24 w-full rounded-lg" />
                     <Skeleton className="h-24 w-full rounded-lg" />
                     <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
