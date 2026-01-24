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
      className={cn("py-10 md:py-14 lg:py-16", className)}
    >
      {/* Section Header - Cassis Bold Style */}
      <header className="mb-8 md:mb-10">
        <h2 className="heading-section text-primary">
          {section.name}
        </h2>
        {section.description && (
          <p className="mt-3 text-body max-w-2xl">
            {section.description}
          </p>
        )}
      </header>

      {/* Items Grid - Two columns on desktop like Cassis */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
        {section.items.map((item, index) => (
          <EditorialMenuItem
            key={item.id}
            item={item}
            className={cn(
              "animate-fade-in",
              "border-b border-border/40 last:border-b-0",
              // On desktop, remove bottom border for items in last row
              "md:last:border-b-0",
              // Alternate column styling for visual rhythm
              index % 2 === 0 && "md:border-r-0"
            )}
            style={{ animationDelay: `${index * 25}ms` }}
          />
        ))}
      </div>
    </section>
  );
}