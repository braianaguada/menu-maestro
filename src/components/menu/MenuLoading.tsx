export function MenuLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="relative z-10 container max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-24 space-y-6">
          <div className="h-6 w-28 rounded-full bg-muted animate-shimmer" />
          <div className="h-12 w-72 rounded-2xl bg-muted animate-shimmer" />
          <div className="h-4 w-full max-w-md rounded-full bg-muted animate-shimmer" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-muted animate-shimmer" />
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 md:px-8 py-10">
        <div className="h-6 w-40 rounded-full bg-muted animate-shimmer mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] h-[220px] rounded-3xl bg-muted animate-shimmer"
            />
          ))}
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 md:px-8 py-6 space-y-10">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-5">
            <div className="h-6 w-48 rounded-full bg-muted animate-shimmer" />
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-56 rounded-3xl bg-muted animate-shimmer"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
