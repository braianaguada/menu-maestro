import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function MenuNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-lg space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Menú no disponible
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
            Este menú no está publicado
          </h1>
          <p className="text-muted-foreground">
            El enlace puede estar desactivado o no existe. Volvé al inicio o ingresá al dashboard
            para administrar tus cartas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin">Ir al dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
