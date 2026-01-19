import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PublicMenu, Menu, Section, Item, Promotion } from '@/types/menu';

export function usePublicMenu(slug: string) {
  return useQuery({
    queryKey: ['public-menu', slug],
    queryFn: async (): Promise<PublicMenu | null> => {
      // Fetch menu by slug
      const { data: menu, error: menuError } = await supabase
        .from('menus')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (menuError) throw menuError;
      if (!menu) return null;

      // Fetch sections with items
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Fetch all items for these sections
      const sectionIds = sections?.map(s => s.id) || [];
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .in('section_id', sectionIds)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      // Fetch active promotions
      const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (promosError) throw promosError;

      // Combine sections with their items
      const sectionsWithItems = (sections || []).map(section => ({
        ...section,
        items: (items || []).filter(item => item.section_id === section.id)
      }));

      return {
        ...menu,
        theme: menu.theme as 'elegant' | 'light' | 'modern',
        status: menu.status as 'draft' | 'published',
        sections: sectionsWithItems,
        promotions: promotions || []
      } as PublicMenu;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Track page view
export async function trackMenuView(menuId: string) {
  try {
    await supabase.from('menu_views').insert({
      menu_id: menuId,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
}

// Track promo click
export async function trackPromoClick(promotionId: string) {
  try {
    await supabase.from('promo_clicks').insert({
      promotion_id: promotionId,
    });
  } catch (error) {
    console.error('Failed to track click:', error);
  }
}
