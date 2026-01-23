import { cn } from '@/lib/utils';
import { EditorialMenuItem } from './EditorialMenuItem';
import type { Section, Item } from '@/types/menu';

interface EditorialMenuSectionProps {
  section: Section & { items: Item[] };
  className?: string;
}

export function EditorialMenuSection({ section, className }: EditorialMenuSectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section
      id={`section-${section.id}`}
      className={cn("py-10 md:py-14", className)}
    >
      {/* Section Header - Editorial Style */}
      <header className="mb-8 md:mb-10">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
          {section.name}
        </h2>
        {section.description && (
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {section.description}
          </p>
        )}
        {/* Elegant separator */}
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
        </div>
      </header>

      {/* Items List */}
      <div className="space-y-0">
        {section.items.map((item, index) => (
          <EditorialMenuItem
            key={item.id}
            item={item}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
