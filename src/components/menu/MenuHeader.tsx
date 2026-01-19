import { cn } from '@/lib/utils';

interface MenuHeaderProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function MenuHeader({ name, logoUrl, className }: MenuHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 glass border-b border-border/50",
      "px-4 py-4 md:py-6",
      className
    )}>
      <div className="container max-w-2xl mx-auto flex items-center justify-center gap-4">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg"
          />
        )}
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          {name}
        </h1>
      </div>
    </header>
  );
}
