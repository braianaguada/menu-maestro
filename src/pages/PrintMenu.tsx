import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePublicMenu } from '@/hooks/usePublicMenu';
import { getThemeConfig } from '@/themes/menuThemes';
import { cn } from '@/lib/utils';
import type { Section, Item, Promotion } from '@/types/menu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

const fallbackImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop',
];

const getFallbackImage = (name: string) =>
  fallbackImages[Math.abs(name.length) % fallbackImages.length];

// Print-specific item component
function PrintMenuItem({ item }: { item: Item }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = item.image_url || getFallbackImage(item.name);

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 py-3 border-b border-border/20 last:border-b-0">
      <div className="h-20 w-20 overflow-hidden rounded-xl border border-border/40">
        <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="font-display text-base font-medium">{item.name}</span>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>
        <span className="flex-shrink-0 font-display text-base font-medium tabular-nums">
          {formatPrice(item.price)}
        </span>
      </div>
    </div>
  );
}

// Print-specific section component
function PrintSection({ section }: { section: Section & { items: Item[] } }) {
  if (section.items.length === 0) return null;

  return (
    <section className="mb-10 break-inside-avoid-page">
      <h2 className="font-display text-2xl font-semibold mb-2">{section.name}</h2>
      {section.description && (
        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
      )}
      <div className="border-t border-primary/30 pt-3">
        {section.items.map((item) => (
          <PrintMenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// Print-specific promotions
function PrintPromotions({ promotions }: { promotions: Promotion[] }) {
  if (promotions.length === 0) return null;

  return (
    <section className="mb-10 p-6 bg-muted/30 rounded-2xl border border-primary/20 break-inside-avoid-page">
      <h2 className="font-display text-xl font-semibold mb-4 text-primary">Promociones</h2>
      <div className="grid grid-cols-2 gap-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="p-3 bg-background rounded-xl border border-border/30">
            <div className="h-24 w-full overflow-hidden rounded-lg border border-border/30 mb-2">
              <img
                src={promo.image_url || getFallbackImage(promo.title)}
                alt={promo.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="font-display font-semibold mb-1">{promo.title}</div>
            <div className="text-primary font-semibold text-sm">{promo.price_text}</div>
            {promo.description && (
              <p className="text-xs text-muted-foreground mt-1">{promo.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PrintHighlights({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10 p-6 bg-background rounded-2xl border border-primary/20 break-inside-avoid-page">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
        Selección del chef
      </p>
      <h2 className="font-display text-2xl font-semibold mb-4">Platos destacados</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border/40 p-4">
            <div className="h-24 w-full overflow-hidden rounded-lg border border-border/30 mb-2">
              <img
                src={item.image_url || getFallbackImage(item.name)}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="font-display text-base font-semibold">{item.name}</div>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PrintQRCode({ menuUrl }: { menuUrl: string }) {
  return (
    <section className="print-qr mt-12 text-center break-inside-avoid-page">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Versión digital
      </p>
      <div className="inline-flex items-center justify-center rounded-2xl border border-border/40 bg-background p-4">
        <QRCodeSVG value={menuUrl} size={140} level="H" bgColor="#ffffff" fgColor="#111827" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{menuUrl}</p>
    </section>
  );
}

export default function PrintMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const themeParam = searchParams.get('theme') || 'editorial';
  const langParam = searchParams.get('lang') || 'es';
  const { data: menu, isLoading, error } = usePublicMenu(slug || '');
  const { isAuthenticated, loading: authLoading } = useAuth();

  const getLocalizedValue = (
    base: string,
    translations: { en?: string | null; pt?: string | null }
  ) => {
    if (langParam === 'en' && translations.en) return translations.en;
    if (langParam === 'pt' && translations.pt) return translations.pt;
    return base;
  };

  // Apply theme
  useEffect(() => {
    const themeConfig = getThemeConfig(themeParam);
    document.documentElement.classList.remove(
      'theme-editorial',
      'theme-modern',
      'theme-light',
      'theme-bistro',
      'theme-noir'
    );
    document.documentElement.classList.add(themeConfig.className);

    return () => {
      document.documentElement.classList.remove(themeConfig.className);
    };
  }, [themeParam]);

  // Auto-print when loaded
  useEffect(() => {
    if (menu && !isLoading && !error) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [menu, isLoading, error]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando acceso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Acceso restringido
          </p>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Descarga disponible solo para administradores
          </h1>
          <p className="text-muted-foreground">
            Iniciá sesión para exportar el menú en PDF.
          </p>
          <Button asChild>
            <Link to="/auth">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Cargando menú...</p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">No se pudo cargar el menú.</p>
      </div>
    );
  }

  const localizedMenu = {
    ...menu,
    name: getLocalizedValue(menu.name, { en: menu.name_en, pt: menu.name_pt }),
    sections: menu.sections.map((section) => ({
      ...section,
      name: getLocalizedValue(section.name, { en: section.name_en, pt: section.name_pt }),
      description: section.description
        ? getLocalizedValue(section.description, { en: section.description_en, pt: section.description_pt })
        : section.description,
      items: section.items.map((item) => ({
        ...item,
        name: getLocalizedValue(item.name, { en: item.name_en, pt: item.name_pt }),
        description: item.description
          ? getLocalizedValue(item.description, { en: item.description_en, pt: item.description_pt })
          : item.description,
      })),
    })),
    promotions: menu.promotions.map((promo) => ({
      ...promo,
      title: getLocalizedValue(promo.title, { en: promo.title_en, pt: promo.title_pt }),
      description: promo.description
        ? getLocalizedValue(promo.description, { en: promo.description_en, pt: promo.description_pt })
        : promo.description,
      price_text: getLocalizedValue(promo.price_text, { en: promo.price_text_en, pt: promo.price_text_pt }),
    })),
  };

  const activePromotions = localizedMenu.promotions.filter(p => p.is_active);
  const highlightedItems = localizedMenu.sections
    .flatMap((section) => section.items)
    .filter((item) => item.is_recommended)
    .slice(0, 4);
  const normalizeDomain = (domain?: string | null) => {
    if (!domain) return null;
    const trimmed = domain.trim().replace(/\/$/, '');
    if (!trimmed) return null;
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  };
  const menuBaseUrl = normalizeDomain(menu.custom_domain) || `${window.location.origin}/m/${menu.slug}`;
  const menuUrl = (() => {
    const url = new URL(menuBaseUrl);
    if (langParam) {
      url.searchParams.set('lang', langParam);
    }
    return url.toString();
  })();

  return (
    <div className={cn("print-menu bg-background text-foreground min-h-screen")}>
      {/* Print Header */}
      <header className="text-center py-10 border-b border-border/30 mb-8 print-hero">
        {menu.logo_url && (
          <img
            src={menu.logo_url}
            alt={`${localizedMenu.name} logo`}
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
        )}
        <h1 className="font-display text-4xl font-semibold tracking-tight">{localizedMenu.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Carta curada para una experiencia premium.
        </p>
      </header>

      {/* Content Container */}
      <main className="px-8 max-w-4xl mx-auto">
        {/* Promotions block */}
        <PrintPromotions promotions={activePromotions} />
        <PrintHighlights items={highlightedItems} />

        {/* Sections */}
        {localizedMenu.sections.map((section) => (
          <PrintSection key={section.id} section={section} />
        ))}
      </main>

      {/* Print Footer */}
      <footer className="text-center py-8 mt-12 border-t border-border/30">
        <PrintQRCode menuUrl={menuUrl} />
        <p className="mt-6 text-xs text-muted-foreground">Menú digital</p>
      </footer>
    </div>
  );
}
