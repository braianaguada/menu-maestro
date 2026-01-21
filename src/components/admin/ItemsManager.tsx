import { useState } from 'react';
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '@/hooks/useAdminMenus';
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

interface ItemsManagerProps {
  sectionId: string;
}

const defaultFormData = {
  name: '',
  description: '',
  price: '',
  image_url: null as string | null,
  is_recommended: false,
  is_vegan: false,
  is_spicy: false,
};

export function ItemsManager({ sectionId }: ItemsManagerProps) {
  const { data: items, isLoading } = useItems(sectionId);
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      image_url: item.image_url || null,
      is_recommended: item.is_recommended,
      is_vegan: item.is_vegan,
      is_spicy: item.is_spicy,
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

    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          section_id: sectionId,
          name: formData.name,
          description: formData.description || null,
          price,
          image_url: formData.image_url,
          is_recommended: formData.is_recommended,
          is_vegan: formData.is_vegan,
          is_spicy: formData.is_spicy,
        });
        toast.success('Ítem actualizado');
      } else {
        const nextOrder = items?.length || 0;
        await createItem.mutateAsync({
          section_id: sectionId,
          name: formData.name,
          description: formData.description || undefined,
          price,
          image_url: formData.image_url,
          is_recommended: formData.is_recommended,
          is_vegan: formData.is_vegan,
          is_spicy: formData.is_spicy,
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
      {items && items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
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
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Sin ítems en esta sección
        </p>
      )}

      <Button onClick={openCreateDialog} variant="ghost" size="sm" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Agregar ítem
      </Button>

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
            <div className="space-y-2">
              <Label htmlFor="item-desc">Descripción (opcional)</Label>
              <Textarea
                id="item-desc"
                placeholder="Descripción del plato"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
