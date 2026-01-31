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
  useSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, ChevronDown, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ItemsManager } from './ItemsManager';
import type { Section } from '@/types/menu';

interface SectionsManagerProps {
  menuId: string;
  autoImageEnabled?: boolean;
}

export function SectionsManager({ menuId, autoImageEnabled = false }: SectionsManagerProps) {
  const { data: sections, isLoading } = useSections(menuId);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const reorderMutation = useReorderMutation('sections', [['admin-sections', menuId]]);

  const [localSections, setLocalSections] = useState<Section[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    name_en: '',
    name_pt: '',
    description_en: '',
    description_pt: '',
  });
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    if (sections) {
      setLocalSections(sections);
    }
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSections.findIndex(s => s.id === active.id);
    const newIndex = localSections.findIndex(s => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = [...localSections];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      setLocalSections(newItems);
      reorderMutation.mutate(newItems.map((s, i) => ({ id: s.id, sort_order: i })));
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description || '',
      name_en: section.name_en || '',
      name_pt: section.name_pt || '',
      description_en: section.description_en || '',
      description_pt: section.description_pt || '',
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSection(null);
    setFormData({
      name: '',
      description: '',
      name_en: '',
      name_pt: '',
      description_en: '',
      description_pt: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      if (editingSection) {
        await updateSection.mutateAsync({
          id: editingSection.id,
          menu_id: menuId,
          name: formData.name,
          description: formData.description || null,
          name_en: formData.name_en || null,
          name_pt: formData.name_pt || null,
          description_en: formData.description_en || null,
          description_pt: formData.description_pt || null,
        });
        toast.success('Sección actualizada');
      } else {
        const nextOrder = sections?.length || 0;
        await createSection.mutateAsync({
          menu_id: menuId,
          name: formData.name,
          description: formData.description || undefined,
          name_en: formData.name_en || undefined,
          name_pt: formData.name_pt || undefined,
          description_en: formData.description_en || undefined,
          description_pt: formData.description_pt || undefined,
          sort_order: nextOrder,
        });
        toast.success('Sección creada');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSection.mutateAsync({ id: deleteId, menu_id: menuId });
      toast.success('Sección eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (section: Section) => {
    try {
      await updateSection.mutateAsync({
        id: section.id,
        menu_id: menuId,
        is_visible: !section.is_visible,
      });
      toast.success(section.is_visible ? 'Sección oculta' : 'Sección visible');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
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
          items={localSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {localSections.length > 0 ? (
            localSections.map((section) => (
              <SortableItem key={section.id} id={section.id}>
                <Collapsible
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <div className={cn(
                    "gradient-card border rounded-xl overflow-hidden",
                    section.is_visible ? "border-border/50" : "border-yellow-500/30 opacity-75"
                  )}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <ChevronDown className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform",
                            openSections.includes(section.id) && "rotate-180"
                          )} />
                          <div>
                            <h3 className="font-medium text-foreground">{section.name}</h3>
                            {section.description && (
                              <p className="text-sm text-muted-foreground">{section.description}</p>
                            )}
                          </div>
                          {!section.is_visible && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                              Oculto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility(section)}
                          >
                            {section.is_visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(section)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(section.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-border/50 p-4 bg-muted/20">
                        <ItemsManager sectionId={section.id} autoImageEnabled={autoImageEnabled} />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </SortableItem>
            ))
          ) : (
            <div className="gradient-card border border-border/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">No hay secciones aún</p>
            </div>
          )}
        </SortableContext>
      </DndContext>

      <Button onClick={openCreateDialog} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Agregar sección
      </Button>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Editar sección' : 'Nueva sección'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="section-name">Nombre</Label>
              <Input
                id="section-name"
                placeholder="Ej: Entradas"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="section-name-en">Nombre (EN)</Label>
                <Input
                  id="section-name-en"
                  placeholder="Starters"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-name-pt">Nombre (PT)</Label>
                <Input
                  id="section-name-pt"
                  placeholder="Entradas"
                  value={formData.name_pt}
                  onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-desc">Descripción (opcional)</Label>
              <Textarea
                id="section-desc"
                placeholder="Descripción breve"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="section-desc-en">Descripción (EN)</Label>
                <Textarea
                  id="section-desc-en"
                  placeholder="Section description"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-desc-pt">Descripción (PT)</Label>
                <Textarea
                  id="section-desc-pt"
                  placeholder="Descrição breve"
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={createSection.isPending || updateSection.isPending}
            >
              {(createSection.isPending || updateSection.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingSection ? (
                'Guardar cambios'
              ) : (
                'Crear sección'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sección?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán todos los ítems de esta sección. Esta acción no se puede deshacer.
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
