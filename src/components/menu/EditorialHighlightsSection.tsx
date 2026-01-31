import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/menu';
import { getPairingSuggestion } from '@/lib/menuSuggestions';

interface HighlightedItem {
  item: Item;
  sectionName: string;
}

interface EditorialHighlightsSectionProps {
  items: HighlightedItem[];
  onNavigateToItem?: (itemId: string) => void;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop',
];

const getFallbackImage = (name: string) =>
  fallbackImages[Math.abs(name.length) % fallbackImages.length];

export function EditorialHighlightsSection({
  items,
  onNavigateToItem,
}: EditorialHighlightsSectionProps) {
  if (items.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-8 md:mb-10">
          <p className="menu-chip">Selección del chef</p>
          <h2 className="mt-4 text-2xl md:text-3xl font-display font-semibold text-foreground">
            Destacados que definen la casa
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
            Una curaduría de platos recomendados para quienes quieren vivir la experiencia completa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map(({ item, sectionName }) => {
            const imageUrl = item.image_url || getFallbackImage(item.name);
            const pairing = item.pairing || getPairingSuggestion(item.name);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateToItem?.(item.id)}
                className={cn(
                  'menu-card text-left w-full overflow-hidden group',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70'
                )}
                aria-label={`Ver ${item.name} en el menú`}
              >
                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                  <div className="relative h-40 md:h-full">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          {sectionName}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>
                      <span className="menu-price">
                        ${formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/80">
                      Maridaje sugerido
                      <span className="block text-sm normal-case text-foreground/80 mt-1">
                        {pairing}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                      <Star className="w-3.5 h-3.5" />
                      Recomendado
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
