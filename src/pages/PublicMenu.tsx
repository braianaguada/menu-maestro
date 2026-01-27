import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublicMenu, trackMenuView } from '@/hooks/usePublicMenu';
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver';
import { getThemeConfig } from '@/themes/menuThemes';
import { EditorialHeader } from '@/components/menu/EditorialHeader';
import { EditorialPromosSection } from '@/components/menu/EditorialPromosSection';
import { EditorialMenuSection } from '@/components/menu/EditorialMenuSection';
import { StickySectionsNav } from '@/components/menu/StickySectionsNav';
import { BackToTopButton } from '@/components/menu/BackToTopButton';
import { EditorialFooter } from '@/components/menu/EditorialFooter';
import { MenuNotFound } from '@/components/menu/MenuNotFound';
import { MenuLoading } from '@/components/menu/MenuLoading';
import { cn } from '@/lib/utils';
import menuPatternCassis from '@/assets/menu-pattern-cassis.jpg';

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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
      trackMenuView(menu.id);
    }
  }, [menu?.id]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 20000);

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

  if (isLoading) {
    return <MenuLoading />;
  }

  if (error || !menu) {
    return <MenuNotFound />;
  }

  // Filter active promotions based on schedule
  const activePromotions = useMemo(() => {
    const now = new Date(nowTimestamp);
    return menu.promotions.filter(p => {
      if (!p.is_active) return false;
      if (p.starts_at && new Date(p.starts_at) > now) return false;
      if (p.ends_at && new Date(p.ends_at) < now) return false;
      return true;
    });
  }, [menu.promotions, nowTimestamp]);

  const visibleSections = menu.sections.filter(s => s.items.length > 0);

  return (
    <div className={cn("min-h-screen bg-background relative overflow-hidden")}>
      {/* Cassis-style decorative background pattern */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${menuPatternCassis})`,
          backgroundSize: '900px auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'repeat',
          opacity: 0.12,
        }}
        aria-hidden="true"
      />

      {/* Subtle gradient overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, transparent 0%, hsl(var(--background)) 70%)',
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

        {/* Promotions Carousel */}
        {activePromotions.length > 0 && (
          <EditorialPromosSection
            promotions={activePromotions}
            onNavigateToSection={scrollToSection}
            onNavigateToItem={scrollToItem}
          />
        )}

        {/* Menu Sections */}
        <main className="container max-w-3xl mx-auto px-5 md:px-8 pb-16">
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
