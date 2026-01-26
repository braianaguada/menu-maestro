import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Sparkles, BarChart3, Palette, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

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
    title: 'Analítica en Tiempo Real',
    description: 'Conoce cuántas personas visitan tu menú y qué funciona mejor.',
  },
  {
    icon: Palette,
    title: 'Temas Personalizables',
    description: 'Elige entre estilos elegantes que reflejan tu marca.',
  },
];

const benefits = [
  {
    icon: Zap,
    title: 'Actualización Instantánea',
    description: 'Cambia precios y platos en segundos, sin reimprimir.',
  },
  {
    icon: Globe,
    title: 'Acceso desde Cualquier Lugar',
    description: 'Tus clientes escanean un QR y listo.',
  },
  {
    icon: Shield,
    title: 'Seguro y Confiable',
    description: 'Infraestructura profesional para tu negocio.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-[hsl(230_25%_7%)] text-white overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="blur-orb blur-orb-cyan w-[500px] h-[500px] -top-48 -right-48 opacity-40" />
      <div className="blur-orb blur-orb-purple w-[400px] h-[400px] top-1/3 -left-32 opacity-30" />
      <div className="blur-orb blur-orb-pink w-[350px] h-[350px] bottom-20 right-1/4 opacity-25" />

      {/* Navigation */}
      <nav className="relative z-50 container max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-wider text-white">
              MENÚ<span className="text-cyan-400">DIGITAL</span>
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
      <header className="relative pt-16 md:pt-24 pb-20 md:pb-32">
        <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">
              Menús Digitales para Restaurantes
            </span>
          </div>
          
          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
            Tu carta digital,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              elegante y moderna
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Crea menús digitales impresionantes en minutos. 
            Promociones destacadas, múltiples temas y analítica incluida.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="btn-glow text-white font-semibold px-8 h-12 text-base border-0 glow-effect"
            >
              <Link to="/admin">
                Crear mi menú ahora
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
                Ver demostración
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="mt-8 text-sm text-gray-500">
            Sin tarjeta de crédito • Configuración en 5 minutos
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-20 md:py-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Una solución completa para digitalizar tu carta y atraer más clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 md:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400 mb-5 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-colors">
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
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 text-cyan-400 mb-4">
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

      {/* CTA Section */}
      <section className="relative py-24 border-t border-white/5">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Empieza hoy, gratis
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Crea tu primer menú digital en minutos. Sin compromisos.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="btn-glow text-white font-semibold px-10 h-12 text-base border-0 glow-effect"
          >
            <Link to="/admin">
              Comenzar ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/5">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2026 MenuDigital. Hecho con ❤️ para restaurantes.
          </p>
        </div>
      </footer>
    </div>
  );
}
