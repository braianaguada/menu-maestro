import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Section } from '@/types/menu';

interface StickySectionsNavProps {
  sections: Section[];
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
}

export function StickySectionsNav({ 
  sections, 
  activeSectionId, 
  onSectionClick 
}: StickySectionsNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show nav after scrolling past header
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll active chip into view
  useEffect(() => {
    if (activeSectionId && scrollRef.current) {
      const container = scrollRef.current;
      const activeChip = container.querySelector(`[data-section-id="${activeSectionId}"]`);
      if (activeChip) {
        const chipElement = activeChip as HTMLElement;
        const targetLeft = chipElement.offsetLeft
          - container.clientWidth / 2
          + chipElement.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }
  }, [activeSectionId]);

  if (sections.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        "bg-background/80 backdrop-blur-lg border-b border-border/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <div className="container max-w-5xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-5 md:px-8"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              data-section-id={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
                "transition-smooth-fast border",
                activeSectionId === section.id
                  ? "bg-primary text-primary-foreground border-primary shadow-gold"
                  : "bg-background/60 text-muted-foreground border-border/40 hover:text-foreground hover:border-primary/40"
              )}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
