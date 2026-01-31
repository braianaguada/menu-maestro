import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenu, useUpdateMenu, useSections, usePromotions, useUpdatePrices } from '@/hooks/useAdminMenus';
import type { MenuTheme } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  LayoutList, 
  Sparkles,
  Loader2,
  ExternalLink,
  Percent
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SectionsManager } from '@/components/admin/SectionsManager';
import { PromotionsManager } from '@/components/admin/PromotionsManager';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { QRCodeGenerator } from '@/components/admin/QRCodeGenerator';
import { cn } from '@/lib/utils';

export default function MenuEditor() {
  const { menuId } = useParams<{ menuId: string }>();
  const { data: menu, isLoading: menusLoading } = useMenu(menuId);
  const { data: sections } = useSections(menuId);
  const { data: promotions } = usePromotions(menuId);
  const updateMenu = useUpdateMenu();
  const updatePrices = useUpdatePrices();

  const [editData, setEditData] = useState<{
    name?: string;
    name_en?: string | null;
    name_pt?: string | null;
    slug?: string;
    theme?: MenuTheme;
    status?: 'draft' | 'published';
    logo_url?: string | null;
    custom_domain?: string | null;
    auto_image_enabled?: boolean;
    qr_primary_color?: string | null;
    qr_background_color?: string | null;
    qr_logo_url?: string | null;
    cta_label?: string | null;
    cta_url?: string | null;
    pos_url?: string | null;
    delivery_url?: string | null;
    hide_branding?: boolean;
  }>({});

  const [priceDialog, setPriceDialog] = useState(false);
  const [priceData, setPriceData] = useState({ percentage: '', sectionId: '' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const currentData = {
    name: editData.name ?? menu?.name ?? '',
    name_en: editData.name_en ?? menu?.name_en ?? '',
    name_pt: editData.name_pt ?? menu?.name_pt ?? '',
    slug: editData.slug ?? menu?.slug ?? '',
    theme: editData.theme ?? menu?.theme ?? 'editorial',
    status: editData.status ?? menu?.status ?? 'draft',
    logo_url: editData.logo_url !== undefined ? editData.logo_url : (menu?.logo_url ?? null),
    custom_domain: editData.custom_domain ?? menu?.custom_domain ?? '',
    auto_image_enabled: editData.auto_image_enabled ?? menu?.auto_image_enabled ?? false,
    qr_primary_color: editData.qr_primary_color ?? menu?.qr_primary_color ?? '#f97316',
    qr_background_color: editData.qr_background_color ?? menu?.qr_background_color ?? '#ffffff',
    qr_logo_url: editData.qr_logo_url ?? menu?.qr_logo_url ?? null,
    cta_label: editData.cta_label ?? menu?.cta_label ?? '',
    cta_url: editData.cta_url ?? menu?.cta_url ?? '',
    pos_url: editData.pos_url ?? menu?.pos_url ?? '',
    delivery_url: editData.delivery_url ?? menu?.delivery_url ?? '',
    hide_branding: editData.hide_branding ?? menu?.hide_branding ?? false,
  };

  const hasChanges = Object.keys(editData).length > 0;

  const handleSave = async () => {
    if (!menuId || !hasChanges) return;

    try {
      await updateMenu.mutateAsync({ id: menuId, ...editData });
      setEditData({});
      toast.success('Cambios guardados');
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        toast.error('Ya existe un menú con ese slug');
      } else {
        toast.error('Error al guardar');
      }
    }
  };

  const handlePriceUpdate = async () => {
    const percentage = parseFloat(priceData.percentage);
    if (isNaN(percentage)) {
      toast.error('Ingresa un porcentaje válido');
      return;
    }

    try {
      await updatePrices.mutateAsync({
        menuId: menuId!,
        sectionId: priceData.sectionId || undefined,
        percentage,
      });
      toast.success(`Precios actualizados ${percentage > 0 ? '+' : ''}${percentage}%`);
      setPriceDialog(false);
      setPriceData({ percentage: '', sectionId: '' });
    } catch (error) {
      toast.error('Error al actualizar precios');
    }
  };

  if (menusLoading) {
    return (
      <div className="max-w-5xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="max-w-5xl">
        <p className="text-muted-foreground">Menú no encontrado</p>
        <Button asChild className="mt-4">
          <Link to="/admin/menus">Volver a mis menús</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/menus">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Editor de menú
            </p>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              {currentData.name}
            </h1>
            <p className="text-sm text-muted-foreground">/m/{currentData.slug}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentData.status === 'published' && (
            <>
              <QRCodeGenerator
                menuSlug={currentData.slug}
                menuName={currentData.name}
                customDomain={currentData.custom_domain || undefined}
                primaryColor={currentData.qr_primary_color || undefined}
                backgroundColor={currentData.qr_background_color || undefined}
                logoUrl={currentData.qr_logo_url || undefined}
              />
              <Button variant="outline" size="sm" asChild>
                <a href={`/m/${currentData.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver menú
                </a>
              </Button>
            </>
          )}
          {hasChanges && (
            <Button onClick={handleSave} disabled={updateMenu.isPending}>
              {updateMenu.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="gradient-card border border-border/50 rounded-2xl p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Vista en vivo · Editor WYSIWYG
            </h2>
            <p className="text-sm text-muted-foreground">
              Visualizá mobile, desktop y print sin salir del editor para asegurar consistencia premium.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/m/${currentData.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Desktop
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreviewMode('mobile');
                setPreviewOpen(true);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Mobile
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/m/${currentData.slug}/print?theme=${currentData.theme}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Print
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista {previewMode === 'mobile' ? 'móvil' : 'desktop'}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <div
              className={cn(
                'border border-border/60 rounded-[2rem] overflow-hidden shadow-menu-lg bg-background',
                previewMode === 'mobile' ? 'w-[390px] h-[780px]' : 'w-full h-[80vh]'
              )}
            >
              <iframe
                title="Vista previa del menú"
                src={`/m/${currentData.slug}?view=${previewMode}`}
                className="h-full w-full"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-full bg-card/60 border border-border/50">
          <TabsTrigger value="sections" className="gap-2">
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">Secciones</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Promociones</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Secciones e ítems
            </h2>
            <Dialog open={priceDialog} onOpenChange={setPriceDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Percent className="w-4 h-4 mr-2" />
                  Ajustar precios
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajustar precios por porcentaje</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Aplicar a</Label>
                    <Select
                      value={priceData.sectionId || "all"}
                      onValueChange={(v) => setPriceData({ ...priceData, sectionId: v === "all" ? "" : v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todo el menú" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todo el menú</SelectItem>
                        {sections?.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Porcentaje</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="10"
                        value={priceData.percentage}
                        onChange={(e) => setPriceData({ ...priceData, percentage: e.target.value })}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usa valores negativos para reducir precios (ej: -10)
                    </p>
                  </div>
                  <Button
                    onClick={handlePriceUpdate}
                    className="w-full"
                    disabled={updatePrices.isPending}
                  >
                    {updatePrices.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Aplicar cambio'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <SectionsManager menuId={menuId!} autoImageEnabled={currentData.auto_image_enabled} />
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Promociones
          </h2>
          <PromotionsManager menuId={menuId!} sections={sections || []} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="gradient-card border border-border/50 rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Configuración del menú
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Logo del local</Label>
                <div className="max-w-[200px]">
                  <ImageUpload
                    value={currentData.logo_url}
                    onChange={(url) => setEditData({ ...editData, logo_url: url })}
                    folder="logos"
                    aspectRatio="square"
                    placeholder="Subir logo"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del local</Label>
                <Input
                  id="edit-name"
                  value={currentData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name-en">Nombre (EN)</Label>
                <Input
                  id="edit-name-en"
                  value={currentData.name_en}
                  onChange={(e) => setEditData({ ...editData, name_en: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name-pt">Nombre (PT)</Label>
                <Input
                  id="edit-name-pt"
                  value={currentData.name_pt}
                  onChange={(e) => setEditData({ ...editData, name_pt: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL del menú</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/m/</span>
                  <Input
                    id="edit-slug"
                    value={currentData.slug}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') 
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-domain">Dominio personalizado</Label>
                <Input
                  id="edit-domain"
                  placeholder="https://menu.turestaurante.com"
                  value={currentData.custom_domain}
                  onChange={(e) => setEditData({ ...editData, custom_domain: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tema visual</Label>
                <Select
                  value={currentData.theme}
                  onValueChange={(v) => setEditData({ ...editData, theme: v as MenuTheme })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editorial">
                      <div className="flex flex-col">
                        <span>Editorial</span>
                        <span className="text-xs text-muted-foreground">Marfil premium, serif clásico</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="modern">
                      <div className="flex flex-col">
                        <span>Modern Dark</span>
                        <span className="text-xs text-muted-foreground">Oscuro elegante, cocktail bar</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex flex-col">
                        <span>Minimal Light</span>
                        <span className="text-xs text-muted-foreground">Claro aireado, cafetería</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bistro">
                      <div className="flex flex-col">
                        <span>Bold Bistro</span>
                        <span className="text-xs text-muted-foreground">Terracota cálido, rústico</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="noir">
                      <div className="flex flex-col">
                        <span>Noir Gold</span>
                        <span className="text-xs text-muted-foreground">Oscuro premium, dorados y serif</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={currentData.status}
                  onValueChange={(v) => setEditData({ ...editData, status: v as 'draft' | 'published' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Identidad QR</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="qr-primary" className="text-xs text-muted-foreground">
                      Color primario
                    </Label>
                    <Input
                      id="qr-primary"
                      type="color"
                      value={currentData.qr_primary_color || '#f97316'}
                      onChange={(e) => setEditData({ ...editData, qr_primary_color: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="qr-bg" className="text-xs text-muted-foreground">
                      Fondo
                    </Label>
                    <Input
                      id="qr-bg"
                      type="color"
                      value={currentData.qr_background_color || '#ffffff'}
                      onChange={(e) => setEditData({ ...editData, qr_background_color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-3 max-w-[200px]">
                  <ImageUpload
                    value={currentData.qr_logo_url}
                    onChange={(url) => setEditData({ ...editData, qr_logo_url: url })}
                    folder="logos"
                    aspectRatio="square"
                    placeholder="Logo para QR"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Automatizaciones premium</Label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={currentData.auto_image_enabled}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, auto_image_enabled: !!checked })
                    }
                  />
                  <span className="text-sm">
                    Generar imágenes automáticas si un plato no tiene foto
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={currentData.hide_branding}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, hide_branding: !!checked })
                    }
                  />
                  <span className="text-sm">
                    Ocultar branding de Menu Maestro (white label light)
                  </span>
                </label>
                <div className="space-y-2">
                  <Label htmlFor="cta-label">CTA público</Label>
                  <Input
                    id="cta-label"
                    placeholder="Reservar mesa"
                    value={currentData.cta_label}
                    onChange={(e) => setEditData({ ...editData, cta_label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-url">Link CTA</Label>
                  <Input
                    id="cta-url"
                    placeholder="https://tureserva.com"
                    value={currentData.cta_url}
                    onChange={(e) => setEditData({ ...editData, cta_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-url">Integración POS</Label>
                  <Input
                    id="pos-url"
                    placeholder="https://pos.turestaurante.com"
                    value={currentData.pos_url}
                    onChange={(e) => setEditData({ ...editData, pos_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-url">Integración delivery</Label>
                  <Input
                    id="delivery-url"
                    placeholder="https://delivery.turestaurante.com"
                    value={currentData.delivery_url}
                    onChange={(e) => setEditData({ ...editData, delivery_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button onClick={handleSave} disabled={updateMenu.isPending}>
                  {updateMenu.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
