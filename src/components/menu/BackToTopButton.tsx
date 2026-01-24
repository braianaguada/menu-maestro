import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopButtonProps {
  threshold?: number;
}

export function BackToTopButton({ threshold = 600 }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={cn(
        "fixed bottom-6 md:bottom-8 right-6 md:right-8 z-50",
        "w-10 h-10 md:w-11 md:h-11 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-gold hover:shadow-gold/150",
        "flex items-center justify-center",
        "transition-smooth",
        "hover:scale-110 hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
