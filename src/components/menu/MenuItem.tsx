import { cn } from '@/lib/utils';
import { Leaf, Flame, Star } from 'lucide-react';
import type { Item } from '@/types/menu';

interface MenuItemProps {
  item: Item;
  className?: string;
  style?: React.CSSProperties;
}

export function MenuItem({ item, className, style }: MenuItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      id={`item-${item.id}`}
      style={style}
      className={cn(
        "group p-4 rounded-lg",
        "bg-card/50 hover:bg-card border border-transparent hover:border-border/50",
        "transition-all duration-200",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Image (optional) */}
        {item.image_url && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base md:text-lg font-medium text-foreground leading-tight">
                {item.name}
              </h4>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.is_recommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    <Star className="w-3 h-3" />
                    Recomendado
                  </span>
                )}
                {item.is_vegan && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 text-xs font-medium">
                    <Leaf className="w-3 h-3" />
                    Vegano
                  </span>
                )}
                {item.is_spicy && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 text-xs font-medium">
                    <Flame className="w-3 h-3" />
                    Picante
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex-shrink-0">
              <span className="font-display text-lg md:text-xl font-semibold text-primary">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
