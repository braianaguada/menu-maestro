import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePublicMenu } from '@/hooks/usePublicMenu';
import { getThemeConfig } from '@/themes/menuThemes';
import { cn } from '@/lib/utils';
import type { Section, Item, Promotion } from '@/types/menu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

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

  return (
    <div className="flex items-baseline justify-between gap-2 py-2 border-b border-border/20 last:border-b-0">
      <div className="flex-1 min-w-0">
        <span className="font-display text-base font-medium">{item.name}</span>
        {item.description && (
          <span className="text-sm text-muted-foreground ml-2">— {item.description}</span>
        )}
      </div>
      <span className="flex-shrink-0 font-display text-base font-medium tabular-nums">
        {formatPrice(item.price)}
      </span>
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
    <section className="mb-10 p-6 bg-muted/30 rounded-lg border border-primary/20 break-inside-avoid-page">
      <h2 className="font-display text-xl font-semibold mb-4 text-primary">Promociones</h2>
      <div className="grid grid-cols-2 gap-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="p-3 bg-background rounded-md border border-border/30">
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
  const { data: menu, isLoading, error } = usePublicMenu(slug || '');
  const { isAuthenticated, loading: authLoading } = useAuth();

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

  const activePromotions = menu.promotions.filter(p => p.is_active);
  const highlightedItems = menu.sections
    .flatMap((section) => section.items)
    .filter((item) => item.is_recommended)
    .slice(0, 4);
  const menuUrl = `${window.location.origin}/m/${menu.slug}`;

  return (
    <div className={cn("print-menu bg-background text-foreground min-h-screen")}>
      {/* Print Header */}
      <header className="text-center py-10 border-b border-border/30 mb-8 print-hero">
        {menu.logo_url && (
          <img
            src={menu.logo_url}
            alt={`${menu.name} logo`}
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
        )}
        <h1 className="font-display text-4xl font-semibold tracking-tight">{menu.name}</h1>
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
        {menu.sections.map((section) => (
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
