
import { Skeleton } from "@/components/ui/skeleton";

export const AuthLoadingSkeleton = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
};
