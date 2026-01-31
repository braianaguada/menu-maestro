import { useEffect, useMemo, useState } from 'react';
import { parseISO, isValid } from 'date-fns';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePublicMenu, trackMenuView } from '@/hooks/usePublicMenu';
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver';
import { getThemeConfig } from '@/themes/menuThemes';
import { EditorialHeader } from '@/components/menu/EditorialHeader';
import { EditorialPromosSection } from '@/components/menu/EditorialPromosSection';
import { EditorialMenuSection } from '@/components/menu/EditorialMenuSection';
import { EditorialHighlightsSection } from '@/components/menu/EditorialHighlightsSection';
import { MenuFilters, MenuFiltersState } from '@/components/menu/MenuFilters';
import { StickySectionsNav } from '@/components/menu/StickySectionsNav';
import { BackToTopButton } from '@/components/menu/BackToTopButton';
import { EditorialFooter } from '@/components/menu/EditorialFooter';
import { MenuNotFound } from '@/components/menu/MenuNotFound';
import { MenuLoading } from '@/components/menu/MenuLoading';
import { cn } from '@/lib/utils';
import { getChefNote, getOriginNote, getPairingSuggestion } from '@/lib/menuSuggestions';

const supportedLanguages = ['es', 'en', 'pt'] as const;
type SupportedLanguage = typeof supportedLanguages[number];

