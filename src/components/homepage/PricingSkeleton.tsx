
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PricingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-8xl mx-auto touch-interaction-spacing">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 touch-target-card">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-7 w-20" />
            </div>
            
            <div className="mb-4">
              <Skeleton className="h-10 w-16 mx-auto" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
          </CardHeader>

          <CardContent className="pt-0">
            <Skeleton className="h-12 w-full mb-8" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
