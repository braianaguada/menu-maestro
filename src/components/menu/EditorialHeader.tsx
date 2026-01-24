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
      <div className="container max-w-4xl mx-auto px-6 md:px-8">
        {/* Logo - Cassis style: subtle, top left aligned */}
        {logoUrl && (
          <div className="mb-6 md:mb-8">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </div>
        )}

        {/* Restaurant Name - Cassis Bold Condensed Style */}
        <h1 className="heading-hero text-foreground">
          {name}
        </h1>

        {/* Minimal accent line - Cassis style */}
        <div className="mt-6 md:mt-8">
          <div className="h-[2px] w-16 md:w-20 bg-primary" />
        </div>
      </div>
    </header>
  );
}