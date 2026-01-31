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
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '@/hooks/useAdminMenus';
import { useReorderMutation } from '@/hooks/useSortableList';
import { SortableItem } from './SortableItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Leaf, Flame, Loader2, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Item } from '@/types/menu';
import { buildAutoImageUrl } from '@/lib/autoImage';

interface ItemsManagerProps {
  sectionId: string;
  autoImageEnabled?: boolean;
}

const allergenOptions = [
  { id: 'nuts', label: 'Frutos secos' },
  { id: 'seafood', label: 'Mariscos' },
  { id: 'egg', label: 'Huevo' },
  { id: 'soy', label: 'Soja' },
];

const defaultFormData = {
  name: '',
  description: '',
  name_en: '',
  name_pt: '',
  description_en: '',
  description_pt: '',
  pairing: '',
  pairing_en: '',
  pairing_pt: '',
  price: '',
  image_url: null as string | null,
  is_recommended: false,
  is_vegan: false,
  is_spicy: false,
  is_gluten_free: false,
  is_dairy_free: false,
  allergens: [] as string[],
};

export function ItemsManager({ sectionId, autoImageEnabled = false }: ItemsManagerProps) {
  const { data: items, isLoading } = useItems(sectionId);
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const reorderMutation = useReorderMutation('items', [['admin-items', sectionId]]);

  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (items) {
      setLocalItems(items);
    }
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex(i => i.id === active.id);
    const newIndex = localItems.findIndex(i => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = [...localItems];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      setLocalItems(newItems);
      reorderMutation.mutate(newItems.map((item, i) => ({ id: item.id, sort_order: i })));
    }
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      name_en: item.name_en || '',
      name_pt: item.name_pt || '',
      description_en: item.description_en || '',
      description_pt: item.description_pt || '',
      pairing: item.pairing || '',
      pairing_en: item.pairing_en || '',
      pairing_pt: item.pairing_pt || '',
      price: item.price.toString(),
      image_url: item.image_url || null,
      is_recommended: item.is_recommended,
      is_vegan: item.is_vegan,
      is_spicy: item.is_spicy,
      is_gluten_free: item.is_gluten_free ?? false,
      is_dairy_free: item.is_dairy_free ?? false,
      allergens: item.allergens ?? [],
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('Ingresa un precio válido');
      return;
    }

    const resolvedImageUrl =
      formData.image_url ||
      (autoImageEnabled ? buildAutoImageUrl(formData.name) : null);

    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          section_id: sectionId,
          name: formData.name,
          description: formData.description || null,
          name_en: formData.name_en || null,
          name_pt: formData.name_pt || null,
          description_en: formData.description_en || null,
          description_pt: formData.description_pt || null,
          pairing: formData.pairing || null,
          pairing_en: formData.pairing_en || null,
          pairing_pt: formData.pairing_pt || null,
          price,
          image_url: resolvedImageUrl,
          is_recommended: formData.is_recommended,
          is_vegan: formData.is_vegan,
          is_spicy: formData.is_spicy,
          is_gluten_free: formData.is_gluten_free,
          is_dairy_free: formData.is_dairy_free,
          allergens: formData.allergens,
        });
        toast.success('Ítem actualizado');
      } else {
        const nextOrder = items?.length || 0;
        await createItem.mutateAsync({
          section_id: sectionId,
          name: formData.name,
          description: formData.description || undefined,
          name_en: formData.name_en || undefined,
          name_pt: formData.name_pt || undefined,
          description_en: formData.description_en || undefined,
          description_pt: formData.description_pt || undefined,
          pairing: formData.pairing || undefined,
          pairing_en: formData.pairing_en || undefined,
          pairing_pt: formData.pairing_pt || undefined,
          price,
          image_url: resolvedImageUrl,
          is_recommended: formData.is_recommended,
          is_vegan: formData.is_vegan,
          is_spicy: formData.is_spicy,
          is_gluten_free: formData.is_gluten_free,
          is_dairy_free: formData.is_dairy_free,
          allergens: formData.allergens,
          sort_order: nextOrder,
        });
        toast.success('Ítem creado');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem.mutateAsync({ id: deleteId, section_id: sectionId });
      toast.success('Ítem eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (item: Item) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        section_id: sectionId,
        is_visible: !item.is_visible,
      });
      toast.success(item.is_visible ? 'Ítem oculto' : 'Ítem visible');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleGenerateMissingImages = async () => {
    const missingItems = localItems.filter((item) => !item.image_url);
    if (missingItems.length === 0) {
      toast.success('Todos los ítems ya tienen imagen');
      return;
    }

    try {
      await Promise.all(
        missingItems.map((item) =>
          updateItem.mutateAsync({
            id: item.id,
            section_id: sectionId,
            image_url: buildAutoImageUrl(item.name),
          })
        )
      );
      toast.success('Imágenes generadas');
    } catch (error) {
      toast.error('No pudimos generar imágenes');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localItems.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {localItems.length > 0 ? (
            localItems.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg bg-background/50",
                    !item.is_visible && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.is_recommended && (
                      <Star className="w-3.5 h-3.5 text-primary" />
                    )}
                    {item.is_vegan && (
                      <Leaf className="w-3.5 h-3.5 text-green-500" />
                    )}
                    {item.is_spicy && (
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                    )}
                    {item.is_gluten_free && (
                      <span className="text-[10px] uppercase tracking-wide text-primary">Sin gluten</span>
                    )}
                    {item.is_dairy_free && (
                      <span className="text-[10px] uppercase tracking-wide text-primary">Sin lactosa</span>
                    )}
                  </div>
                      <p className="text-sm text-primary font-medium">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(item)}
                    >
                      {item.is_visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </SortableItem>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin ítems en esta sección
            </p>
          )}
        </SortableContext>
      </DndContext>

      <div className="grid gap-2 md:grid-cols-2">
        <Button onClick={openCreateDialog} variant="ghost" size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Agregar ítem
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleGenerateMissingImages}
          disabled={!autoImageEnabled}
        >
          Generar imágenes faltantes
        </Button>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar ítem' : 'Nuevo ítem'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Nombre</Label>
              <Input
                id="item-name"
                placeholder="Ej: Milanesa napolitana"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-name-en">Nombre (EN)</Label>
                <Input
                  id="item-name-en"
                  placeholder="English name"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-name-pt">Nombre (PT)</Label>
                <Input
                  id="item-name-pt"
                  placeholder="Nome em português"
                  value={formData.name_pt}
                  onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-desc">Descripción (opcional)</Label>
              <Textarea
                id="item-desc"
                placeholder="Descripción del plato"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-desc-en">Descripción (EN)</Label>
                <Textarea
                  id="item-desc-en"
                  placeholder="English description"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-desc-pt">Descripción (PT)</Label>
                <Textarea
                  id="item-desc-pt"
                  placeholder="Descrição em português"
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="item-pairing">Maridaje</Label>
                <Input
                  id="item-pairing"
                  placeholder="Maridaje sugerido"
                  value={formData.pairing}
                  onChange={(e) => setFormData({ ...formData, pairing: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-pairing-en">Maridaje (EN)</Label>
                <Input
                  id="item-pairing-en"
                  placeholder="Pairing in English"
                  value={formData.pairing_en}
                  onChange={(e) => setFormData({ ...formData, pairing_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-pairing-pt">Maridaje (PT)</Label>
                <Input
                  id="item-pairing-pt"
                  placeholder="Harmonização em português"
                  value={formData.pairing_pt}
                  onChange={(e) => setFormData({ ...formData, pairing_pt: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Precio ($)</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen (opcional)</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="items"
                aspectRatio="wide"
                placeholder="Foto del plato"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      image_url: buildAutoImageUrl(formData.name),
                    })
                  }
                  disabled={!formData.name.trim()}
                >
                  Generar imagen sugerida
                </Button>
                {autoImageEnabled && !formData.image_url && (
                  <span>Se generará automáticamente si no cargas una imagen.</span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.is_recommended}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_recommended: !!checked })
                    }
                  />
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">Recomendado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.is_vegan}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_vegan: !!checked })
                    }
                  />
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Vegano</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.is_spicy}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_spicy: !!checked })
                    }
                  />
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Picante</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.is_gluten_free}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_gluten_free: !!checked })
                    }
                  />
                  <span className="text-sm">Sin gluten</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.is_dairy_free}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_dairy_free: !!checked })
                    }
                  />
                  <span className="text-sm">Sin lactosa</span>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Alérgenos</Label>
              <div className="flex flex-wrap gap-4">
                {allergenOptions.map((allergen) => (
                  <label key={allergen.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.allergens.includes(allergen.id)}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          allergens: checked
                            ? [...formData.allergens, allergen.id]
                            : formData.allergens.filter((value) => value !== allergen.id),
                        })
                      }
                    />
                    <span className="text-sm">{allergen.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={createItem.isPending || updateItem.isPending}
            >
              {(createItem.isPending || updateItem.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingItem ? (
                'Guardar cambios'
              ) : (
                'Crear ítem'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ítem?</AlertDialogTitle>
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
