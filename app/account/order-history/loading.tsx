import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-12 bg-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="mb-6 flex gap-2">
           <Skeleton className="h-10 w-24 rounded-full" />
           <Skeleton className="h-10 w-24 rounded-full" />
           <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-12" />
                     <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-12" />
                     <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-12" />
                     <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                     <Skeleton className="h-6 w-24 rounded-full" />
                     <Skeleton className="h-4 w-20" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
