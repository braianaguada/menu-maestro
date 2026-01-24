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
        "transition-smooth",
        className
      )}
    >
      {/* Cassis-style layout: Name + Price on same line, description below */}
      <div className="flex flex-col gap-1.5">
        {/* Name and Price Row - Cassis style */}
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="heading-item text-foreground flex-1 min-w-0">
            {item.name}
            {/* Tags inline with name - Cassis style */}
            {hasTags && (
              <span className="inline-flex items-center gap-1.5 ml-2 align-middle">
                {item.is_recommended && (
                  <Star className="w-3 h-3 text-primary inline" />
                )}
                {item.is_vegan && (
                  <Leaf className="w-3 h-3 text-accent inline" />
                )}
                {item.is_spicy && (
                  <Flame className="w-3 h-3 text-destructive inline" />
                )}
              </span>
            )}
          </h4>
          <span className="flex-shrink-0 text-price text-foreground">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Description - Cassis style: detailed, lowercase, muted */}
        {item.description && (
          <p className="text-body pr-16">
            {item.description}
          </p>
        )}
      </div>

      {/* Optional image - smaller, inline for featured items only */}
      {item.image_url && (
        <div className="mt-3 w-full max-w-xs overflow-hidden rounded-sm">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}