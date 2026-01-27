import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      const scrollAmount = 340;
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
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="menu-chip">Promociones destacadas</p>
            <h2 className="mt-4 text-2xl md:text-3xl font-display font-semibold text-foreground">
              Experiencias con precio especial
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            Deslizá para ver más
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Nav buttons - desktop only */}
        {promotions.length > 2 && (
          <>
            <button
              onClick={() => scroll('left')}
              className={cn(
                "hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 items-center justify-center",
                "glass-surface shadow-menu-md rounded-full",
                "hover:bg-secondary transition-colors"
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className={cn(
                "hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 items-center justify-center",
                "glass-surface shadow-menu-md rounded-full",
                "hover:bg-secondary transition-colors"
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
          className="flex gap-6 overflow-x-auto snap-x-mandatory scrollbar-hide px-6 md:px-8 pb-4"
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
