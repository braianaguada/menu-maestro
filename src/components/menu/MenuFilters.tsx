import { Flame, Leaf, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MenuFiltersState {
  vegan: boolean;
  spicy: boolean;
  recommended: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
}

interface MenuFiltersLabels {
  recommended: string;
  vegan: string;
  spicy: string;
  glutenFree: string;
  dairyFree: string;
  nutFree: string;
  clear: string;
  title: string;
}

interface MenuFiltersProps {
  value: MenuFiltersState;
  onChange: (next: MenuFiltersState) => void;
  labels?: MenuFiltersLabels;
}

const defaultLabels: MenuFiltersLabels = {
  recommended: 'Recomendados',
  vegan: 'Vegano',
  spicy: 'Picante',
  glutenFree: 'Sin gluten',
  dairyFree: 'Sin lactosa',
  nutFree: 'Sin frutos secos',
  clear: 'Limpiar',
  title: 'Filtros premium',
};

export function MenuFilters({ value, onChange, labels = defaultLabels }: MenuFiltersProps) {
  const hasActiveFilters =
    value.vegan ||
    value.spicy ||
    value.recommended ||
    value.glutenFree ||
    value.dairyFree ||
    value.nutFree;

  const toggleFilter = (key: keyof MenuFiltersState) => {
    onChange({ ...value, [key]: !value[key] });
  };

  const clearFilters = () => {
    onChange({
      vegan: false,
      spicy: false,
      recommended: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    });
  };

  const baseClass =
    'menu-tag border border-border/50 bg-background/80 text-muted-foreground hover:text-foreground transition-colors';
  const activeClass = 'bg-primary/15 text-primary border-primary/40';

  return (
    <div className="container max-w-5xl mx-auto px-6 md:px-8 py-6">
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
        <span className="h-px w-8 bg-border/60" />
        {labels.title}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={cn(baseClass, value.recommended && activeClass)}
          onClick={() => toggleFilter('recommended')}
          aria-pressed={value.recommended}
        >
          <Star className="w-3.5 h-3.5" />
          {labels.recommended}
        </button>
        <button
          type="button"
          className={cn(baseClass, value.vegan && activeClass)}
          onClick={() => toggleFilter('vegan')}
          aria-pressed={value.vegan}
        >
          <Leaf className="w-3.5 h-3.5" />
          {labels.vegan}
        </button>
        <button
          type="button"
          className={cn(baseClass, value.spicy && activeClass)}
          onClick={() => toggleFilter('spicy')}
          aria-pressed={value.spicy}
        >
          <Flame className="w-3.5 h-3.5" />
          {labels.spicy}
        </button>
        <button
          type="button"
          className={cn(baseClass, value.glutenFree && activeClass)}
          onClick={() => toggleFilter('glutenFree')}
          aria-pressed={value.glutenFree}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {labels.glutenFree}
        </button>
        <button
          type="button"
          className={cn(baseClass, value.dairyFree && activeClass)}
          onClick={() => toggleFilter('dairyFree')}
          aria-pressed={value.dairyFree}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {labels.dairyFree}
        </button>
        <button
          type="button"
          className={cn(baseClass, value.nutFree && activeClass)}
          onClick={() => toggleFilter('nutFree')}
          aria-pressed={value.nutFree}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {labels.nutFree}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="menu-tag border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            onClick={clearFilters}
          >
            <X className="w-3.5 h-3.5" />
            {labels.clear}
          </button>
        )}
      </div>
    </div>
  );
}
