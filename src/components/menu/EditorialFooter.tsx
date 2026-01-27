export function EditorialFooter() {
  return (
    <footer className="py-14 md:py-18 border-t border-border/30 bg-card/30">
      <div className="container max-w-3xl mx-auto px-5 md:px-8 text-center">
        {/* Minimal credit - centered Cassis style */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-border/50" />
          <p className="text-caption text-muted-foreground/50">
            MENÚ DIGITAL
          </p>
          <div className="h-px w-8 bg-border/50" />
        </div>
      </div>
    </footer>
  );
}
