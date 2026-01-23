import { useState, useEffect, useRef, useCallback } from 'react';

interface UseActiveSectionObserverProps {
  sectionIds: string[];
  offset?: number;
}

export function useActiveSectionObserver({ 
  sectionIds, 
  offset = 120 
}: UseActiveSectionObserverProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${offset}px 0px -70% 0px`,
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting section
      const intersecting = entries.filter(e => e.isIntersecting);
      
      if (intersecting.length > 0) {
        // Get the one closest to top
        const sorted = intersecting.sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        const sectionId = sorted[0].target.id.replace('section-', '');
        setActiveSectionId(sectionId);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(`section-${id}`);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, offset]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [offset]);

  const scrollToItem = useCallback((itemId: string) => {
    const element = document.getElementById(`item-${itemId}`);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      
      // Highlight effect
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
      }, 2000);
    }
  }, [offset]);

  return {
    activeSectionId,
    scrollToSection,
    scrollToItem,
  };
}
