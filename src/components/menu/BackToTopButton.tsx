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
        "fixed bottom-6 right-6 z-50",
        "w-12 h-12 rounded-full",
        "bg-card/90 backdrop-blur-sm border border-border/50",
        "shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:bg-card hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5 text-foreground" />
    </button>
  );
}
