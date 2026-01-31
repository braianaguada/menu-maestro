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
import { StickySectionsNav } from '@/components/menu/StickySectionsNav';
import { BackToTopButton } from '@/components/menu/BackToTopButton';
import { EditorialFooter } from '@/components/menu/EditorialFooter';
import { MenuNotFound } from '@/components/menu/MenuNotFound';
import { MenuLoading } from '@/components/menu/MenuLoading';
import { cn } from '@/lib/utils';

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: menu, isLoading, error } = usePublicMenu(slug || '');
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  // Memoize section IDs for observer
  const sectionIds = useMemo(() => 
    menu?.sections.map(s => s.id) || [], 
    [menu?.sections]
  );

  // Active section observer with scroll helpers
  const { activeSectionId, scrollToSection, scrollToItem } = useActiveSectionObserver({
    sectionIds,
    offset: 100,
  });

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

  // Apply theme class
  useEffect(() => {
    if (menu?.theme) {
      const themeConfig = getThemeConfig(menu.theme);
      document.documentElement.classList.remove(
        'theme-editorial', 'theme-modern', 'theme-light', 'theme-bistro'
      );
      document.documentElement.classList.add(themeConfig.className);
    }
    return () => {
      document.documentElement.classList.remove(
        'theme-editorial', 'theme-modern', 'theme-light', 'theme-bistro'
      );
    };
  }, [menu?.theme]);

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

        {/* Sticky Section Navigation */}
        <StickySectionsNav
          sections={visibleSections}
          activeSectionId={activeSectionId}
          onSectionClick={scrollToSection}
        />

        {/* Highlights */}
        <EditorialHighlightsSection
          items={highlightedItems}
          onNavigateToItem={scrollToItem}
        />

        {/* Promotions Carousel */}
        {activePromotions.length > 0 && (
          <EditorialPromosSection
            promotions={activePromotions}
            onNavigateToSection={scrollToSection}
            onNavigateToItem={scrollToItem}
          />
        )}

        {/* Menu Sections */}
        <main className="container max-w-5xl mx-auto px-5 md:px-8 pb-24 md:pb-16">
          {visibleSections.map((section) => (
            <EditorialMenuSection key={section.id} section={section} />
          ))}

          {visibleSections.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wider">
                Este menú aún no tiene secciones.
              </p>
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