const copyByLanguage: Record<SupportedLanguage, {
  modeLabel: string;
  modeAuto: string;
  modeNight: string;
  modeDay: string;
  languageLabel: string;
  languageAuto: string;
  experienceTitle: string;
  experienceDescription: string;
  experienceTags: string[];
  storyTitle: string;
  storyDescription: string;
  storyOrigin: string;
  storyChef: string;
  storyPairing: string;
  storyOriginLabel: string;
  storyChefLabel: string;
  storyPairingLabel: string;
  storyPairingEmpty: string;
  galleryTitle: string;
  galleryDescription: string;
  filters: {
    recommended: string;
    vegan: string;
    spicy: string;
    glutenFree: string;
    dairyFree: string;
    nutFree: string;
    clear: string;
    title: string;
  };
  emptyFilters: string;
  clearFilters: string;
}> = {
  es: {
    modeLabel: 'Modo',
    modeAuto: 'Auto',
    modeNight: 'Nocturno',
    modeDay: 'Diurno',
    languageLabel: 'Idioma',
    languageAuto: 'Detección automática',
    experienceTitle: 'Experiencia premium en vivo',
    experienceDescription:
      'Micro-animaciones suaves, parallax editorial y un modo nocturno/diurno que mantiene la carta impecable.',
    experienceTags: ['Parallax', 'Transiciones suaves', 'UI editorial'],
    storyTitle: 'Storytelling del menú',
    storyDescription: 'Historia, notas y maridajes para elevar el valor percibido.',
    storyOrigin: 'Origen',
    storyChef: 'Notas del chef',
    storyPairing: 'Maridajes',
    storyOriginLabel: 'Origen',
    storyChefLabel: 'Notas del chef',
    storyPairingLabel: 'Maridajes',
    storyPairingEmpty: 'Curaduría de maridajes disponible al destacar platos favoritos.',
    galleryTitle: 'Galería editorial optimizada',
    galleryDescription: 'Fotografía curada, compresión automática y layout premium.',
    filters: {
      recommended: 'Recomendados',
      vegan: 'Vegano',
      spicy: 'Picante',
      glutenFree: 'Sin gluten',
      dairyFree: 'Sin lactosa',
      nutFree: 'Sin frutos secos',
      clear: 'Limpiar',
      title: 'Filtros premium',
    },
    emptyFilters: 'No hay platos con los filtros seleccionados.',
    clearFilters: 'Limpiar filtros',
  },
  en: {
    modeLabel: 'Mode',
    modeAuto: 'Auto',
    modeNight: 'Night',
    modeDay: 'Day',
    languageLabel: 'Language',
    languageAuto: 'Auto-detect',
    experienceTitle: 'Live premium experience',
    experienceDescription:
      'Subtle micro-animations, editorial parallax, and night/day modes for a flawless menu.',
    experienceTags: ['Parallax', 'Smooth transitions', 'Editorial UI'],
    storyTitle: 'Menu storytelling',
    storyDescription: 'Origin, chef notes, and pairings to elevate perceived value.',
    storyOrigin: 'Origin',
    storyChef: 'Chef notes',
    storyPairing: 'Pairings',
    storyOriginLabel: 'Origin',
    storyChefLabel: 'Chef notes',
    storyPairingLabel: 'Pairings',
    storyPairingEmpty: 'Pairing curation appears once favorites are highlighted.',
    galleryTitle: 'Optimized editorial gallery',
    galleryDescription: 'Curated imagery, auto-compression, premium layout.',
    filters: {
      recommended: 'Chef picks',
      vegan: 'Vegan',
      spicy: 'Spicy',
      glutenFree: 'Gluten-free',
      dairyFree: 'Dairy-free',
      nutFree: 'Nut-free',
      clear: 'Clear',
      title: 'Premium filters',
    },
    emptyFilters: 'No items match the selected filters.',
    clearFilters: 'Clear filters',
  },
  pt: {
    modeLabel: 'Modo',
    modeAuto: 'Auto',
    modeNight: 'Noturno',
    modeDay: 'Diurno',
    languageLabel: 'Idioma',
    languageAuto: 'Detecção automática',
    experienceTitle: 'Experiência premium ao vivo',
    experienceDescription:
      'Micro-animações suaves, parallax editorial e modo noturno/diurno para um menu impecável.',
    experienceTags: ['Parallax', 'Transições suaves', 'UI editorial'],
    storyTitle: 'Storytelling do menu',
    storyDescription: 'Origem, notas do chef e harmonizações para elevar o valor percebido.',
    storyOrigin: 'Origem',
    storyChef: 'Notas do chef',
    storyPairing: 'Harmonizações',
    storyOriginLabel: 'Origem',
    storyChefLabel: 'Notas do chef',
    storyPairingLabel: 'Harmonizações',
    storyPairingEmpty: 'A curadoria de harmonizações aparece ao destacar favoritos.',
    galleryTitle: 'Galeria editorial otimizada',
    galleryDescription: 'Fotografia curada, compressão automática, layout premium.',
    filters: {
      recommended: 'Recomendados',
      vegan: 'Vegano',
      spicy: 'Picante',
      glutenFree: 'Sem glúten',
      dairyFree: 'Sem lactose',
      nutFree: 'Sem oleaginosas',
      clear: 'Limpar',
      title: 'Filtros premium',
    },
    emptyFilters: 'Não há pratos com os filtros selecionados.',
    clearFilters: 'Limpar filtros',
  },
};

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: menu, isLoading, error } = usePublicMenu(slug || '');
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());
  const [filters, setFilters] = useState<MenuFiltersState>({
    vegan: false,
    spicy: false,
    recommended: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  });
  const detectLanguage = () => {
    const paramLang = searchParams.get('lang')?.toLowerCase();
    if (paramLang && supportedLanguages.includes(paramLang as SupportedLanguage)) {
      return paramLang as SupportedLanguage;
    }
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2).toLowerCase() : 'es';
    return supportedLanguages.includes(browserLang as SupportedLanguage)
      ? (browserLang as SupportedLanguage)
      : 'es';
  };
  const [language, setLanguage] = useState<SupportedLanguage>(detectLanguage());
  const [themeMode, setThemeMode] = useState<'auto' | 'night' | 'day'>('auto');
  const copy = copyByLanguage[language];

  // Track page view on mount
  useEffect(() => {
    if (menu?.id) {
      const source = searchParams.get('source');
      trackMenuView(menu.id, source);
    }
  }, [menu?.id, searchParams]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const paramLang = searchParams.get('lang')?.toLowerCase();
    if (paramLang && supportedLanguages.includes(paramLang as SupportedLanguage)) {
      setLanguage(paramLang as SupportedLanguage);
    }
  }, [searchParams, supportedLanguages]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = Math.min(window.scrollY * 0.18, 80);
      document.documentElement.style.setProperty('--hero-parallax', `${offset}px`);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme class
  useEffect(() => {
    if (menu?.theme) {
      const themeConfig = getThemeConfig(menu.theme);
      const themeClasses = ['theme-editorial', 'theme-modern', 'theme-light', 'theme-bistro', 'theme-noir'];
      document.documentElement.classList.remove(...themeClasses);
      const overrideClass =
        themeMode === 'night'
          ? 'theme-noir'
          : themeMode === 'day'
          ? 'theme-light'
          : themeConfig.className;
      document.documentElement.classList.add(overrideClass);
    }
    return () => {
      document.documentElement.classList.remove(
        'theme-editorial', 'theme-modern', 'theme-light', 'theme-bistro', 'theme-noir'
      );
    };
  }, [menu?.theme, themeMode]);

  // Filter active promotions based on schedule
  const activePromotions = useMemo(() => {
    if (!menu) return [];
    const now = new Date(nowTimestamp);
    return menu.promotions.filter(p => {
      if (!p.is_active) return false;
      if (p.starts_at) {
        const startsAt = parseISO(p.starts_at);
        if (isValid(startsAt) && startsAt > now) return false;
      }
      if (p.ends_at) {
        const endsAt = parseISO(p.ends_at);
        if (isValid(endsAt) && endsAt < now) return false;
      }
      return true;
    });
  }, [menu, nowTimestamp]);

  const visibleSections = useMemo(() => {
    if (!menu) return [];
    return menu.sections.filter(s => s.items.length > 0);
  }, [menu]);

  const filteredSections = useMemo(() => {
    if (visibleSections.length === 0) return [];
    const { vegan, spicy, recommended, glutenFree, dairyFree, nutFree } = filters;

    if (!vegan && !spicy && !recommended && !glutenFree && !dairyFree && !nutFree) {
      return visibleSections;
    }

    return visibleSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          if (vegan && !item.is_vegan) return false;
          if (spicy && !item.is_spicy) return false;
          if (recommended && !item.is_recommended) return false;
          if (glutenFree && !item.is_gluten_free) return false;
          if (dairyFree && !item.is_dairy_free) return false;
          if (nutFree && item.allergens?.includes('nuts')) return false;
          return true;
        }),
      }))
      .filter(section => section.items.length > 0);
  }, [filters, visibleSections]);

  const sectionIds = useMemo(() => filteredSections.map(s => s.id), [filteredSections]);

  // Active section observer with scroll helpers
  const { activeSectionId, scrollToSection, scrollToItem } = useActiveSectionObserver({
    sectionIds,
    offset: 100,
  });

  const highlightedItems = useMemo(() => {
    if (visibleSections.length === 0) return [];
    return visibleSections
      .flatMap(section =>
        section.items
          .filter(item => item.is_recommended)
          .map(item => ({
            item,
            sectionName: section.name,
          }))
      )
      .slice(0, 4);
  }, [visibleSections]);

  const pairingHighlights = useMemo(() => {
    return highlightedItems.slice(0, 3).map(({ item }) => ({
      name: item.name,
      suggestion: item.pairing || getPairingSuggestion(item.name),
    }));
  }, [highlightedItems]);

  if (isLoading) {
    return <MenuLoading />;
  }

  if (error || !menu) {
    return <MenuNotFound />;
  }

  return (
    <div className={cn("min-h-screen bg-background relative overflow-x-hidden")}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top, hsl(var(--primary) / 0.15), transparent 45%), radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.12), transparent 40%)',
        }}
        aria-hidden="true"
      />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header - Hero */}
        <EditorialHeader name={menu.name} logoUrl={menu.logo_url} />

        <section className="py-8 md:py-10 section-fade section-fade-delay-1">
          <div className="container max-w-5xl mx-auto px-6 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="menu-card p-6">
                <p className="menu-chip">Premium</p>
                <h2 className="mt-4 text-xl md:text-2xl font-display font-semibold text-foreground">
                  {copy.experienceTitle}
                </h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  {copy.experienceDescription}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.experienceTags.map((tag) => (
                    <span key={tag} className="menu-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="menu-card p-6 space-y-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {copy.modeLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['auto', 'night', 'day'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setThemeMode(mode)}
                        className={cn(
                          'menu-tag border border-border/50 transition-colors',
                          themeMode === mode && 'bg-primary/15 text-primary border-primary/40'
                        )}
                      >
                        {mode === 'auto' && copy.modeAuto}
                        {mode === 'night' && copy.modeNight}
                        {mode === 'day' && copy.modeDay}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {copy.languageLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          'menu-tag border border-border/50 transition-colors',
                          language === lang && 'bg-primary/15 text-primary border-primary/40'
                        )}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground/80 ml-2 self-center">
                      {copy.languageAuto}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Section Navigation */}
        <StickySectionsNav
          sections={filteredSections}
          activeSectionId={activeSectionId}
          onSectionClick={scrollToSection}
        />

        <MenuFilters value={filters} onChange={setFilters} labels={copy.filters} />

        {/* Highlights */}
        <EditorialHighlightsSection
          items={highlightedItems}
          onNavigateToItem={scrollToItem}
        />

        <section className="py-14 md:py-18 border-t border-border/40 section-fade section-fade-delay-2">
          <div className="container max-w-5xl mx-auto px-6 md:px-8">
            <div className="mb-8">
              <p className="menu-chip">{copy.storyTitle}</p>
              <h2 className="mt-4 text-2xl md:text-3xl font-display font-semibold text-foreground">
                {copy.storyTitle}
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
                {copy.storyDescription}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="menu-card p-5 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.storyOriginLabel}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{copy.storyOrigin}</h3>
                <p className="text-sm text-muted-foreground">
                  {menu.sections[0]?.description || getOriginNote(menu.name)}
                </p>
              </div>
              <div className="menu-card p-5 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.storyChefLabel}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{copy.storyChef}</h3>
                <p className="text-sm text-muted-foreground">
                  {getChefNote(menu.name)}
                </p>
              </div>
              <div className="menu-card p-5 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.storyPairingLabel}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{copy.storyPairing}</h3>
                {pairingHighlights.length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pairingHighlights.map((pairing) => (
                      <li key={pairing.name} className="flex flex-col">
                        <span className="font-semibold text-foreground">{pairing.name}</span>
                        <span>{pairing.suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {copy.storyPairingEmpty}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Carousel */}
        {activePromotions.length > 0 && (
          <EditorialPromosSection
            promotions={activePromotions}
            onNavigateToSection={scrollToSection}
            onNavigateToItem={scrollToItem}
          />
        )}

        <section className="py-14 md:py-18 border-t border-border/40 section-fade section-fade-delay-3">
          <div className="container max-w-5xl mx-auto px-6 md:px-8">
            <div className="mb-8">
              <p className="menu-chip">{copy.galleryTitle}</p>
              <h2 className="mt-4 text-2xl md:text-3xl font-display font-semibold text-foreground">
                {copy.galleryTitle}
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
                {copy.galleryDescription}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
                  label: 'Entradas de estación',
                },
                {
                  src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop',
                  label: 'Platos principales',
                },
                {
                  src: 'https://images.unsplash.com/photo-1505253213348-ce3f1bf45a82?q=80&w=1200&auto=format&fit=crop',
                  label: 'Postres de autor',
                },
              ].map((item) => (
                <div key={item.label} className="group relative overflow-hidden rounded-3xl border border-border/50">
                  <img
                    src={item.src}
                    srcSet={`${item.src}&w=600 600w, ${item.src}&w=900 900w`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    alt={item.label}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        <main className="container max-w-5xl mx-auto px-5 md:px-8 pb-24 md:pb-16">
          {filteredSections.map((section) => (
            <EditorialMenuSection key={section.id} section={section} />
          ))}

          {filteredSections.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wider">
                {copy.emptyFilters}
              </p>
              <button
                type="button"
                className="mt-4 menu-tag border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() =>
                  setFilters({
                    vegan: false,
                    spicy: false,
                    recommended: false,
                    glutenFree: false,
                    dairyFree: false,
                    nutFree: false,
                  })
                }
              >
                {copy.clearFilters}
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <EditorialFooter />

        {/* Back to Top Button */}
        <BackToTopButton threshold={600} />
      </div>
    </div>
  );
}
