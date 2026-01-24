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
        "bg-background/95 backdrop-blur-sm border-b border-border/20",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <div className="container max-w-4xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide py-3 px-6 md:px-8"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              data-section-id={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 text-caption font-medium transition-smooth-fast",
                "whitespace-nowrap",
                activeSectionId === section.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
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