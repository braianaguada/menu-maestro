import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  UtensilsCrossed, 
  LayoutDashboard, 
  FileText, 
  BarChart3,
  CreditCard,
  LogOut,
  Loader2,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/menus', label: 'Mis Menús', icon: FileText },
  { href: '/admin/analytics', label: 'Analítica', icon: BarChart3 },
  { href: '/admin/subscription', label: 'Suscripción', icon: CreditCard },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authVerified, setAuthVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  // Server-side auth verification on mount - prevents UI flash
  useEffect(() => {
    let mounted = true;
    
    const verifyAuth = async () => {
      try {
        // Direct server verification - not relying on cached state
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error || !session) {
          navigate('/auth', { replace: true });
          return;
        }
        
        // Double-check with user fetch to ensure token is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (userError || !user) {
          navigate('/auth', { replace: true });
          return;
        }
        
        setAuthVerified(true);
      } catch {
        if (mounted) {
          navigate('/auth', { replace: true });
        }
      } finally {
        if (mounted) {
          setVerifying(false);
        }
      }
    };
    
    verifyAuth();
    
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  // Show loading state during verification - prevents admin UI flash
  if (verifying || !authVerified) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark relative overflow-hidden">
      <div className="blur-orb blur-orb-cyan w-[480px] h-[480px] -top-40 -right-48 opacity-30" />
      <div className="blur-orb blur-orb-purple w-[420px] h-[420px] top-1/3 -left-40 opacity-25" />
      <div className="blur-orb blur-orb-pink w-[360px] h-[360px] bottom-10 right-1/4 opacity-20" />
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 glass border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
            <span className="font-display font-semibold text-foreground">Menu Maestro</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 pb-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted w-full"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </nav>
        )}
      </header>

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border/50 bg-card/30">
          <div className="p-6 border-b border-border/50">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">Menu Maestro</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border/50">
            <div className="mb-4 px-4">
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
