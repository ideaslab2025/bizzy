
import { Skeleton } from "@/components/ui/skeleton";

export const PageLoadingSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-8 w-32 bg-blue-800/50" />
            <div className="hidden md:flex items-center gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16 bg-blue-800/50" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 bg-blue-800/50" />
              <Skeleton className="h-8 w-8 rounded-full bg-blue-800/50" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-6">
              <Skeleton className="h-16 w-full bg-blue-800/50" />
              <Skeleton className="h-6 w-3/4 bg-blue-800/50" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40 bg-blue-800/50" />
                <Skeleton className="h-12 w-32 bg-blue-800/50" />
              </div>
            </div>
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
              <Skeleton className="w-full h-full bg-blue-800/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-8 w-96 mx-auto bg-blue-800/50" />
            <Skeleton className="h-6 w-2/3 mx-auto bg-blue-800/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-blue-700/50 p-6 space-y-4">
                <Skeleton className="w-full h-48 bg-blue-800/50" />
                <Skeleton className="h-6 w-3/4 bg-blue-800/50" />
                <Skeleton className="h-4 w-full bg-blue-800/50" />
                <Skeleton className="h-4 w-2/3 bg-blue-800/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
