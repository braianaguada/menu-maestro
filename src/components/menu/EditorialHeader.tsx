import { cn } from '@/lib/utils';

interface EditorialHeaderProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function EditorialHeader({ name, logoUrl, className }: EditorialHeaderProps) {
  return (
    <header className={cn(
      "relative py-16 md:py-20 lg:py-24",
      "bg-background",
      className
    )}>
      <div className="container max-w-2xl mx-auto px-4 md:px-6 text-center">
        {/* Logo */}
        {logoUrl && (
          <div className="mb-8 md:mb-10 flex justify-center">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-14 md:h-16 lg:h-20 w-auto object-contain opacity-90"
            />
          </div>
        )}

        {/* Restaurant Name - Premium Hero Typography */}
        <h1 className="heading-hero text-foreground">
          {name}
        </h1>

        {/* Elegant Decorative Separator */}
        <div className="mt-8 md:mt-10 flex items-center justify-center gap-2 md:gap-3">
          <div className="h-px w-8 md:w-12 bg-primary/40 transition-smooth" />
          <div className="w-1 h-1 rounded-full bg-primary/60" />
          <div className="h-px w-8 md:w-12 bg-primary/40 transition-smooth" />
        </div>
      </div>
    </header>
  );
}
