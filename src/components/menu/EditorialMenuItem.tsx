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
        "group py-5 border-b border-border/20 last:border-b-0",
        "transition-colors duration-200 hover:bg-muted/20",
        className
      )}
    >
      <div className="flex gap-5">
        {/* Image (optional) - Editorial style */}
        {item.image_url && (
          <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-lg">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Name and Price Row */}
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h4 className="font-display text-lg md:text-xl font-medium text-foreground leading-tight tracking-tight">
              {item.name}
            </h4>
            <span className="flex-shrink-0 font-display text-lg md:text-xl font-medium text-foreground tabular-nums">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Dotted line separator */}
          <div className="h-px bg-gradient-to-r from-border/40 via-border/20 to-transparent mb-2" />

          {/* Description */}
          {item.description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          {/* Tags - subtle editorial style */}
          {hasTags && (
            <div className="flex flex-wrap gap-2">
              {item.is_recommended && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Star className="w-3 h-3" />
                  Recomendado
                </span>
              )}
              {item.is_vegan && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                  <Leaf className="w-3 h-3" />
                  Vegano
                </span>
              )}
              {item.is_spicy && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
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
