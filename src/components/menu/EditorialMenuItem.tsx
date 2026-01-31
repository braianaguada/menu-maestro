import { cn } from '@/lib/utils';
import { Leaf, Flame, ShieldCheck, Star } from 'lucide-react';
import type { Item } from '@/types/menu';
import { getPairingSuggestion } from '@/lib/menuSuggestions';

const allergenLabels: Record<string, string> = {
  nuts: 'Frutos secos',
  seafood: 'Mariscos',
  egg: 'Huevo',
  soy: 'Soja',
};

interface EditorialMenuItemProps {
  item: Item;
  className?: string;
  style?: React.CSSProperties;
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

export function EditorialMenuItem({ item, className, style }: EditorialMenuItemProps) {
  const formatPrice = (price: number) => {
    // Format with dots for thousands (Chilean/Cassis style)
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasTags =
    item.is_recommended ||
    item.is_vegan ||
    item.is_spicy ||
    item.is_gluten_free ||
    item.is_dairy_free ||
    Boolean(item.allergens?.length);
  const imageUrl = item.image_url || getFallbackImage(item.name);
  const pairing = item.pairing || getPairingSuggestion(item.name);
  const showPairing = item.is_recommended || Boolean(item.pairing);

  return (
    <article
      id={`item-${item.id}`}
      style={style}
      className={cn(
        "group menu-card p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={item.name}
            className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-4 bottom-4 flex items-center gap-2">
            <span className="menu-price bg-white/15 text-white border border-white/20">
              ${formatPrice(item.price)}
            </span>
            {item.is_recommended && (
              <span className="menu-tag bg-white/15 text-white border border-white/20">
                <Star className="w-3 h-3 fill-white" />
                Recomendado
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-lg font-semibold text-foreground">
              {item.name}
            </h4>
            <span className="menu-price">
              ${formatPrice(item.price)}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          {hasTags && (
            <div className="flex flex-wrap gap-2">
              {item.is_vegan && (
                <span className="menu-tag">
                  <Leaf className="w-3 h-3 text-accent" />
                  Vegano
                </span>
              )}
              {item.is_spicy && (
                <span className="menu-tag">
                  <Flame className="w-3 h-3 text-destructive" />
                  Picante
                </span>
              )}
              {item.is_gluten_free && (
                <span className="menu-tag">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Sin gluten
                </span>
              )}
              {item.is_dairy_free && (
                <span className="menu-tag">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Sin lactosa
                </span>
              )}
              {item.allergens?.map((allergen) => (
                <span key={allergen} className="menu-tag text-destructive">
                  Contiene {allergenLabels[allergen] || allergen}
                </span>
              ))}
              {item.is_recommended && (
                <span className="menu-tag">
                  <Star className="w-3 h-3 text-primary" />
                  Favorito
                </span>
              )}
            </div>
          )}

          {showPairing && (
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Maridaje sugerido
              <span className="block text-sm normal-case text-foreground/80 mt-1">
                {pairing}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
