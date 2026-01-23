import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenus, useUpdateMenu, useSections, usePromotions, useUpdatePrices } from '@/hooks/useAdminMenus';
import type { MenuTheme } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const { data: menus, isLoading: menusLoading } = useMenus();
  const { data: sections } = useSections(menuId);
  const { data: promotions } = usePromotions(menuId);
  const updateMenu = useUpdateMenu();
  const updatePrices = useUpdatePrices();

  const menu = menus?.find(m => m.id === menuId);

  const [editData, setEditData] = useState<{
    name?: string;
    slug?: string;
    theme?: MenuTheme;
    status?: 'draft' | 'published';
    logo_url?: string | null;
  }>({});

  const [priceDialog, setPriceDialog] = useState(false);
  const [priceData, setPriceData] = useState({ percentage: '', sectionId: '' });

  const currentData = {
    name: editData.name ?? menu?.name ?? '',
    slug: editData.slug ?? menu?.slug ?? '',
    theme: editData.theme ?? menu?.theme ?? 'elegant',
    status: editData.status ?? menu?.status ?? 'draft',
    logo_url: editData.logo_url !== undefined ? editData.logo_url : (menu?.logo_url ?? null),
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
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="max-w-4xl">
        <p className="text-muted-foreground">Menú no encontrado</p>
        <Button asChild className="mt-4">
          <Link to="/admin/menus">Volver a mis menús</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/menus">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {currentData.name}
            </h1>
            <p className="text-sm text-muted-foreground">/m/{currentData.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentData.status === 'published' && (
            <>
              <QRCodeGenerator menuSlug={currentData.slug} menuName={currentData.name} />
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

      {/* Tabs */}
      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
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
          <div className="flex items-center justify-between mb-4">
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
          <SectionsManager menuId={menuId!} />
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
          <div className="gradient-card border border-border/50 rounded-xl p-6 space-y-6">
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
