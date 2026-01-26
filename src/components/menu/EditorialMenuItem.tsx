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
    // Format with dots for thousands (Chilean/Cassis style)
    return new Intl.NumberFormat('es-CL', {
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
        "group py-4 md:py-5",
        "border-b border-border/40 last:border-b-0",
        "transition-smooth",
        className
      )}
    >
      {/* Cassis-style layout: Name + Price on same line, description below */}
      <div className="flex flex-col gap-1">
        {/* Name and Price Row - Cassis style */}
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex-1 min-w-0 flex items-baseline gap-2">
            <h4 className="heading-item text-foreground">
              {item.name}
            </h4>
            {/* Tags inline - small icons */}
            {hasTags && (
              <span className="inline-flex items-center gap-1">
                {item.is_recommended && (
                  <Star className="w-3 h-3 text-primary fill-primary" />
                )}
                {item.is_vegan && (
                  <Leaf className="w-3 h-3 text-accent" />
                )}
                {item.is_spicy && (
                  <Flame className="w-3 h-3 text-destructive" />
                )}
              </span>
            )}
          </div>
          {/* Dotted line connector like classic menus */}
          <span className="flex-1 border-b border-dotted border-border/50 mx-2 min-w-8" />
          <span className="flex-shrink-0 text-price text-foreground">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Description - Cassis style: lowercase, muted, detailed */}
        {item.description && (
          <p className="text-body pr-20">
            {item.description}
          </p>
        )}
      </div>

      {/* Optional image - for featured items only */}
      {item.image_url && (
        <div className="mt-4 w-full max-w-sm overflow-hidden rounded">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
