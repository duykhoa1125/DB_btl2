import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="bg-background relative min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-6">
        <div className="mb-8 text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
          <Skeleton className="h-16 w-3/4 mx-auto max-w-3xl" />
          <Skeleton className="h-6 w-1/2 mx-auto max-w-2xl" />
        </div>

        {/* Carousel Placeholder */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-3xl border border-border/50">
          <Skeleton className="h-full w-full" />
          {/* Mock carousel content */}
          <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Movie Listings Skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex justify-center gap-4 mb-8">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>

        {/* Movie Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section Skeleton */}
      <section className="bg-muted/30 py-20 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinemas Section Skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}