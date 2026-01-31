import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PublicMenu, Menu } from '@/types/menu';
import { demoMenu } from '@/data/demoMenu';

type PublicMenuOptions = {
  preview?: boolean;
};

export function usePublicMenu(slug: string, options?: PublicMenuOptions) {
  return useQuery({
    queryKey: ['public-menu', slug, options?.preview],
    queryFn: async (): Promise<PublicMenu | null> => {
      if (slug === 'demo') {
        return demoMenu;
      }

      // Fetch menu by slug
      const menuQuery = supabase
        .from('menus')
        .select('*')
        .eq('slug', slug);

      if (!options?.preview) {
        menuQuery.eq('status', 'published');
      }

      const { data: menu, error: menuError } = await menuQuery.maybeSingle();

      if (menuError) throw menuError;
      if (!menu) return null;

      // Fetch sections
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (sectionsError) throw sectionsError;

      const sectionIds = sections?.map(s => s.id) || [];
      // Fetch all items for these sections
      const items = sectionIds.length > 0
        ? await supabase
          .from('items')
          .select('*')
          .in('section_id', sectionIds)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
        : { data: [], error: null };

      if (items.error) throw items.error;

      // Fetch active promotions
      const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (promosError) throw promosError;

      // Combine sections with their items
      const itemsData = items.data ?? [];
      const sectionsWithItems = (sections || []).map(section => ({
        ...section,
        items: itemsData.filter(item => item.section_id === section.id),
      }));

      const { user_id: _userId, ...publicMenu } = menu as Menu;

      return {
        ...publicMenu,
        // Add a placeholder user_id for type compatibility (never exposed from DB)
        user_id: '',
        theme: menu.theme as Menu['theme'],
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
const MAX_SOURCE_LENGTH = 32;

// Sanitize and truncate user agent string
function sanitizeUserAgent(ua: string): string {
  if (!ua || typeof ua !== 'string') return '';
  return ua.slice(0, MAX_USER_AGENT_LENGTH);
}

function sanitizeSource(source?: string | null): string | null {
  if (!source || typeof source !== 'string') return null;
  return source.slice(0, MAX_SOURCE_LENGTH);
}

function buildUserAgent(ua: string, source?: string | null): string {
  const cleanUA = sanitizeUserAgent(ua);
  const cleanSource = sanitizeSource(source);
  if (!cleanSource) return cleanUA;
  return `${cleanUA} | source:${cleanSource}`.slice(0, MAX_USER_AGENT_LENGTH);
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
export async function trackMenuView(menuId: string, source?: string | null) {
  // Validate menuId format (UUID)
  if (!menuId || typeof menuId !== 'string' || !/^[0-9a-f-]{36}$/i.test(menuId)) {
    return;
  }

  const sourceKey = sanitizeSource(source) || 'direct';
  const sessionKey = `${MENU_VIEW_KEY}${menuId}:${sourceKey}`;
  
  // Deduplicate: only track once per session per menu
  if (hasTrackedThisSession(sessionKey)) {
    return;
  }

  try {
    await supabase.from('menu_views').insert({
      menu_id: menuId,
      user_agent: buildUserAgent(navigator.userAgent, source),
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
