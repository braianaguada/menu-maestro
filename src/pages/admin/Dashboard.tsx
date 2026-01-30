import { Link, useNavigate } from 'react-router-dom';
import { useMenus, useCreateMenu } from '@/hooks/useAdminMenus';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Dashboard() {
  const { data: menus, isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const navigate = useNavigate();

  const publishedMenus = menus?.filter(m => m.status === 'published') || [];
  const draftMenus = menus?.filter(m => m.status === 'draft') || [];

  const handleCreateMenu = async () => {
    const slugSuffix = Math.random().toString(36).slice(2, 7);
    const draftPayload = {
      name: 'Nuevo menú',
      slug: `menu-${slugSuffix}`,
      theme: 'elegant',
    };

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

  return (
    <div className="max-w-5xl">
      <div className="mb-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Panel premium
        </p>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Dashboard gastronómico
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Supervisá tus menús con la misma elegancia con la que atendés tu sala.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="gradient-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{menus?.length || 0}</p>
          <p className="text-sm text-muted-foreground">Total Menús</p>
        </div>

        <div className="gradient-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{publishedMenus.length}</p>
          <p className="text-sm text-muted-foreground">Publicados</p>
        </div>

        <div className="gradient-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <FileText className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{draftMenus.length}</p>
          <p className="text-sm text-muted-foreground">Borradores</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="gradient-card border border-border/50 rounded-2xl p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Acciones rápidas
            </h2>
            <p className="text-sm text-muted-foreground">
              Creá un menú y empezá a editar en segundos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreateMenu} disabled={createMenu.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createMenu.isPending ? 'Creando...' : 'Crear nuevo menú'}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/menus">
                Ver todos los menús
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Menus */}
      <div className="gradient-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Menús recientes
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Curaduría
          </span>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : menus && menus.length > 0 ? (
          <div className="space-y-3">
            {menus.slice(0, 5).map(menu => (
              <Link
                key={menu.id}
                to={`/admin/menus/${menu.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted transition-colors group"
              >
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {menu.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    /{menu.slug} • {menu.status === 'published' ? 'Publicado' : 'Borrador'}
                  </p>
                </div>
                {menu.status === 'published' && (
                  <a
                    href={`/m/${menu.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground mb-4">Todavía no creaste un menú</p>
            <Button onClick={handleCreateMenu} disabled={createMenu.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createMenu.isPending ? 'Creando...' : 'Crear mi primer menú'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
