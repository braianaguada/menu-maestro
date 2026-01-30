import type { MenuTheme } from '@/types/menu';

const DEFAULT_MENU_NAME = 'Nuevo menú';
const DEFAULT_MENU_THEME: MenuTheme = 'editorial';

export function buildDefaultMenuPayload() {
  const slugSuffix = Math.random().toString(36).slice(2, 7);

  return {
    name: DEFAULT_MENU_NAME,
    slug: `menu-${slugSuffix}`,
    theme: DEFAULT_MENU_THEME,
  };
}
