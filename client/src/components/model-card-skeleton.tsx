import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ModelCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-md flex-shrink-0" />
          
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <Skeleton className="h-3 w-16 mb-1.5" />
              <Skeleton className="h-5 w-32" />
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <Skeleton className="h-8 w-16 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ModelCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  );
}
