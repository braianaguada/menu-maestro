import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenus, useCreateMenu, useDeleteMenu } from '@/hooks/useAdminMenus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, ExternalLink, Trash2, Edit, FileDown, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { normalizeTheme } from '@/themes/menuThemes';

export default function MenusList() {
  const { data: menus, isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const deleteMenu = useDeleteMenu();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', theme: 'elegant' });

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Completa todos los campos');
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('El slug solo puede contener letras minúsculas, números y guiones');
      return;
    }

    try {
      await createMenu.mutateAsync(formData);
      toast.success('Menú creado');
      setDialogOpen(false);
      setFormData({ name: '', slug: '', theme: 'elegant' });
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        toast.error('Ya existe un menú con ese slug');
      } else {
        toast.error('Error al crear el menú');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteMenu.mutateAsync(deleteId);
      toast.success('Menú eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setDeleteId(null);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Mis Menús
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos tus menús digitales
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo menú
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo menú</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del local</Label>
                <Input
                  id="name"
                  placeholder="Mi Restaurante"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL del menú</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/m/</span>
                  <Input
                    id="slug"
                    placeholder="mi-restaurante"
                    value={formData.slug}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') 
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData({ ...formData, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elegant">Elegante (Oscuro)</SelectItem>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="modern">Moderno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreate} 
                className="w-full"
                disabled={createMenu.isPending}
              >
                {createMenu.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Crear menú'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : menus && menus.length > 0 ? (
        <div className="space-y-4">
          {menus.map(menu => (
            <div
              key={menu.id}
              className="gradient-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {menu.name}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      menu.status === 'published' 
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {menu.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    /m/{menu.slug} • Tema: {menu.theme}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {menu.status === 'published' && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/m/${menu.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`/m/${menu.slug}/print?theme=${normalizeTheme(menu.theme)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Descargar PDF de ${menu.name}`}
                    >
                      <FileDown className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/menus/${menu.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDeleteId(menu.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="gradient-card border border-border/50 rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No tienes menús creados</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear mi primer menú
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todas las secciones, 
              ítems y promociones asociadas.
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
