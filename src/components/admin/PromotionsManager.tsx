import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
  useAllMenuItems,
} from '@/hooks/useAdminMenus';
import { useReorderMutation } from '@/hooks/useSortableList';
import { SortableItem } from './SortableItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, EyeOff, Sparkles, Loader2, ImageIcon, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Promotion, Section } from '@/types/menu';
import { format } from 'date-fns';

interface PromotionsManagerProps {
  menuId: string;
  sections: Section[];
}

const defaultFormData = {
  title: '',
  description: '',
  price_text: '',
  image_url: null as string | null,
  linked_section_id: '',
  linked_item_id: '',
  starts_at: '',
  ends_at: '',
};

export function PromotionsManager({ menuId, sections }: PromotionsManagerProps) {
  const { data: promotions, isLoading } = usePromotions(menuId);
  const { data: items } = useAllMenuItems(menuId);
  const createPromo = useCreatePromotion();
  const updatePromo = useUpdatePromotion();
  const deletePromo = useDeletePromotion();
  const reorderMutation = useReorderMutation('promotions', [['admin-promotions', menuId]]);

  const [localPromos, setLocalPromos] = useState<Promotion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [linkType, setLinkType] = useState<'none' | 'section' | 'item'>('none');

  useEffect(() => {
    if (promotions) {
      setLocalPromos(promotions);
    }
  }, [promotions]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localPromos.findIndex(p => p.id === active.id);
    const newIndex = localPromos.findIndex(p => p.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = [...localPromos];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      setLocalPromos(newItems);
      reorderMutation.mutate(newItems.map((p, i) => ({ id: p.id, sort_order: i })));
    }
  };

  const formatDateTimeForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return '';
    }
  };

  const openEditDialog = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description || '',
      price_text: promo.price_text,
      image_url: promo.image_url || null,
      linked_section_id: promo.linked_section_id || '',
      linked_item_id: promo.linked_item_id || '',
      starts_at: formatDateTimeForInput(promo.starts_at),
      ends_at: formatDateTimeForInput(promo.ends_at),
    });
    if (promo.linked_item_id) {
      setLinkType('item');
    } else if (promo.linked_section_id) {
      setLinkType('section');
    } else {
      setLinkType('none');
    }
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPromo(null);
    setFormData(defaultFormData);
    setLinkType('none');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.price_text.trim()) {
      toast.error('Título y precio son requeridos');
      return;
    }

    const data = {
      menu_id: menuId,
      title: formData.title,
      description: formData.description || undefined,
      price_text: formData.price_text,
      image_url: formData.image_url,
      linked_section_id: linkType === 'section' ? formData.linked_section_id || undefined : undefined,
      linked_item_id: linkType === 'item' ? formData.linked_item_id || undefined : undefined,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
    };

    try {
      if (editingPromo) {
        await updatePromo.mutateAsync({ id: editingPromo.id, ...data });
        toast.success('Promoción actualizada');
      } else {
        const nextOrder = promotions?.length || 0;
        await createPromo.mutateAsync({ ...data, sort_order: nextOrder });
        toast.success('Promoción creada');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePromo.mutateAsync({ id: deleteId, menu_id: menuId });
      toast.success('Promoción eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setDeleteId(null);
  };

  const toggleActive = async (promo: Promotion) => {
    try {
      await updatePromo.mutateAsync({
        id: promo.id,
        menu_id: menuId,
        is_active: !promo.is_active,
      });
      toast.success(promo.is_active ? 'Promoción desactivada' : 'Promoción activada');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const getScheduleStatus = (promo: Promotion) => {
    if (!promo.starts_at && !promo.ends_at) return null;
    
    const now = new Date();
    const starts = promo.starts_at ? new Date(promo.starts_at) : null;
    const ends = promo.ends_at ? new Date(promo.ends_at) : null;

    if (starts && now < starts) {
      return { label: 'Programada', className: 'bg-blue-500/10 text-blue-500' };
    }
    if (ends && now > ends) {
      return { label: 'Expirada', className: 'bg-red-500/10 text-red-500' };
    }
    if (starts || ends) {
      return { label: 'Activa', className: 'bg-green-500/10 text-green-500' };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localPromos.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {localPromos.length > 0 ? (
            localPromos.map((promo) => {
              const scheduleStatus = getScheduleStatus(promo);
              return (
                <SortableItem key={promo.id} id={promo.id}>
                  <div
                    className={cn(
                      "gradient-card border rounded-xl p-4",
                      promo.is_active ? "border-border/50" : "border-yellow-500/30 opacity-75"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {promo.image_url ? (
                          <img
                            src={promo.image_url}
                            alt={promo.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h3 className="font-medium text-foreground">{promo.title}</h3>
                            {!promo.is_active && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                                Inactivo
                              </span>
                            )}
                            {scheduleStatus && (
                              <span className={cn("px-2 py-0.5 rounded-full text-xs flex items-center gap-1", scheduleStatus.className)}>
                                <Clock className="w-3 h-3" />
                                {scheduleStatus.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary font-semibold">{promo.price_text}</p>
                          {promo.description && (
                            <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                          )}
                          {(promo.starts_at || promo.ends_at) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {promo.starts_at && `Desde: ${format(new Date(promo.starts_at), 'dd/MM/yy HH:mm')}`}
                              {promo.starts_at && promo.ends_at && ' · '}
                              {promo.ends_at && `Hasta: ${format(new Date(promo.ends_at), 'dd/MM/yy HH:mm')}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(promo)}
                        >
                          {promo.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(promo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(promo.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              );
            })
          ) : (
            <div className="gradient-card border border-border/50 rounded-xl p-8 text-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No hay promociones aún</p>
            </div>
          )}
        </SortableContext>
      </DndContext>

      <Button onClick={openCreateDialog} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Agregar promoción
      </Button>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? 'Editar promoción' : 'Nueva promoción'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="promo-title">Título</Label>
              <Input
                id="promo-title"
                placeholder="Ej: Happy Hour"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-price">Texto de precio</Label>
              <Input
                id="promo-price"
                placeholder="Ej: 2x1, $6500, 20% OFF"
                value={formData.price_text}
                onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-desc">Descripción (opcional)</Label>
              <Textarea
                id="promo-desc"
                placeholder="Descripción de la promo"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen (opcional)</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="promotions"
                aspectRatio="wide"
                placeholder="Imagen de promoción"
              />
            </div>

            {/* Schedule fields */}
            <div className="border-t border-border/50 pt-4">
              <Label className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" />
                Programar horarios (opcional)
              </Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="starts-at" className="text-sm text-muted-foreground">Desde</Label>
                  <Input
                    id="starts-at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ends-at" className="text-sm text-muted-foreground">Hasta</Label>
                  <Input
                    id="ends-at"
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Deja vacío para que la promo esté siempre activa
              </p>
            </div>

            <div className="space-y-2">
              <Label>Vincular a (opcional)</Label>
              <Select
                value={linkType}
                onValueChange={(v) => {
                  setLinkType(v as 'none' | 'section' | 'item');
                  setFormData({ ...formData, linked_section_id: '', linked_item_id: '' });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin vínculo</SelectItem>
                  <SelectItem value="section">Sección</SelectItem>
                  <SelectItem value="item">Ítem específico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkType === 'section' && sections.length > 0 && (
              <div className="space-y-2">
                <Label>Sección</Label>
                <Select
                  value={formData.linked_section_id || undefined}
                  onValueChange={(v) => setFormData({ ...formData, linked_section_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {linkType === 'item' && items && items.length > 0 && (
              <div className="space-y-2">
                <Label>Ítem</Label>
                <Select
                  value={formData.linked_item_id || undefined}
                  onValueChange={(v) => setFormData({ ...formData, linked_item_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ítem" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map(item => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={createPromo.isPending || updatePromo.isPending}
            >
              {(createPromo.isPending || updatePromo.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingPromo ? (
                'Guardar cambios'
              ) : (
                'Crear promoción'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
