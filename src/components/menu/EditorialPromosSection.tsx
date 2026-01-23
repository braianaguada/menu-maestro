import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorialPromoCard } from './EditorialPromoCard';
import type { Promotion } from '@/types/menu';
import { trackPromoClick } from '@/hooks/usePublicMenu';

interface EditorialPromosSectionProps {
  promotions: Promotion[];
  onNavigateToSection?: (sectionId: string) => void;
  onNavigateToItem?: (itemId: string) => void;
}

export function EditorialPromosSection({ 
  promotions, 
  onNavigateToSection, 
  onNavigateToItem 
}: EditorialPromosSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (promotions.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handlePromoClick = (promo: Promotion) => {
    trackPromoClick(promo.id);

    if (promo.linked_item_id && onNavigateToItem) {
      onNavigateToItem(promo.linked_item_id);
    } else if (promo.linked_section_id && onNavigateToSection) {
      onNavigateToSection(promo.linked_section_id);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container max-w-3xl mx-auto px-4 md:px-6">
        {/* Header - Editorial style */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Promociones
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Nav buttons - desktop only */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={() => scroll('left')}
              className={cn(
                "hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "w-11 h-11 items-center justify-center rounded-full",
                "bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg",
                "hover:bg-background transition-colors"
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className={cn(
                "hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "w-11 h-11 items-center justify-center rounded-full",
                "bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg",
                "hover:bg-background transition-colors"
              )}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x-mandatory scrollbar-hide px-4 md:px-8 pb-4"
        >
          {promotions.map((promo) => (
            <EditorialPromoCard
              key={promo.id}
              promotion={promo}
              onClick={() => handlePromoClick(promo)}
              onViewInMenu={() => handlePromoClick(promo)}
            />
          ))}
          {/* Right spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
}
