import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$12',
    description: 'Ideal para locales pequeños que están empezando.',
    features: ['1 menú publicado', 'QR descargable', 'Promociones básicas', 'Soporte por email'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Para equipos que quieren crecer con analítica avanzada.',
    features: [
      'Menús ilimitados',
      'Promociones avanzadas',
      'Analítica en tiempo real',
      'Exportación CSV',
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
      'Integraciones a medida',
      'Reportes avanzados',
      'SLA dedicado',
    ],
    highlighted: false,
  },
];

export default function Subscription() {
  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Suscripción
        </h1>
        <p className="text-muted-foreground">
          Elegí el plan que mejor se adapte a tu operación. Pagos seguros con Stripe.
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
