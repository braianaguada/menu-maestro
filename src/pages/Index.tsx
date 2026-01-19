import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Sparkles, BarChart3, Palette, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Menú Digital Premium',
    description: 'Crea menús elegantes y profesionales que impresionan a tus clientes.',
  },
  {
    icon: Sparkles,
    title: 'Promociones Destacadas',
    description: 'Muestra tus ofertas especiales en un carrusel atractivo.',
  },
  {
    icon: BarChart3,
    title: 'Analítica Simple',
    description: 'Conoce cuántas personas visitan tu menú y qué promociones funcionan.',
  },
  {
    icon: Palette,
    title: 'Múltiples Temas',
    description: 'Elige entre temas elegantes, claros o modernos para tu marca.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container max-w-5xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Menús Digitales Premium</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Tu carta digital,{' '}
              <span className="text-primary">elegante</span> y{' '}
              <span className="text-primary">profesional</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Crea menús digitales impresionantes para tu restaurante o bar. 
              Promociones destacadas, múltiples temas y analítica incluida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-gold text-primary-foreground font-semibold px-8 shadow-gold hover:opacity-90 transition-opacity">
                <Link to="/admin">
                  Crear mi menú
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted">
                <Link to="/m/demo">
                  Ver demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Una solución completa para digitalizar tu carta y atraer más clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 md:p-8 rounded-2xl gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-menu-sm hover:shadow-menu-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Empieza hoy, gratis
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Crea tu primer menú digital en minutos. Sin tarjeta de crédito.
          </p>
          <Button asChild size="lg" className="gradient-gold text-primary-foreground font-semibold px-10 shadow-gold hover:opacity-90 transition-opacity">
            <Link to="/admin">
              Comenzar ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 MenuDigital. Hecho con ❤️ para restaurantes.
          </p>
        </div>
      </footer>
    </div>
  );
}
