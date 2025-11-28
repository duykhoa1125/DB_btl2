import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border/40 bg-card/50 sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-4" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* Header Skeleton */}
        <div className="mb-12 text-center space-y-6 flex flex-col items-center">
           <Skeleton className="h-24 w-24 rounded-full" />
           <Skeleton className="h-10 w-3/4 max-w-md" />
           <Skeleton className="h-6 w-full max-w-lg" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
           {/* Main Content Skeleton */}
           <div className="space-y-8 lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/50">
                 <div className="h-24 bg-muted/30 flex flex-col items-center justify-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-40" />
                 </div>
                 <div className="p-8 space-y-8">
                    <div className="space-y-4">
                       <Skeleton className="h-5 w-32" />
                       <div className="rounded-2xl border border-border/50 p-5 space-y-4">
                          <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-5 w-32" /></div>
                          <div className="h-px bg-border/50" />
                          <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-32" /></div>
                          <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-32" /></div>
                          <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-32" /></div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <Skeleton className="h-5 w-32" />
                       <div className="space-y-3">
                          <Skeleton className="h-12 w-full rounded-xl" />
                          <Skeleton className="h-16 w-full rounded-xl" />
                       </div>
                    </div>
                 </div>
              </div>
              
              <Skeleton className="h-48 w-full rounded-3xl" />
           </div>

           {/* Sidebar Skeleton */}
           <div className="space-y-6 lg:col-span-1">
              <div className="rounded-3xl border border-border/50 bg-card/50 p-6 flex flex-col items-center gap-4">
                 <Skeleton className="h-6 w-32" />
                 <Skeleton className="h-40 w-40 rounded-xl" />
                 <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-3">
                 <Skeleton className="h-12 w-full rounded-xl" />
                 <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-40 w-full rounded-3xl" />
           </div>
        </div>
      </div>
    </div>
  );
}