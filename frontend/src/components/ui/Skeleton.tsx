export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-lg ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex border-b border-slate-200 dark:border-slate-700/50 pb-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`th-${i}`} className="flex-1 px-4">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`tr-${i}`} className="flex items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={`td-${i}-${j}`} className="flex-1 px-4">
                <Skeleton className={`h-5 ${j === 0 ? 'w-32' : 'w-20'}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
