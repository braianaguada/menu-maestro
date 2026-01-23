// Premium Editorial Menu Themes
// Each theme defines a complete visual identity for the public menu

export type MenuTheme = 'editorial' | 'modern' | 'light' | 'bistro';

export interface ThemeConfig {
  id: MenuTheme;
  name: string;
  className: string;
  description: string;
}

export const menuThemes: Record<MenuTheme, ThemeConfig> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    className: 'theme-editorial',
    description: 'Premium editorial style with warm ivory tones and classic typography',
  },
  modern: {
    id: 'modern',
    name: 'Modern Dark',
    className: 'theme-modern',
    description: 'Sleek dark theme with teal accents, perfect for cocktail bars',
  },
  light: {
    id: 'light',
    name: 'Minimal Light',
    className: 'theme-light',
    description: 'Clean and airy with warm copper accents for cafés and fine dining',
  },
  bistro: {
    id: 'bistro',
    name: 'Bold Bistro',
    className: 'theme-bistro',
    description: 'Warm terracotta and olive tones with a rustic premium feel',
  },
};

// Map old theme names to new ones
export function normalizeTheme(theme: string): MenuTheme {
  const themeMap: Record<string, MenuTheme> = {
    elegant: 'editorial',
    modern: 'modern',
    light: 'light',
    bistro: 'bistro',
  };
  return themeMap[theme] || 'editorial';
}

export function getThemeConfig(theme: string): ThemeConfig {
  const normalized = normalizeTheme(theme);
  return menuThemes[normalized];
}
