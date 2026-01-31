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
      className={cn("py-12 md:py-16 section-fade", className)}
    >
      <header className="mb-8 md:mb-10 space-y-3">
        <p className="menu-chip text-muted-foreground">Sección</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
            {section.name}
          </h2>
          {section.description && (
            <p className="text-sm text-muted-foreground max-w-xl">
              {section.description}
            </p>
          )}
        </div>
        <div className="h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
      </header>

      <div className="menu-grid">
        {section.items.map((item, index) => (
          <EditorialMenuItem
            key={item.id}
            item={item}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
