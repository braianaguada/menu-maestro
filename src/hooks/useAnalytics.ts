import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface DailyViews {
  date: string;
  views: number;
}

export interface PromoStats {
  promotion_id: string;
  title: string;
  clicks: number;
  menu_name: string;
}

export function useMenuViews(menuId: string | undefined, days: number = 14) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-views', menuId, days],
    queryFn: async (): Promise<DailyViews[]> => {
      const startDate = startOfDay(subDays(new Date(), days - 1));
      const endDate = endOfDay(new Date());

      const { data, error } = await supabase
        .from('menu_views')
        .select('viewed_at')
        .eq('menu_id', menuId!)
        .gte('viewed_at', startDate.toISOString())
        .lte('viewed_at', endDate.toISOString());

      if (error) throw error;

      // Group by date
      const viewsByDate: Record<string, number> = {};
      
      // Initialize all days with 0
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
        viewsByDate[date] = 0;
      }

      // Count views per day
      data?.forEach(view => {
        const date = format(new Date(view.viewed_at), 'yyyy-MM-dd');
        if (viewsByDate[date] !== undefined) {
          viewsByDate[date]++;
        }
      });

      return Object.entries(viewsByDate).map(([date, views]) => ({
        date,
        views,
      }));
    },
    enabled: !!menuId && !!user,
  });
}

export function useAllMenusViews(days: number = 14) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-all-views', user?.id, days],
    queryFn: async (): Promise<{ totalViews: number; dailyViews: DailyViews[] }> => {
      // First get user's menus
      const { data: menus, error: menusError } = await supabase
        .from('menus')
        .select('id')
        .eq('user_id', user!.id);

      if (menusError) throw menusError;
      if (!menus?.length) return { totalViews: 0, dailyViews: [] };

      const menuIds = menus.map(m => m.id);
      const startDate = startOfDay(subDays(new Date(), days - 1));
      const endDate = endOfDay(new Date());

      const { data, error } = await supabase
        .from('menu_views')
        .select('viewed_at')
        .in('menu_id', menuIds)
        .gte('viewed_at', startDate.toISOString())
        .lte('viewed_at', endDate.toISOString());

      if (error) throw error;

      // Group by date
      const viewsByDate: Record<string, number> = {};
      
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
        viewsByDate[date] = 0;
      }

      data?.forEach(view => {
        const date = format(new Date(view.viewed_at), 'yyyy-MM-dd');
        if (viewsByDate[date] !== undefined) {
          viewsByDate[date]++;
        }
      });

      const dailyViews = Object.entries(viewsByDate).map(([date, views]) => ({
        date,
        views,
      }));

      return {
        totalViews: data?.length || 0,
        dailyViews,
      };
    },
    enabled: !!user,
  });
}

export function useTopPromos(days: number = 30) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-top-promos', user?.id, days],
    queryFn: async (): Promise<PromoStats[]> => {
      // Get user's menus
      const { data: menus, error: menusError } = await supabase
        .from('menus')
        .select('id, name')
        .eq('user_id', user!.id);

      if (menusError) throw menusError;
      if (!menus?.length) return [];

      const menuMap = new Map(menus.map(m => [m.id, m.name]));
      const menuIds = menus.map(m => m.id);

      // Get promotions for these menus
      const { data: promotions, error: promosError } = await supabase
        .from('promotions')
        .select('id, title, menu_id')
        .in('menu_id', menuIds);

      if (promosError) throw promosError;
      if (!promotions?.length) return [];

      const promoIds = promotions.map(p => p.id);
      const startDate = startOfDay(subDays(new Date(), days - 1));

      // Get clicks for these promotions
      const { data: clicks, error: clicksError } = await supabase
        .from('promo_clicks')
        .select('promotion_id')
        .in('promotion_id', promoIds)
        .gte('clicked_at', startDate.toISOString());

      if (clicksError) throw clicksError;

      // Count clicks per promo
      const clickCounts: Record<string, number> = {};
      clicks?.forEach(click => {
        clickCounts[click.promotion_id] = (clickCounts[click.promotion_id] || 0) + 1;
      });

      // Build stats
      const stats: PromoStats[] = promotions.map(promo => ({
        promotion_id: promo.id,
        title: promo.title,
        clicks: clickCounts[promo.id] || 0,
        menu_name: menuMap.get(promo.menu_id) || 'Unknown',
      }));

      // Sort by clicks descending
      return stats.sort((a, b) => b.clicks - a.clicks).slice(0, 10);
    },
    enabled: !!user,
  });
}
