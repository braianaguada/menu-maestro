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
      className={cn("py-12 md:py-16", className)}
    >
      {/* Section Header - Cassis Bold Style */}
      <header className="mb-8 md:mb-10">
        <h2 className="heading-section text-primary">
          {section.name}
        </h2>
        {section.description && (
          <p className="mt-3 text-body max-w-xl">
            {section.description}
          </p>
        )}
        {/* Subtle divider */}
        <div className="mt-5 h-px w-full bg-border/60" />
      </header>

      {/* Items List - Clean single column like Cassis */}
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
