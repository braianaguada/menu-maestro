import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function MenuNotFound() {
  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Menú no encontrado
        </h1>
        <p className="text-muted-foreground mb-8">
          El menú que buscas no existe o no está disponible en este momento.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
