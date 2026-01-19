import { cn } from '@/lib/utils';
import { MenuItem } from './MenuItem';
import type { Section, Item } from '@/types/menu';

interface MenuSectionProps {
  section: Section & { items: Item[] };
  className?: string;
}

export function MenuSection({ section, className }: MenuSectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section
      id={`section-${section.id}`}
      className={cn("py-6 md:py-8 animate-fade-in", className)}
    >
      <div className="mb-4 md:mb-6">
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          {section.name}
        </h3>
        {section.description && (
          <p className="mt-1 text-muted-foreground">
            {section.description}
          </p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>

      <div className="space-y-2">
        {section.items.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
