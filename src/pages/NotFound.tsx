import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-dark px-6">
      <div className="max-w-lg text-center space-y-5">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          404 · Ruta no encontrada
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
          Esta página no existe
        </h1>
        <p className="text-muted-foreground">
          La ruta <span className="font-medium text-foreground">{location.pathname}</span> no está
          disponible. Volvé al inicio o entrá al dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background/70 px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
