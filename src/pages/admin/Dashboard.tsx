import { Link } from 'react-router-dom';
import { useMenus } from '@/hooks/useAdminMenus';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Eye, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: menus, isLoading } = useMenus();

  const publishedMenus = menus?.filter(m => m.status === 'published') || [];
  const draftMenus = menus?.filter(m => m.status === 'draft') || [];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus menús digitales
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="gradient-card border border-border/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{menus?.length || 0}</p>
          <p className="text-sm text-muted-foreground">Total Menús</p>
        </div>

        <div className="gradient-card border border-border/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{publishedMenus.length}</p>
          <p className="text-sm text-muted-foreground">Publicados</p>
        </div>

        <div className="gradient-card border border-border/50 rounded-xl p-5">
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
      <div className="gradient-card border border-border/50 rounded-xl p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/menus?create=1">
              <Plus className="w-4 h-4 mr-2" />
              Crear nuevo menú
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/menus">
              Ver todos los menús
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Menus */}
      <div className="gradient-card border border-border/50 rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Menús recientes
        </h2>
        
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
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted transition-colors group"
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
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No tienes menús aún</p>
            <Button asChild>
              <Link to="/admin/menus?create=1">
                <Plus className="w-4 h-4 mr-2" />
                Crear mi primer menú
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
