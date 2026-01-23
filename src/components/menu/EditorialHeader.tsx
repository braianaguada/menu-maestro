import { cn } from '@/lib/utils';

interface EditorialHeaderProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function EditorialHeader({ name, logoUrl, className }: EditorialHeaderProps) {
  return (
    <header className={cn(
      "relative py-12 md:py-16 lg:py-20",
      "bg-background",
      className
    )}>
      <div className="container max-w-3xl mx-auto px-4 md:px-6 text-center">
        {/* Logo */}
        {logoUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>
        )}
        
        {/* Restaurant Name - Hero Typography */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-tight">
          {name}
        </h1>
        
        {/* Decorative separator */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>
    </header>
  );
}
