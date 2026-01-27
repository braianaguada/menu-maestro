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
        "flex-shrink-0 w-[280px] md:w-[320px] snap-start",
        "group cursor-pointer transition-smooth",
        "menu-card overflow-hidden"
      )}
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {promotion.image_url ? (
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="menu-price bg-white/15 text-white border border-white/20">
            {promotion.price_text}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-lg font-semibold text-foreground line-clamp-2">
          {promotion.title}
        </h3>
        {promotion.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {promotion.description}
          </p>
        )}
        {hasLink && (
          <button
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-smooth-fast"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver en menú
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </article>
  );
}
