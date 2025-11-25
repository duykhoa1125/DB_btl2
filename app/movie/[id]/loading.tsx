import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero Section Skeleton */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card/50 p-6 lg:flex-row">
          {/* Poster */}
          <div className="shrink-0">
            <Skeleton className="h-[320px] w-[220px] rounded-xl" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
               <Skeleton className="h-20 w-full rounded-xl" />
               <Skeleton className="h-20 w-full rounded-xl" />
               <Skeleton className="h-20 w-full rounded-xl lg:col-span-2" />
            </div>
          </div>

          {/* Rating */}
          <div className="shrink-0 lg:w-[250px]">
             <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
        
        {/* Secondary Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
           <div className="lg:col-span-2">
             <Skeleton className="h-[400px] w-full rounded-2xl" />
           </div>
           <div className="space-y-4">
             <Skeleton className="h-48 w-full rounded-xl" />
             <Skeleton className="h-32 w-full rounded-xl" />
           </div>
        </div>
      </section>
    </div>
  );
}
