export function EditorialFooter() {
  return (
    <footer className="py-16 border-t border-border/30 bg-card/40">
      <div className="container max-w-5xl mx-auto px-5 md:px-8 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Gracias por elegir una experiencia gastronómica moderna.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          <span className="h-px w-10 bg-border/50" />
          Menú digital
          <span className="h-px w-10 bg-border/50" />
        </div>
      </div>
    </footer>
  );
}
