import { Flame, Leaf, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MenuFiltersState {
  vegan: boolean;
  spicy: boolean;
  recommended: boolean;
}

interface MenuFiltersProps {
  value: MenuFiltersState;
  onChange: (next: MenuFiltersState) => void;
}

export function MenuFilters({ value, onChange }: MenuFiltersProps) {
  const hasActiveFilters = value.vegan || value.spicy || value.recommended;

  const toggleFilter = (key: keyof MenuFiltersState) => {
    onChange({ ...value, [key]: !value[key] });
  };

  const clearFilters = () => {
    onChange({ vegan: false, spicy: false, recommended: false });
  };

  const baseClass =
    'menu-tag border border-border/50 bg-background/80 text-muted-foreground hover:text-foreground transition-colors';
  const activeClass = 'bg-primary/15 text-primary border-primary/40';

  return (
    <div className="container max-w-5xl mx-auto px-6 md:px-8 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={cn(baseClass, value.recommended && activeClass)}
          onClick={() => toggleFilter('recommended')}
          aria-pressed={value.recommended}
        >
          <Star className="w-3.5 h-3.5" />
          Recomendados
        </button>
        <button
          type="button"
          className={cn(baseClass, value.vegan && activeClass)}
          onClick={() => toggleFilter('vegan')}
          aria-pressed={value.vegan}
        >
          <Leaf className="w-3.5 h-3.5" />
          Vegano
        </button>
        <button
          type="button"
          className={cn(baseClass, value.spicy && activeClass)}
          onClick={() => toggleFilter('spicy')}
          aria-pressed={value.spicy}
        >
          <Flame className="w-3.5 h-3.5" />
          Picante
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="menu-tag border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            onClick={clearFilters}
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
