import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PromotionCard } from './PromotionCard';
import type { Promotion } from '@/types/menu';
import { trackPromoClick } from '@/hooks/usePublicMenu';

interface PromotionsCarouselProps {
  promotions: Promotion[];
  onNavigateToSection?: (sectionId: string) => void;
  onNavigateToItem?: (itemId: string) => void;
}

export function PromotionsCarousel({ 
  promotions, 
  onNavigateToSection, 
  onNavigateToItem 
}: PromotionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (promotions.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handlePromoClick = (promo: Promotion) => {
    // Track click
    trackPromoClick(promo.id);

    // Navigate if linked
    if (promo.linked_item_id && onNavigateToItem) {
      onNavigateToItem(promo.linked_item_id);
    } else if (promo.linked_section_id && onNavigateToSection) {
      onNavigateToSection(promo.linked_section_id);
    }
  };

  return (
    <section className="py-6 md:py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
            Promociones
          </h2>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons - Hidden on mobile */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={() => scroll('left')}
              className={cn(
                "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 items-center justify-center rounded-full",
                "bg-card/90 border border-border shadow-menu-md",
                "hover:bg-muted transition-colors"
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className={cn(
                "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 items-center justify-center rounded-full",
                "bg-card/90 border border-border shadow-menu-md",
                "hover:bg-muted transition-colors"
              )}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        {/* Scrollable Carousel */}
        <div
          ref={scrollRef}
          className={cn(
            "flex gap-4 overflow-x-auto snap-x-mandatory scrollbar-hide",
            "px-4 md:px-8 pb-2"
          )}
        >
          {/* Left padding spacer for centering first item */}
          <div className="flex-shrink-0 w-[calc(50%-160px)] md:w-[calc(50%-180px)] md:hidden" />
          
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onClick={() => handlePromoClick(promo)}
              onViewInMenu={() => handlePromoClick(promo)}
            />
          ))}
          
          {/* Right padding spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
}
