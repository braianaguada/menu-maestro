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
        "flex-shrink-0 w-[300px] md:w-[340px] snap-start",
        "group cursor-pointer"
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      {promotion.image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          {/* Price badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              {promotion.price_text}
            </span>
          </div>
        </div>
      ) : (
        /* No image - minimal card */
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-lg font-bold">
            <Sparkles className="w-4 h-4" />
            {promotion.price_text}
          </span>
        </div>
      )}

      {/* Content - Editorial minimal */}
      <div className="px-1">
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground leading-tight line-clamp-1 mb-1">
          {promotion.title}
        </h3>
        {promotion.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {promotion.description}
          </p>
        )}
        {hasLink && (
          <button
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver en carta
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        )}
      </div>
    </article>
  );
}
