import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PublicMenu, Menu, Section, Item, Promotion } from '@/types/menu';
import { demoMenu } from '@/data/demoMenu';

// Explicit column selection for public menu queries - excludes user_id for privacy
const PUBLIC_MENU_COLUMNS = 'id, name, slug, logo_url, status, theme, created_at, updated_at';
const PUBLIC_SECTION_COLUMNS = 'id, menu_id, name, description, sort_order, is_visible, created_at, updated_at';
const PUBLIC_ITEM_COLUMNS = 'id, section_id, name, description, price, image_url, sort_order, is_visible, is_spicy, is_vegan, is_recommended, created_at, updated_at';
const PUBLIC_PROMO_COLUMNS = 'id, menu_id, title, description, price_text, image_url, is_active, starts_at, ends_at, linked_item_id, linked_section_id, sort_order, created_at, updated_at';

export function usePublicMenu(slug: string) {
  return useQuery({
    queryKey: ['public-menu', slug],
    queryFn: async (): Promise<PublicMenu | null> => {
      if (slug === 'demo') {
        return demoMenu;
      }

      // Fetch menu by slug - explicitly select only public columns (excludes user_id)
      const { data: menu, error: menuError } = await supabase
        .from('menus')
        .select(PUBLIC_MENU_COLUMNS)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (menuError) throw menuError;
      if (!menu) return null;

      // Fetch sections - explicitly select only public columns
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select(PUBLIC_SECTION_COLUMNS)
        .eq('menu_id', menu.id)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Fetch all items for these sections - explicitly select only public columns
      const sectionIds = sections?.map(s => s.id) || [];
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(PUBLIC_ITEM_COLUMNS)
        .in('section_id', sectionIds)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      // Fetch active promotions - explicitly select only public columns
      const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select(PUBLIC_PROMO_COLUMNS)
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
        // Add a placeholder user_id for type compatibility (never exposed from DB)
        user_id: '',
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
