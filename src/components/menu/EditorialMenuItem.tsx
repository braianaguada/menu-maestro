import { cn } from '@/lib/utils';
import { Leaf, Flame, Star } from 'lucide-react';
import type { Item } from '@/types/menu';

interface EditorialMenuItemProps {
  item: Item;
  className?: string;
  style?: React.CSSProperties;
}

export function EditorialMenuItem({ item, className, style }: EditorialMenuItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasTags = item.is_recommended || item.is_vegan || item.is_spicy;

  return (
    <article
      id={`item-${item.id}`}
      style={style}
      className={cn(
        "group py-6 md:py-7 border-b border-border/30 last:border-b-0",
        "transition-smooth hover:bg-muted/15",
        className
      )}
    >
      <div className="flex gap-5 md:gap-6">
        {/* Image (optional) - Editorial refined */}
        {item.image_url && (
          <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-lg shadow-menu-sm group-hover:shadow-menu-md transition-smooth">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          {/* Name and Price Row */}
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="heading-item text-foreground">
              {item.name}
            </h4>
            <span className="flex-shrink-0 text-price text-foreground">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Subtle separator */}
          <div className="h-px bg-border/25 w-full" />

          {/* Description */}
          {item.description && (
            <p className="text-body text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Tags - refined editorial style */}
          {hasTags && (
            <div className="flex flex-wrap gap-2 pt-1">
              {item.is_recommended && (
                <span className="inline-flex items-center gap-1 text-caption font-medium text-primary opacity-90 hover-subtle">
                  <Star className="w-3 h-3" />
                  Recomendado
                </span>
              )}
              {item.is_vegan && (
                <span className="inline-flex items-center gap-1 text-caption font-medium text-accent opacity-90 hover-subtle">
                  <Leaf className="w-3 h-3" />
                  Vegano
                </span>
              )}
              {item.is_spicy && (
                <span className="inline-flex items-center gap-1 text-caption font-medium text-destructive opacity-90 hover-subtle">
                  <Flame className="w-3 h-3" />
                  Picante
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
