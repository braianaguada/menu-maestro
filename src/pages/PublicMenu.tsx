import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMenu, trackMenuView } from '@/hooks/usePublicMenu';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { PromotionsCarousel } from '@/components/menu/PromotionsCarousel';
import { MenuSection } from '@/components/menu/MenuSection';
import { MenuNotFound } from '@/components/menu/MenuNotFound';
import { MenuLoading } from '@/components/menu/MenuLoading';
import { cn } from '@/lib/utils';

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const { data: menu, isLoading, error } = usePublicMenu(slug || '');

  // Track page view on mount
  useEffect(() => {
    if (menu?.id) {
      trackMenuView(menu.id);
    }
  }, [menu?.id]);

  // Apply theme class
  useEffect(() => {
    if (menu?.theme) {
      document.documentElement.classList.remove('theme-light', 'theme-modern');
      if (menu.theme !== 'elegant') {
        document.documentElement.classList.add(`theme-${menu.theme}`);
      }
    }
    return () => {
      document.documentElement.classList.remove('theme-light', 'theme-modern');
    };
  }, [menu?.theme]);

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add highlight effect
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
      }, 2000);
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    scrollToElement(`section-${sectionId}`);
  };

  const handleNavigateToItem = (itemId: string) => {
    scrollToElement(`item-${itemId}`);
  };

  if (isLoading) {
    return <MenuLoading />;
  }

  if (error || !menu) {
    return <MenuNotFound />;
  }

  const activePromotions = menu.promotions.filter(p => p.is_active);

  return (
    <div className={cn("min-h-screen gradient-dark")}>
      <MenuHeader name={menu.name} logoUrl={menu.logo_url} />

      {/* Promotions Carousel */}
      {activePromotions.length > 0 && (
        <PromotionsCarousel
          promotions={activePromotions}
          onNavigateToSection={handleNavigateToSection}
          onNavigateToItem={handleNavigateToItem}
        />
      )}

      {/* Menu Sections */}
      <main className="container max-w-2xl mx-auto px-4 pb-12">
        {menu.sections.map((section) => (
          <MenuSection key={section.id} section={section} />
        ))}

        {menu.sections.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Este menú aún no tiene secciones.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Menú digital creado con ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
