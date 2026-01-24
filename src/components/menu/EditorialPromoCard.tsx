import { cn } from '@/lib/utils';
import type { Promotion } from '@/types/menu';
import { ArrowRight } from 'lucide-react';

interface EditorialPromoCardProps {
  promotion: Promotion;
  onViewInMenu?: () => void;
  onClick?: () => void;
}

export function EditorialPromoCard({ promotion, onViewInMenu, onClick }: EditorialPromoCardProps) {
  const hasLink = promotion.linked_section_id || promotion.linked_item_id;

  const handleClick = () => {
    onClick?.();
    if (hasLink && onViewInMenu) {
      onViewInMenu();
    }
  };

  return (
    <article
      className={cn(
        "flex-shrink-0 w-[280px] md:w-[300px] snap-start",
        "group cursor-pointer transition-smooth"
      )}
      onClick={handleClick}
    >
      {/* Image Container - Cassis style: clean, no excessive overlays */}
      {promotion.image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4 shadow-menu-sm">
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        /* No image - minimal card with just text */
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4 bg-secondary/50 flex items-center justify-center border border-border/30">
          <span className="heading-subsection text-muted-foreground">
            PROMOCIÓN
          </span>
        </div>
      )}

      {/* Content - Cassis style: bold title, minimal styling */}
      <div>
        <h3 className="heading-item text-foreground line-clamp-2 mb-1">
          {promotion.title}
        </h3>
        
        {/* Price - Cassis style inline */}
        <p className="text-price text-primary mb-2">
          {promotion.price_text}
        </p>

        {promotion.description && (
          <p className="text-body line-clamp-2 mb-2">
            {promotion.description}
          </p>
        )}

        {hasLink && (
          <button
            className="inline-flex items-center gap-1.5 text-caption font-medium text-primary hover:text-primary/80 transition-smooth-fast"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            VER EN CARTA
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </article>
  );
}