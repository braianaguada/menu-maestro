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

// Session-based deduplication keys
const MENU_VIEW_KEY = 'menu_view_tracked_';
const PROMO_CLICK_KEY = 'promo_click_tracked_';
const MAX_USER_AGENT_LENGTH = 512;

// Sanitize and truncate user agent string
function sanitizeUserAgent(ua: string): string {
  if (!ua || typeof ua !== 'string') return '';
  return ua.slice(0, MAX_USER_AGENT_LENGTH);
}

// Check if already tracked this session
function hasTrackedThisSession(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

// Mark as tracked this session
function markTrackedThisSession(key: string): void {
  try {
    sessionStorage.setItem(key, 'true');
  } catch {
    // sessionStorage not available, continue without deduplication
  }
}

// Track page view with session deduplication and input validation
export async function trackMenuView(menuId: string) {
  // Validate menuId format (UUID)
  if (!menuId || typeof menuId !== 'string' || !/^[0-9a-f-]{36}$/i.test(menuId)) {
    return;
  }

  const sessionKey = MENU_VIEW_KEY + menuId;
  
  // Deduplicate: only track once per session per menu
  if (hasTrackedThisSession(sessionKey)) {
    return;
  }

  try {
    await supabase.from('menu_views').insert({
      menu_id: menuId,
      user_agent: sanitizeUserAgent(navigator.userAgent),
    });
    markTrackedThisSession(sessionKey);
  } catch (error) {
    // Silently fail - analytics should not break user experience
  }
}

// Track promo click with session deduplication and input validation
export async function trackPromoClick(promotionId: string) {
  // Validate promotionId format (UUID)
  if (!promotionId || typeof promotionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(promotionId)) {
    return;
  }

  const sessionKey = PROMO_CLICK_KEY + promotionId;
  
  // Deduplicate: only track once per session per promo
  if (hasTrackedThisSession(sessionKey)) {
    return;
  }

  try {
    await supabase.from('promo_clicks').insert({
      promotion_id: promotionId,
    });
    markTrackedThisSession(sessionKey);
  } catch (error) {
    // Silently fail - analytics should not break user experience
  }
}
