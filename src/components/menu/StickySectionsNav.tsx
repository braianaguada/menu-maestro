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
      const activeChip = scrollRef.current.querySelector(`[data-section-id="${activeSectionId}"]`);
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeSectionId]);

  if (sections.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        "bg-background/92 backdrop-blur-lg border-b border-border/25 shadow-menu-sm",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <div className="container max-w-3xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-4 md:px-6"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              data-section-id={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-smooth-fast",
                "whitespace-nowrap",
                activeSectionId === section.id
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/60"
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
