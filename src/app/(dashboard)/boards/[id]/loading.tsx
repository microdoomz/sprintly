import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-4 h-8 rounded-sm" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-muted/30 rounded-xl border border-border p-4 overflow-x-auto">
        <div className="flex h-full gap-4 min-w-max">
          {[1, 2, 3].map((col) => (
            <div key={col} className="w-80 flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="flex flex-col gap-3 flex-1">
                {[1, 2].map((card) => (
                  <Skeleton key={card} className="h-28 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
