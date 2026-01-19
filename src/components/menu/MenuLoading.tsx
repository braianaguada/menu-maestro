export function MenuLoading() {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-4">
        <div className="container max-w-2xl mx-auto flex items-center justify-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-muted animate-shimmer" />
          <div className="h-8 w-48 rounded-lg bg-muted animate-shimmer" />
        </div>
      </div>

      {/* Promos skeleton */}
      <div className="py-6 px-4">
        <div className="container max-w-2xl mx-auto mb-4">
          <div className="h-8 w-32 rounded-lg bg-muted animate-shimmer" />
        </div>
        <div className="flex gap-4 overflow-hidden px-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[200px] rounded-xl bg-muted animate-shimmer"
            />
          ))}
        </div>
      </div>

      {/* Sections skeleton */}
      <div className="container max-w-2xl mx-auto px-4 py-6">
        {[1, 2].map((section) => (
          <div key={section} className="mb-8">
            <div className="h-8 w-40 rounded-lg bg-muted animate-shimmer mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg bg-muted animate-shimmer"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
