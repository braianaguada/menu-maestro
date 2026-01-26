import { cn } from '@/lib/utils';

interface EditorialHeaderProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function EditorialHeader({ name, logoUrl, className }: EditorialHeaderProps) {
  return (
    <header className={cn(
      "relative py-14 md:py-20 lg:py-24",
      "bg-transparent",
      className
    )}>
      <div className="container max-w-3xl mx-auto px-5 md:px-8">
        {/* Logo - Cassis style: centered or left-aligned, elegant */}
        {logoUrl && (
          <div className="mb-8 md:mb-10">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-12 md:h-14 lg:h-16 w-auto object-contain"
            />
          </div>
        )}

        {/* Restaurant Name - Cassis Bold Condensed Style */}
        <h1 className="heading-hero text-foreground tracking-wider">
          {name}
        </h1>

        {/* Subtitle - elegant accent */}
        <p className="heading-accent text-primary mt-4 md:mt-5">
          Menú
        </p>

        {/* Minimal accent line - Cassis style */}
        <div className="mt-8 md:mt-10 flex items-center gap-3">
          <div className="h-[2px] w-12 md:w-16 bg-primary" />
          <div className="h-[2px] w-3 bg-primary/40" />
        </div>
      </div>
    </header>
  );
}
