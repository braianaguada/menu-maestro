import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$12',
    description: 'Ideal para locales pequeños que están empezando.',
    features: [
      '1 menú publicado',
      'QR descargable',
      'Filtros básicos',
      'Soporte por email',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Para equipos que quieren crecer con analítica avanzada.',
    features: [
      'Menús ilimitados',
      'Promociones avanzadas',
      'Analítica avanzada',
      'Multilenguaje ES/EN/PT',
      'Filtros premium',
      'Exportación premium',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Operaciones multi-local con integraciones personalizadas.',
    features: [
      'Multi-sucursal',
      'Integraciones POS / delivery',
      'Roles y permisos',
      'Versionado y rollback',
      'A/B testing',
      'SLA dedicado',
    ],
    highlighted: false,
  },
];

const addons = [
  {
    title: 'QR personalizado con branding',
    description: 'QR dinámico con métricas de escaneo y diseño premium.',
  },
  {
    title: 'Dominio propio + white label light',
    description: 'Tu marca primero con onboarding visual asistido.',
  },
  {
    title: 'Soporte VIP + onboarding asistido',
    description: 'Equipo dedicado para operaciones de alto volumen.',
  },
  {
    title: 'Integraciones Enterprise',
    description: 'Conexión con BI, POS y soluciones de delivery.',
  },
  {
    title: 'Modo offline / PWA',
    description: 'Menú instantáneo incluso con Wi-Fi débil.',
  },
  {
    title: 'Impresión premium',
    description: 'PDF elegante con tipografías finas.',
  },
];

export default function Subscription() {
  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Planes
        </p>
        <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
          Suscripción
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Elegí el plan que mejor se adapte a tu operación. Pagos seguros y escalables.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-2xl border border-border/50 p-6 shadow-menu-sm bg-card/60',
              plan.highlighted && 'border-primary/60 shadow-gold'
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
              {plan.highlighted && (
                <span className="menu-chip bg-primary/20 text-primary border-primary/40">
                  Recomendado
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.price !== 'Custom' && (
                <span className="text-sm text-muted-foreground">/mes</span>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="mt-6 w-full" variant={plan.highlighted ? 'default' : 'outline'}>
              {plan.price === 'Custom' ? 'Contactar ventas' : 'Elegir plan'}
            </Button>
          </div>
        ))}
      </div>

      <div className="gradient-card border border-border/50 rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Add-ons premium
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Complementos para elevar la marca
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Escalá tu menú con branding, soporte VIP e integraciones de alto ticket.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {addons.map((addon) => (
            <div key={addon.title} className="rounded-xl border border-border/50 bg-card/60 p-4">
              <h3 className="text-base font-semibold text-foreground">{addon.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{addon.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-card border border-border/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">¿Necesitás ayuda?</h3>
          <p className="text-sm text-muted-foreground">
            Nuestro equipo puede ayudarte a configurar el mejor plan para tu negocio.
          </p>
        </div>
        <Button variant="outline">Agendar demo</Button>
      </div>
    </div>
  );
}
