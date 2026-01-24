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
      className={cn("py-12 md:py-16 lg:py-18", className)}
    >
      {/* Section Header - Premium Editorial */}
      <header className="mb-10 md:mb-12">
        <h2 className="heading-section text-foreground">
          {section.name}
        </h2>
        {section.description && (
          <p className="mt-4 text-body text-muted-foreground max-w-2xl">
            {section.description}
          </p>
        )}
        {/* Refined separator */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px w-8 md:w-12 bg-primary/40 transition-smooth" />
          <div className="w-1 h-1 rounded-full bg-primary/50" />
        </div>
      </header>

      {/* Items List - clean spacing */}
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
