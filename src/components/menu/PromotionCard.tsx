import { cn } from '@/lib/utils';
import type { Promotion } from '@/types/menu';
import { Sparkles } from 'lucide-react';

interface PromotionCardProps {
  promotion: Promotion;
  onViewInMenu?: () => void;
  onClick?: () => void;
}

export function PromotionCard({ promotion, onViewInMenu, onClick }: PromotionCardProps) {
  const hasLink = promotion.linked_section_id || promotion.linked_item_id;

  const handleClick = () => {
    onClick?.();
    if (hasLink && onViewInMenu) {
      onViewInMenu();
    }
  };

  return (
    <div
      className={cn(
        "flex-shrink-0 w-[280px] md:w-[320px] snap-start",
        "rounded-xl overflow-hidden",
        "gradient-card border border-border/50",
        "shadow-menu-md hover:shadow-gold transition-all duration-300",
        "group cursor-pointer"
      )}
      onClick={handleClick}
    >
      {/* Image Section */}
      {promotion.image_url ? (
        <div className="relative h-36 md:h-40 overflow-hidden">
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {promotion.price_text}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative h-24 gradient-gold flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-lg font-bold">
            <Sparkles className="w-4 h-4" />
            {promotion.price_text}
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 mb-1">
          {promotion.title}
        </h3>
        {promotion.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {promotion.description}
          </p>
        )}
        {hasLink && (
          <button
            className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver en carta →
          </button>
        )}
      </div>
    </div>
  );
}
