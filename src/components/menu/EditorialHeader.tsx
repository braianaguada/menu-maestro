import { cn } from '@/lib/utils';

const heroImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1800&auto=format&fit=crop',
];

const pickHeroImage = (name: string) =>
  heroImages[Math.abs(name.length) % heroImages.length];

interface EditorialHeaderProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export function EditorialHeader({ name, logoUrl, className }: EditorialHeaderProps) {
  const heroImage = pickHeroImage(name);

  return (
    <header className={cn(
      "relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-background" />
      </div>

      <div className="relative z-10">
        <div className="container max-w-5xl mx-auto px-5 md:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <div className="max-w-3xl space-y-6">
            <span className="menu-chip text-white/80 border-white/20 bg-white/10">
              Menú degustación
            </span>

            {logoUrl && (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="h-12 md:h-14 lg:h-16 w-auto object-contain"
              />
            )}

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Cocina contemporánea
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-semibold text-white leading-tight">
                {name}
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Un recorrido sensorial inspirado en ingredientes nobles, técnicas precisas y un
                servicio pensado para ocasiones memorables.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Experiencia gourmet', 'Platos de autor', 'Cocina estacional'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
