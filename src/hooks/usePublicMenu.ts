import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PublicMenu, Menu } from '@/types/menu';
import { demoMenu } from '@/data/demoMenu';

// Explicit column selection for public menu queries - excludes user_id for privacy
const PUBLIC_MENU_COLUMNS = [
  'id',
  'name',
  'name_en',
  'name_pt',
  'slug',
  'logo_url',
  'custom_domain',
  'auto_image_enabled',
  'qr_primary_color',
  'qr_background_color',
  'qr_logo_url',
  'cta_label',
  'cta_url',
  'pos_url',
  'delivery_url',
  'hide_branding',
  'status',
  'theme',
  'created_at',
  'updated_at',
].join(', ');
const PUBLIC_SECTION_COLUMNS = [
  'id',
  'menu_id',
  'name',
  'name_en',
  'name_pt',
  'description',
  'description_en',
  'description_pt',
  'sort_order',
  'is_visible',
  'created_at',
  'updated_at',
].join(', ');
const PUBLIC_ITEM_COLUMNS = [
  'id',
  'section_id',
  'name',
  'name_en',
  'name_pt',
  'description',
  'description_en',
  'description_pt',
  'pairing',
  'pairing_en',
  'pairing_pt',
  'price',
  'image_url',
  'sort_order',
  'is_visible',
  'is_spicy',
  'is_vegan',
  'is_recommended',
  'is_gluten_free',
  'is_dairy_free',
  'allergens',
  'created_at',
  'updated_at',
].join(', ');
const PUBLIC_PROMO_COLUMNS = [
  'id',
  'menu_id',
  'title',
  'title_en',
  'title_pt',
  'description',
  'description_en',
  'description_pt',
  'price_text',
  'price_text_en',
  'price_text_pt',
  'image_url',
  'is_active',
  'starts_at',
  'ends_at',
  'linked_item_id',
  'linked_section_id',
  'ab_group',
  'ab_weight',
  'sort_order',
  'created_at',
  'updated_at',
].join(', ');

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

      const sectionIds = sections?.map(s => s.id) || [];
      // Fetch all items for these sections - explicitly select only public columns
      const items = sectionIds.length > 0
        ? await supabase
          .from('items')
          .select(PUBLIC_ITEM_COLUMNS)
          .in('section_id', sectionIds)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
        : { data: [], error: null };

      if (items.error) throw items.error;

      // Fetch active promotions - explicitly select only public columns
      const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select(PUBLIC_PROMO_COLUMNS)
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

      return {
        ...menu,
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
