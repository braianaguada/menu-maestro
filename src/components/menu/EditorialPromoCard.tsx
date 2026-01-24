import { cn } from '@/lib/utils';
import type { Promotion } from '@/types/menu';
import { Sparkles, ArrowRight } from 'lucide-react';

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
        "flex-shrink-0 w-[280px] md:w-[320px] snap-start",
        "group cursor-pointer transition-smooth"
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      {promotion.image_url ? (
        <div className="relative aspect-[3.5/3] overflow-hidden rounded-lg mb-4 shadow-menu-md hover-lift">
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Very subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-50 transition-opacity" />

          {/* Price badge - refined */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/95 text-primary-foreground text-xs font-semibold shadow-gold backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              {promotion.price_text}
            </span>
          </div>
        </div>
      ) : (
        /* No image - minimal card */
        <div className="relative aspect-[3.5/3] overflow-hidden rounded-lg mb-4 bg-secondary flex items-center justify-center border border-border/50 shadow-menu-sm">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary font-semibold text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {promotion.price_text}
          </span>
        </div>
      )}

      {/* Content - Editorial refined */}
      <div className="px-0.5">
        <h3 className="heading-item text-foreground line-clamp-1 mb-1">
          {promotion.title}
        </h3>
        {promotion.description && (
          <p className="text-caption text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
            {promotion.description}
          </p>
        )}
        {hasLink && (
          <button
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-smooth-fast"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver en carta
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </article>
  );
}
