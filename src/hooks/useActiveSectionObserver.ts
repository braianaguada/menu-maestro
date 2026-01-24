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
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    // Set initial active section
    if (!activeSectionId && sectionIds.length > 0) {
      setActiveSectionId(sectionIds[0]);
    }

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Don't update during programmatic scroll
      if (isScrollingRef.current) return;

      // Find intersecting entries
      const intersecting = entries.filter(e => e.isIntersecting);
      
      if (intersecting.length > 0) {
        // Get the one closest to top of viewport
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [sectionIds, offset]);

  const scrollToSection = useCallback((sectionId: string) => {
    // Immediately set active section on click
    setActiveSectionId(sectionId);
    
    // Prevent observer updates during scroll
    isScrollingRef.current = true;
    
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Re-enable observer after scroll completes
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
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
