import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMenus, useCreateMenu, useDeleteMenu } from '@/hooks/useAdminMenus';
import { Button } from '@/components/ui/button';
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
import { Plus, ExternalLink, Trash2, Edit, FileDown, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getThemeConfig, normalizeTheme } from '@/themes/menuThemes';
import { buildDefaultMenuPayload } from '@/lib/menuDefaults';

export default function MenusList() {
  const { data: menus, isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const deleteMenu = useDeleteMenu();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleQuickCreate = async () => {
    const draftPayload = buildDefaultMenuPayload();

    try {
      const newMenu = await createMenu.mutateAsync(draftPayload);
      toast.success('Menú creado');
      navigate(`/admin/menus/${newMenu.id}`);
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast.error('No pudimos generar un slug único, intenta nuevamente');
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
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Colección
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
            Mis menús
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Ordená, editá y lanzá cartas digitales con una estética coherente y premium.
          </p>
        </div>

        <Button onClick={handleQuickCreate} disabled={createMenu.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          {createMenu.isPending ? 'Creando...' : 'Crear nuevo menú'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : menus && menus.length > 0 ? (
        <div className="grid gap-4">
          {menus.map(menu => (
            <div
              key={menu.id}
              className="gradient-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="font-display text-2xl">
                      {menu.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display text-xl font-semibold text-foreground truncate">
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
                      /m/{menu.slug} • Tema: {getThemeConfig(normalizeTheme(menu.theme)).name}
                    </p>
                  </div>
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
        <div className="gradient-card border border-border/50 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-muted-foreground mb-4">No tienes menús creados</p>
          <Button onClick={handleQuickCreate} disabled={createMenu.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            {createMenu.isPending ? 'Creando...' : 'Crear mi primer menú'}
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
