import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, UtensilsCrossed, Wallet, ShieldCheck, Leaf, Check } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Estética fine dining',
    description: 'Tipografías con carácter, espacios amplios y fotografía protagonista.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Carta viva',
    description: 'Actualizá tu menú en segundos sin perder coherencia visual.',
  },
  {
    icon: Star,
    title: 'Promos que seducen',
    description: 'Destacá tus platos estrella como piezas editoriales.',
  },
  {
    icon: Wallet,
    title: 'Listo para vender',
    description: 'QR, PDF premium y analítica para tomar decisiones rápidas.',
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Operación estable',
    description: 'Infraestructura segura para equipos gastronómicos exigentes.',
  },
  {
    icon: Leaf,
    title: 'Marca coherente',
    description: 'Temas elegantes que hablan el mismo idioma en cada vista.',
  },
  {
    icon: Sparkles,
    title: 'Experiencia memorable',
    description: 'Una carta digital que se siente como un restaurante premium.',
  },
];

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

export default function Index() {
  return (
    <div className="min-h-screen bg-[hsl(230_22%_6%)] text-white overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="blur-orb blur-orb-cyan w-[500px] h-[500px] -top-48 -right-48 opacity-40" />
      <div className="blur-orb blur-orb-purple w-[400px] h-[400px] top-1/3 -left-32 opacity-30" />
      <div className="blur-orb blur-orb-pink w-[350px] h-[350px] bottom-20 right-1/4 opacity-25" />

      {/* Navigation */}
      <nav className="relative z-50 container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold tracking-wider text-white">
              MENÚ<span className="text-primary">MAESTRO</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/m/demo" 
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              Ver Demo
            </Link>
            <Button 
              asChild 
              size="sm"
              className="btn-glow text-white font-semibold px-5 border-0"
            >
              <Link to="/admin">
                Empezar
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="relative z-10 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.3em] text-gray-300">
                  Menú digital premium
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mb-6 tracking-tight">
                Tu carta se ve
                <br />
                <span className="text-primary">tan bien</span> como sabe.
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                Una experiencia gastronómica digital que despierta hambre, deseo y decisión
                de compra en segundos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="btn-glow text-white font-semibold px-8 h-12 text-base border-0 glow-effect"
                >
                  <Link to="/admin">
                    Crear menú ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-12 text-base backdrop-blur-sm"
                >
                  <Link to="/m/demo">
                    Ver demo
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em] text-gray-500">
                <span>Fine dining</span>
                <span>Digital</span>
                <span>Premium</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] border border-white/10 bg-white/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-menu-lg">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400&auto=format&fit=crop"
                  alt="Plato premium"
                  className="h-[420px] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-lg p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    Menú degustación
                  </p>
                  <p className="font-display text-2xl text-white mt-1">
                    Sabores que cuentan una historia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-20 md:py-24 border-t border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
              Diseño con intención
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Una identidad gastronómica editorial, limpia y con foco total en el producto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 md:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-5 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 border-t border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                Cómo se ve un menú
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
                Editorial. Claro. Irresistible.
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Cada sección está pensada como una pieza de revista: fotos protagonistas,
                jerarquía tipográfica y espacio en blanco para respirar.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="menu-chip border-white/15 bg-white/5 text-white/70">
                  Hero impactante
                </span>
                <span className="menu-chip border-white/15 bg-white/5 text-white/70">
                  Promos destacadas
                </span>
                <span className="menu-chip border-white/15 bg-white/5 text-white/70">
                  Secciones claras
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] border border-white/10 bg-white/5 blur-xl" />
              <div className="relative grid gap-4 rounded-[2rem] border border-white/10 bg-black/40 p-5 backdrop-blur-xl shadow-menu-lg">
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                    alt="Entradas"
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Entradas</p>
                    <p className="font-display text-xl text-white">Sabores que abren la noche</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {['Ravioles de trufa', 'Bruschetta mediterránea'].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Signature</p>
                      <p className="font-display text-lg text-white">{item}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Presentación impecable, texturas que sorprenden.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 border-t border-white/5">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-primary mb-4">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 border-t border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
              Suscripción
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
              Elegí tu plan para empezar hoy
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Pensado para restaurantes que quieren verse tan bien como se sirven.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={[
                  'rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-menu-sm backdrop-blur',
                  plan.highlighted ? 'border-primary/60 shadow-gold' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="menu-chip bg-primary/20 text-primary border-primary/40">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-400">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-white">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-sm text-gray-500">/mes</span>
                  )}
                </div>

                <ul className="mt-6 space-y-3 text-sm text-gray-400">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link to="/auth">
                    {plan.price === 'Custom' ? 'Contactar ventas' : 'Elegir plan'}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            Menús que se sienten como un restaurante real
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Dale a tu carta el mismo nivel de detalle que a tu cocina. El resto se vende solo.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="btn-glow text-white font-semibold px-10 h-12 text-base border-0 glow-effect"
          >
            <Link to="/admin">
              Crear mi menú premium
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-white/5">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Menu Maestro · Experiencias gastronómicas digitales
          </p>
        </div>
      </footer>
    </div>
  );
}
