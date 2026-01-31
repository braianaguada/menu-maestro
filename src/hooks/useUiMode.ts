import { useEffect, useState } from 'react';

type UiMode = 'dark' | 'light';

const STORAGE_KEY = 'menu-maestro-ui-mode';

export function useUiMode() {
  const [mode, setMode] = useState<UiMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem(STORAGE_KEY) as UiMode | null;
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('theme-light', mode === 'light');
    window.localStorage.setItem(STORAGE_KEY, mode);
    return () => {
      document.body.classList.remove('theme-light');
    };
  }, [mode]);

  return { mode, setMode };
}
